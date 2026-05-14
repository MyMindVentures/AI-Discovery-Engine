import { Worker, Job } from 'bullmq';
import { redisConnection, QUEUES } from '../../../lib/queue/client';
import { exportService } from '../exportService';

export function createExportWorker() {
  if (!redisConnection) return null;

  return new Worker(QUEUES.EXPORT, async (job: Job) => {
    const { jobId } = job.data;
    return exportService.runExport(jobId);
  }, { connection: redisConnection });
}
