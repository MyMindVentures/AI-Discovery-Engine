import { Worker, Job } from 'bullmq';
import { redisConnection, QUEUES } from '../../../lib/queue/client';
import { enrichmentService } from '../enrichmentService';

export function createEnrichmentWorker() {
  if (!redisConnection) return null;

  return new Worker(QUEUES.ENRICHMENT, async (job: Job) => {
    const { companyId, enrichmentTypes, orgId } = job.data;
    console.log(`[EnrichmentWorker] Processing company ${companyId}`);
    
    return enrichmentService.enrichCompany(companyId, enrichmentTypes, orgId);
  }, { connection: redisConnection });
}
