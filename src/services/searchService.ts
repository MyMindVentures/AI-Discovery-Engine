import { prisma } from '../lib/db';
import { withDbFallback } from './baseService';
import { mockSearches, mockScrapingJobs } from '../lib/mock/data';

export const searchService = {
  async getAll(organizationId: string) {
    return withDbFallback(
      async () => prisma.search.findMany({
        where: { organizationId },
        include: { _count: { select: { results: true } } },
        orderBy: { createdAt: 'desc' }
      }),
      mockSearches as any[],
      'searchService.getAll'
    );
  },

  async getById(id: string) {
    return withDbFallback(
      async () => prisma.search.findUnique({
        where: { id },
        include: {
          results: {
            include: {
              company: true
            }
          }
        }
      }),
      mockSearches.find(s => s.id === id) as any,
      'searchService.getById'
    );
  }
};

export const scrapingService = {
  async getAll(organizationId: string) {
    return withDbFallback(
      async () => prisma.scrapingJob.findMany({
        where: { organizationId },
        orderBy: { createdAt: 'desc' }
      }),
      mockScrapingJobs as any[],
      'scrapingService.getAll'
    );
  },

  async retryJob(id: string) {
    return withDbFallback(
      async () => prisma.scrapingJob.update({
        where: { id },
        data: { status: 'running', errorMessage: null, progress: 0 }
      }),
      { id, status: 'running' } as any,
      'scrapingService.retryJob'
    );
  }
};
