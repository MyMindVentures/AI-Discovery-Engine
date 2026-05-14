import { prisma } from '../lib/db';
import { withDbFallback } from './baseService';

export const usageService = {
  getUsageEvents: async (organizationId: string) => {
    return withDbFallback(
      async () => {
        return prisma.usageEvent.findMany({
          where: { organizationId },
          orderBy: { createdAt: 'desc' },
          take: 50
        });
      },
      [] as any[],
      'usageService.getUsageEvents'
    );
  },

  logEvent: async (data: any) => {
    return withDbFallback(
      async () => {
        return prisma.usageEvent.create({
          data: {
            ...data,
          } as any
        });
      },
      data as any,
      'usageService.logEvent'
    );
  }
};
