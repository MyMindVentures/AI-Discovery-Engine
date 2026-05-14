import { prisma } from '../lib/db';
import { withDbFallback } from './baseService';

export const billingService = {
  getUsage: async (organizationId: string) => {
    return withDbFallback(
      async () => {
        const org = await prisma.organization.findUnique({
          where: { id: organizationId },
          select: { plan: true }
        });

        const searches = await prisma.search.count({ where: { organizationId } });
        const exportJobs = await prisma.exportJob.count({ where: { organizationId } });

        const planLimits: Record<string, any> = {
          free: { searches: 10, exports: 1, scraping_records: 0, api_calls: 100 },
          pro: { searches: 1000, exports: 100, scraping_records: 10000, api_calls: 10000 },
          enterprise: { searches: 10000, exports: Infinity, scraping_records: 50000, api_calls: 50000 }
        };

        const currentPlan = org?.plan || 'free';

        return {
          planType: currentPlan,
          plan: {
            id: currentPlan,
            limits: planLimits[currentPlan] || planLimits.free
          },
          usage: {
            searches,
            exports: exportJobs,
            monitoring: 0,
            api_calls: 0,
            scraping_records: 0
          }
        };
      },
      {
        planType: 'pro',
        plan: {
          id: 'pro',
          limits: { searches: 1000, exports: 100, scraping_records: 10000, api_calls: 10000 }
        },
        usage: {
          searches: 420,
          exports: 12,
          monitoring: 5,
          api_calls: 1240,
          scraping_records: 850
        }
      } as any,
      'billingService.getUsage'
    );
  },

  subscribe: async (organizationId: string, planId: string) => {
    return withDbFallback(
      async () => {
        return prisma.organization.update({
          where: { id: organizationId },
          data: { plan: planId }
        });
      },
      { id: organizationId, plan: planId, status: 'active' } as any,
      'billingService.subscribe'
    );
  }
};
