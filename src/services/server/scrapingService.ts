import { prisma } from "../../lib/db";

export const scrapingService = {
  async createJob(data: { source: string, prompt: string, searchId?: string, organizationId: string }) {
    return prisma.scrapingJob.create({
      data: {
        ...data,
        status: 'running',
        startedAt: new Date()
      }
    });
  },

  async updateJob(id: string, updates: any) {
    return prisma.scrapingJob.update({
      where: { id },
      data: updates
    });
  },

  async getJobs(orgId: string) {
    return prisma.scrapingJob.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: 'desc' }
    });
  }
};
