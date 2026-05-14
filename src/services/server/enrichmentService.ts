import { prisma } from "../../lib/db";
import { getProviderByName } from "./providers/index";
import { usageService } from "./usageService";
import { enrichCompanyData } from "../../lib/ai/companyEnrichment";
import { Company } from "@prisma/client";

export const enrichmentService = {
  async enrichCompany(companyId: string, enrichmentTypes: string[], orgId: string) {
    const company = await prisma.company.findUnique({ 
      where: { id: companyId },
      include: { organization: true }
    });
    
    if (!company) throw new Error("Company not found");

    const results: any = {
      steps: [],
      errors: []
    };

    let updatedData: any = {
      updatedAt: new Date(),
      metadata: { ...(company.metadata as any), lastEnriched: new Date().toISOString() }
    };

    const domain = company.domain || (company.website ? new URL(company.website).hostname : null);

    // 1. Website Crawl (Firecrawl)
    if (enrichmentTypes.includes('website_crawl') && company.website) {
      try {
        const firecrawl = getProviderByName('Firecrawl');
        if (firecrawl && firecrawl.isConfigured()) {
          const crawlResults = await firecrawl.search(company.website, { limit: 1 });
          if (crawlResults.length > 0) {
            const first = crawlResults[0];
            updatedData.description = first.description || updatedData.description;
            results.steps.push({ step: 'website_crawl', status: 'completed', provider: 'Firecrawl' });
            
            await prisma.sourceRecord.create({
              data: {
                companyId,
                source: 'Firecrawl',
                url: company.website,
                rawPayload: first as any
              }
            });
          }
        }
      } catch (e: any) {
        results.errors.push({ step: 'website_crawl', error: e.message });
      }
    }

    // 2. Tech Stack (Wappalyzer)
    if (enrichmentTypes.includes('tech_stack') && domain) {
      try {
        const wappalyzer = getProviderByName('Wappalyzer');
        if (wappalyzer && wappalyzer.isConfigured() && wappalyzer.enrich) {
          const tech = await wappalyzer.enrich(domain);
          if (tech.metadata?.technologies) {
            updatedData.metadata.technologies = tech.metadata.technologies;
            results.steps.push({ step: 'tech_stack', status: 'completed', provider: 'Wappalyzer' });
          }
        }
      } catch (e: any) {
        results.errors.push({ step: 'tech_stack', error: e.message });
      }
    }

    // 3. Emails (Hunter)
    if (enrichmentTypes.includes('emails') && domain) {
      try {
        const hunter = getProviderByName('Hunter');
        if (hunter && hunter.isConfigured() && hunter.enrich) {
          const emailData = await hunter.enrich(domain);
          if (emailData.metadata) {
            updatedData.metadata.email_stats = emailData.metadata;
            results.steps.push({ step: 'emails', status: 'completed', provider: 'Hunter' });
          }
        }
      } catch (e: any) {
        results.errors.push({ step: 'emails', error: e.message });
      }
    }

    // 3.5 Contacts & Socials (Apollo)
    if (enrichmentTypes.includes('contacts') && domain) {
      try {
        const apollo = getProviderByName('Apollo');
        if (apollo && apollo.isConfigured() && apollo.enrich) {
          const apolloData = await apollo.enrich(domain);
          if (apolloData.metadata?.contacts) {
            results.steps.push({ step: 'contacts', status: 'completed', provider: 'Apollo' });
            
            // Store contacts
            for (const contact of apolloData.metadata.contacts) {
              await prisma.contact.upsert({
                where: { id: `${companyId}-${contact.email}` }, // Fake unique key for stub
                create: {
                  ...contact,
                  companyId
                },
                update: {
                  ...contact
                }
              }).catch(() => {
                // Fallback for non-unique id issue in stub
                return prisma.contact.create({
                  data: { ...contact, companyId }
                });
              });
            }

            updatedData.linkedin = apolloData.linkedin || updatedData.linkedin;
            updatedData.twitter = apolloData.twitter || updatedData.twitter;
            updatedData.industry = apolloData.industry || updatedData.industry;
          }
        }
      } catch (e: any) {
        results.errors.push({ step: 'contacts', error: e.message });
      }
    }

    // 4. AI Summary & Scoring
    if (enrichmentTypes.includes('ai_summary')) {
      try {
        const aiResponse = await enrichCompanyData(company.name, {
          ...company,
          ...updatedData
        });
        
        if (aiResponse.usage) {
          await usageService.track(orgId, 'ai_tokens_enrich', aiResponse.usage.totalTokens || 0, 'tokens', { companyId });
        }

        updatedData.description = aiResponse.enriched.shortSummary;
        updatedData.industry = aiResponse.enriched.industry;
        updatedData.metadata.ai_scores = {
          relevance: aiResponse.enriched.relevanceScore,
          confidence: aiResponse.enriched.confidenceScore,
          startup_friendly: aiResponse.enriched.startupFriendlyScore,
        };
        updatedData.metadata.partnership_potential = aiResponse.enriched.partnershipPotential;
        updatedData.metadata.contact_approach = aiResponse.enriched.suggestedContactApproach;
        
        // Sync Tags
        if (aiResponse.enriched.tags && aiResponse.enriched.tags.length > 0) {
          for (const tagName of aiResponse.enriched.tags) {
             const tag = await prisma.tag.upsert({
               where: { name: tagName },
               create: { name: tagName },
               update: { name: tagName }
             });

             await prisma.company.update({
               where: { id: companyId },
               data: {
                 tags: {
                   connect: { id: tag.id }
                 }
               }
             });
          }
        }

        results.steps.push({ step: 'ai_summary', status: 'completed', provider: 'OpenAI/GPT-4o-mini' });
      } catch (e: any) {
        results.errors.push({ step: 'ai_summary', error: e.message });
      }
    }

    // Save final state
    const finalCompany = await prisma.company.update({
      where: { id: companyId },
      data: updatedData
    });

    return { company: finalCompany, results };
  }
};
