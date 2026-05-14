import { prisma } from "../../lib/db";
import { addJob, QUEUES } from "../../lib/queue/client";
import { searchService } from "./searchService";
import { billingService } from "./billingService";

export const monitoringService = {
  async getJobs(orgId: string) {
    return prisma.monitoringJob.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: 'desc' }
    });
  },

  async createMonitoringJob(data: any, orgId: string) {
    const canMonitor = await billingService.canUseFeature(orgId, 'monitoring');
    if (!canMonitor) {
      throw new Error("PLAN_LIMIT_EXCEEDED: Monitoring node limit reached for your plan level.");
    }

    const nextRun = this.calculateNextRun(data.frequency);
    const job = await prisma.monitoringJob.create({
      data: { 
        ...data, 
        organizationId: orgId,
        nextRun: nextRun
      }
    });

    if (job.status === 'active') {
      await this.scheduleJob(job.id, orgId, nextRun);
    }

    return job;
  },

  async updateJob(id: string, data: any, orgId: string) {
    const job = await prisma.monitoringJob.update({
      where: { id, organizationId: orgId },
      data: data
    });

    if (data.status === 'active') {
      const nextRun = this.calculateNextRun(job.frequency);
      await prisma.monitoringJob.update({
        where: { id },
        data: { nextRun }
      });
      await this.scheduleJob(job.id, orgId, nextRun);
    }

    return job;
  },

  async deleteJob(id: string, orgId: string) {
    return prisma.monitoringJob.delete({
      where: { id, organizationId: orgId }
    });
  },

  async scheduleJob(jobId: string, orgId: string, runtime: Date) {
    // In a real system, this would be a delayed job or a cron
    await addJob(
      QUEUES.MONITORING, 
      `monitor-${jobId}-${runtime.getTime()}`, 
      { jobId, orgId }, 
      async (data) => this.runMonitoring(data.jobId)
    );
  },

  async runMonitoring(jobId: string) {
    console.log(`[Monitoring Service] Starting functional run for jobId: ${jobId}`);
    
    const job = await prisma.monitoringJob.findUnique({ 
      where: { id: jobId },
      include: { organization: true }
    });
    if (!job || job.status !== 'active') return;

    try {
      // Record usage for the run
      await billingService.recordUsage(job.organizationId, 'monitoring_run');

      // 1. Run the search protocol
      // We don't want to await search results immediately if it's long-running,
      // but for monitoring we typically want to know the outcome.
      const search = await prisma.search.create({
        data: {
          query: job.prompt || "Monitoring Run",
          originalPrompt: job.prompt || "Monitoring Run",
          organizationId: job.organizationId,
          status: 'running'
        }
      });

      // Pass search.id to runSearch if we want to link them
      const results = await searchService.runSearch({
        prompt: job.prompt || "General market update",
        mode: 'monitor',
        limit: 20,
        sources: job.sources as string[] | undefined,
        organizationId: job.organizationId
      });

      // Since search is async, we might not have all results NOW.
      // But searchService.runSearch returns what it has or initiates jobs.
      // In fallback/inline mode, it might have finished some.
      
      // 2. Simple comparison (new findings vs previous count)
      // For more accurate results, we would check which company IDs are new.
      const currentCount = results.length;
      const prevCount = job.lastResultsCount || 0;
      const newFindings = Math.max(0, currentCount - prevCount);

      // 3. Update job stats and schedule next run
      const nextRun = this.calculateNextRun(job.frequency);

      const updatedJob = await prisma.monitoringJob.update({
        where: { id: jobId },
        data: { 
          lastRun: new Date(),
          nextRun: nextRun,
          lastResultsCount: currentCount,
          newFindingsCount: newFindings
        }
      });

      // 4. Re-schedule (if enabled)
      // This ensures the loop continues
      if (job.status === 'active') {
        await this.scheduleJob(jobId, job.organizationId, nextRun);
      }

      return updatedJob;
    } catch (error) {
      console.error(`[Monitoring Service] Run failed for ${jobId}:`, error);
      throw error;
    }
  },

  calculateNextRun(frequency: string): Date {
    const now = new Date();
    switch (frequency.toLowerCase()) {
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case 'monthly':
        const nextMonth = new Date(now);
        nextMonth.setMonth(now.getMonth() + 1);
        return nextMonth;
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }
  }
};
