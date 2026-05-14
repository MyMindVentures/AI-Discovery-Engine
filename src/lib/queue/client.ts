import { Queue, Worker, Job, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL;

export const redisConnection = REDIS_URL ? new IORedis(REDIS_URL, {
  maxRetriesPerRequest: null,
}) : null;

const queueOptions = {
  connection: redisConnection || undefined,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
};

// Queue names
export const QUEUES = {
  SEARCH: 'searchQueue',
  SCRAPING: 'scrapingQueue',
  ENRICHMENT: 'enrichmentQueue',
  EXPORT: 'exportQueue',
  MONITORING: 'monitoringQueue',
} as const;

const queues: Record<string, Queue> = {};

export function getQueue(name: string): Queue | null {
  if (!redisConnection) return null;
  if (!queues[name]) {
    queues[name] = new Queue(name, queueOptions);
  }
  return queues[name];
}

export async function addJob(queueName: string, jobName: string, data: any, fallbackHandler?: (data: any) => Promise<any>) {
  const queue = getQueue(queueName);
  
  if (!queue) {
    console.log(`[Queue Fallback] Running job ${jobName} inline since Redis is not configured.`);
    if (fallbackHandler) {
      // Run it in the background (don't await) to simulate worker
      fallbackHandler(data).catch(err => console.error(`[Inline Job Failed] ${jobName}`, err));
      return { id: 'inline-' + Date.now(), data };
    }
    return { id: 'mock-' + Date.now(), data };
  }

  return queue.add(jobName, data);
}
