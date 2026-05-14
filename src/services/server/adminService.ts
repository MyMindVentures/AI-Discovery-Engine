import { prisma } from "../../lib/db";

export const adminService = {
  async getOverviewStats() {
    const [userCount, jobCount, activeUsers] = await Promise.all([
      prisma.user.count(),
      prisma.scrapingJob.count(),
      prisma.user.count({ where: { status: 'active' } })
    ]);

    return { userCount, jobCount, activeUsers };
  }
};
