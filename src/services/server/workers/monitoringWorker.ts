import { Worker, Job } from 'bullmq';
import { redisConnection, QUEUES } from '../../../lib/queue/client';
import { monitoringService } from '../monitoringService';

export function createMonitoringWorker() {
  if (!redisConnection) return null;

  return new Worker(QUEUES.MONITORING, async (job: Job) => {
    const { jobId } = job.data;
    return monitoringService.runMonitoring(jobId);
  }, { connection: redisConnection });
}
