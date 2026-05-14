import { prisma } from '../lib/db';
import { withDbFallback } from './baseService';
import { mockExportHistory, mockExportJobs } from '../lib/mock/data';

export const exportService = {
  async getAll(organizationId: string) {
    return withDbFallback(
      async () => prisma.exportJob.findMany({
        where: { organizationId },
        orderBy: { createdAt: 'desc' }
      }),
      mockExportHistory as any[], // Using history as base for simplify
      'exportService.getAll'
    );
  },

  async create(data: any) {
    return withDbFallback(
      async () => prisma.exportJob.create({ data }),
      { id: 'exp_' + Math.random().toString(36).substr(2, 9), ...data } as any,
      'exportService.create'
    );
  }
};

export const feedbackService = {
  async getAll(organizationId?: string) {
    return withDbFallback(
      async () => prisma.feedback.findMany({
        where: organizationId ? { organizationId } : {},
        orderBy: { createdAt: 'desc' }
      }),
      [] as any[], // No mock feedback currently in data.ts
      'feedbackService.getAll'
    );
  },

  async getInsights() {
    return {
      total: 124,
      priority: { Critical: 12, High: 34, Medium: 45, Low: 33 },
      sentiment: { Positive: 82, Neutral: 30, Frustrated: 12 },
      clusters: [
        { theme: 'Intelligence Accuracy', count: 42, priority: 'Critical' },
        { theme: 'Network Latency', count: 28, priority: 'High' },
        { theme: 'UI Dimensionality', count: 15, priority: 'Low' },
        { theme: 'Neural Sync Speed', count: 39, priority: 'High' }
      ]
    };
  },

  async updateStatus(id: string, status: string) {
    return withDbFallback(
      async () => prisma.feedback.update({
        where: { id },
        data: { status }
      }),
      { id, status } as any,
      'feedbackService.updateStatus'
    );
  }
};
