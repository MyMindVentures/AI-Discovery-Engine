import { prisma } from '../lib/db';
import { withDbFallback } from './baseService';
import { mockMonitoringJobs } from '../lib/mock/data';

export const monitoringService = {
  getJobs: async (organizationId: string) => {
    return withDbFallback(
      async () => {
        return prisma.monitoringJob.findMany({
          where: { organizationId, deletedAt: null },
          orderBy: { createdAt: 'desc' }
        });
      },
      mockMonitoringJobs as any,
      'monitoringService.getJobs'
    );
  },

  createJob: async (data: any) => {
    return withDbFallback(
      async () => {
        return prisma.monitoringJob.create({
          data: {
            ...data,
            lastRun: new Date()
          }
        });
      },
      { id: Math.random().toString(36).substr(2, 9), ...data, status: 'active', lastRun: 'Just now', matchedCount: 0 } as any,
      'monitoringService.createJob'
    );
  },

  updateJob: async (id: string, data: any) => {
    return withDbFallback(
      async () => {
        return prisma.monitoringJob.update({
          where: { id },
          data
        });
      },
      { id, ...data } as any,
      'monitoringService.updateJob'
    );
  },

  deleteJob: async (id: string) => {
    return withDbFallback(
      async () => {
        return prisma.monitoringJob.update({
          where: { id },
          data: { deletedAt: new Date() }
        });
      },
      { id } as any,
      'monitoringService.deleteJob'
    );
  }
};
