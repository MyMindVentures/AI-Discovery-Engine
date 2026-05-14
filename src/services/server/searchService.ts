import { prisma } from "../../lib/db";
import { scrapingService } from "./scrapingService";
import { planSearchQuery } from "../../lib/ai/queryPlanner";
import { getProviderByName } from "./providers/index";
import { usageService } from "./usageService";
import { billingService } from "./billingService";
import { enrichCompanyData } from "../../lib/ai/companyEnrichment";
import { generateEmbedding } from "../../lib/ai/embeddings";

import { addJob, QUEUES } from "../../lib/queue/client";

export const searchService = {
  async runSearch(params: { 
    prompt: string, 
    mode: string, 
    sources?: string[], 
    organizationId: string,
    limit?: number 
  }) {
    const { prompt, mode, organizationId, limit = 50 } = params;

    // Check Billing Limits
    const canSearch = await billingService.canUseFeature(organizationId, 'searches');
    if (!canSearch) {
      throw new Error("PLAN_LIMIT_EXCEEDED: Search limit reached for this period. Please upgrade your plan.");
    }

    // Record usage
    await billingService.recordUsage(organizationId, 'search');

    // 1. Plan with AI
    const { plan, usage } = await planSearchQuery(prompt, { mode, limit });
    
    if (usage) {
      await usageService.track(organizationId, 'ai_tokens_plan', usage.totalTokens || 0, 'tokens', { prompt });
    }

    const selectedSources = params.sources && params.sources.length > 0 
      ? params.sources 
      : plan.recommendedSources;

    // 2. Create Search Record
    const search = await prisma.search.create({
      data: {
        query: prompt,
        originalPrompt: prompt,
        filters: plan as any,
        organizationId,
        status: 'running'
      }
    });

    // 3. Initiate Providers via Queue
    const jobPromises = selectedSources.map(async (sourceName: string) => {
      const jobData = {
        sourceName,
        prompt,
        searchId: search.id,
        organizationId,
        limit,
        mode,
        plan
      };

      return addJob(
        QUEUES.SEARCH, 
        `search-${sourceName}`, 
        jobData,
        async (data) => this.processProviderSearch(data)
      );
    });

    await Promise.all(jobPromises);

    // Initial check for search status - if no jobs were queued (maybe misconfiguration), mark completed
    if (selectedSources.length === 0) {
      await prisma.search.update({
        where: { id: search.id },
        data: { status: 'completed' }
      });
    }

    return this.getSearchResults(search.id);
  },

  async processProviderSearch(data: any) {
    const { sourceName, prompt, searchId, organizationId, limit, mode, plan } = data;
    
    const provider = getProviderByName(sourceName);
    if (!provider) throw new Error(`Provider ${sourceName} not found`);

    const scrapingJob = await scrapingService.createJob({
      source: sourceName,
      prompt: `Plan: ${plan.targetCompanyType} in ${plan.targetLocation}`,
      searchId: searchId,
      organizationId
    });

    try {
      if (!provider.isConfigured()) {
        throw new Error(`Provider ${sourceName} not configured (Missing API Key)`);
      }

      const results = await provider.search(prompt, { limit });
      
      let createdCount = 0;
      let dupeCount = 0;

      for (let i = 0; i < results.length; i++) {
        const res = results[i];
        try {
          const progressPercent = Math.round(((i + 1) / results.length) * 100);
          if (i % 5 === 0) { // Update DB every 5 records to avoid too many writes
            await scrapingService.updateJob(scrapingJob.id, { progress: progressPercent });
          }

          const company = await prisma.company.upsert({
            where: { 
              organizationId_domain: { 
                organizationId, 
                domain: res.domain || `${res.name.toLowerCase().replace(/\s+/g, '-')}.local` 
              } 
            },
            update: { 
              updatedAt: new Date(),
              metadata: { ...res.metadata, lastSource: sourceName }
            },
            create: {
              name: res.name,
              domain: res.domain || `${res.name.toLowerCase().replace(/\s+/g, '-')}.local`,
              website: res.website,
              description: res.description,
              industry: res.industry,
              location: res.location,
              linkedin: res.linkedin,
              twitter: res.twitter,
              organizationId
            }
          });

          await prisma.searchResult.create({
            data: {
              searchId: searchId,
              companyId: company.id,
              relevance: 1.0,
              matchReason: `Found via ${sourceName}`
            }
          });

          await prisma.sourceRecord.create({
            data: {
              companyId: company.id,
              source: sourceName,
              url: res.website,
              rawPayload: res as any
            }
          });

          createdCount++;

          if (mode === 'deep' || mode === 'monitor') {
             const enrichment = await enrichCompanyData(company.name, { ...res, description: company.description });
             if (enrichment.usage) {
               await usageService.track(organizationId, 'ai_tokens_enrich', enrichment.usage.totalTokens || 0, 'tokens', { companyId: company.id });
             }

             const embedResult = await generateEmbedding(`${company.name} ${enrichment.enriched.shortSummary} ${enrichment.enriched.industry}`);
             
             await prisma.company.update({
               where: { id: company.id },
               data: {
                 description: enrichment.enriched.shortSummary,
                 industry: enrichment.enriched.industry,
                 embedding: embedResult?.embedding as any,
                 metadata: {
                   ...(company.metadata as any),
                   ai_scores: {
                      relevance: enrichment.enriched.relevanceScore,
                      confidence: enrichment.enriched.confidenceScore,
                      startup_friendly: enrichment.enriched.startupFriendlyScore,
                   },
                   partnership_potential: enrichment.enriched.partnershipPotential,
                   contact_approach: enrichment.enriched.suggestedContactApproach
                 }
               }
             });
          }
        } catch (e) {
          dupeCount++;
        }
      }

      await scrapingService.updateJob(scrapingJob.id, {
        status: 'completed',
        completedAt: new Date(),
        recordsFound: results.length,
        recordsCreated: createdCount,
        duplicates: dupeCount
      });

      // Check if all jobs for this search are done to update search status
      const allJobs = await prisma.scrapingJob.findMany({ where: { searchId } });
      const allDone = allJobs.every(j => j.status === 'completed' || j.status === 'failed');
      if (allDone) {
        await prisma.search.update({
          where: { id: searchId },
          data: { status: 'completed' }
        });
      }

    } catch (error: any) {
      await scrapingService.updateJob(scrapingJob.id, {
        status: 'failed',
        completedAt: new Date(),
        errorMessage: error.message
      });
      throw error;
    }
  },

  async getSearchResults(searchId: string) {
    return prisma.searchResult.findMany({
      where: { searchId },
      include: { 
        company: {
          include: { tags: true }
        }
      }
    });
  }
};
