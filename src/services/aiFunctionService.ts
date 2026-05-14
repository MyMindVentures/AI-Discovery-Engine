import { prisma } from '../lib/db';
import { withDbFallback } from './baseService';
import { initialAiConfigs } from '../lib/mock/data';

export const aiFunctionService = {
  getConfigs: async () => {
    return withDbFallback(
      async () => {
        return prisma.aiFunctionConfig.findMany();
      },
      initialAiConfigs as any,
      'aiFunctionService.getConfigs'
    );
  },

  updateConfig: async (id: string, data: any) => {
    return withDbFallback(
      async () => {
        return prisma.aiFunctionConfig.update({
          where: { id },
          data
        });
      },
      { id, ...data } as any,
      'aiFunctionService.updateConfig'
    );
  },

  createConfig: async (data: any) => {
    return withDbFallback(
      async () => {
        return prisma.aiFunctionConfig.create({
          data: {
            ...data,
          } as any
        });
      },
      { id: Math.random().toString(36).substr(2, 9), ...data } as any,
      'aiFunctionService.createConfig'
    );
  },

  deleteConfig: async (id: string) => {
    return withDbFallback(
      async () => {
        return prisma.aiFunctionConfig.delete({
          where: { id }
        });
      },
      { id } as any,
      'aiFunctionService.deleteConfig'
    );
  },

  getStats: async () => {
    return withDbFallback(
      async () => {
        const totalRuns = await prisma.aiFunctionRun.count();
        const successRuns = await prisma.aiFunctionRun.count({ where: { status: 'completed' } } as any);
        const avgLatency = 345; // Placeholder
        
        return {
          totalRuns,
          successRate: totalRuns > 0 ? (successRuns / totalRuns) * 100 : 98.4,
          avgLatency
        };
      },
      {
        totalRuns: 42000,
        successRate: 98.4,
        avgLatency: 345
      },
      'aiFunctionService.getStats'
    );
  }
};
