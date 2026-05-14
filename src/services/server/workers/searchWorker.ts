import { Worker, Job } from 'bullmq';
import { redisConnection, QUEUES } from '../../../lib/queue/client';
import { prisma } from '../../../lib/db';
import { getProviderByName } from '../providers/index';
import { scrapingService } from '../scrapingService';
import { usageService } from '../usageService';
import { enrichCompanyData } from '../../../lib/ai/companyEnrichment';
import { generateEmbedding } from '../../../lib/ai/embeddings';

export function createSearchWorker() {
  if (!redisConnection) return null;

  return new Worker(QUEUES.SEARCH, async (job: Job) => {
    const { sourceName, prompt, searchId, organizationId, limit, mode, plan } = job.data;
    
    console.log(`[SearchWorker] Processing source: ${sourceName} for search ${searchId}`);

    const provider = getProviderByName(sourceName);
    if (!provider) throw new Error(`Provider ${sourceName} not found`);

    // Create ScrapingJob record
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

      for (const res of results) {
        try {
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

          // Optional Deep Enrichment
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

    } catch (error: any) {
      await scrapingService.updateJob(scrapingJob.id, {
        status: 'failed',
        completedAt: new Date(),
        errorMessage: error.message
      });
      throw error;
    }
  }, { connection: redisConnection });
}
