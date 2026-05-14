import { prisma } from "../../lib/db";
import { addJob, QUEUES } from "../../lib/queue/client";
import { billingService } from "./billingService";
import fs from "fs";
import path from "path";
import { Parser } from 'json2csv';
import * as XLSX from 'xlsx';

const EXPORT_DIR = path.join(process.cwd(), 'exports');

export const exportService = {
  async getExports(orgId: string) {
    return prisma.exportJob.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: 'desc' }
    });
  },

  async createExportJob(data: any, orgId: string) {
    if (!fs.existsSync(EXPORT_DIR)) {
      fs.mkdirSync(EXPORT_DIR, { recursive: true });
    }

    const canExport = await billingService.canUseFeature(orgId, 'exports');
    if (!canExport) {
      throw new Error("PLAN_LIMIT_EXCEEDED: Export limit reached for this period. Please upgrade your plan.");
    }

    await billingService.recordUsage(orgId, 'export');

    const job = await prisma.exportJob.create({
      data: { 
        name: data.name || `Export ${new Date().toISOString()}`,
        type: data.type || 'Search Results',
        format: data.format || 'CSV',
        filters: data.filters || {},
        organizationId: orgId,
        status: 'pending'
      }
    });

    await addJob(QUEUES.EXPORT, `export-${job.id}`, { jobId: job.id, orgId }, async (data) => this.runExport(data.jobId));

    return job;
  },

  async runExport(jobId: string) {
    console.log(`[Export Service] Starting real export for jobId: ${jobId}`);
    
    const job = await prisma.exportJob.findUnique({ where: { id: jobId } });
    if (!job) return;

    await prisma.exportJob.update({
      where: { id: jobId },
      data: { status: 'running' }
    });

    try {
      // 1. Gather data based on filters
      const filters: any = job.filters || {};
      let whereClause: any = {
        organizationId: job.organizationId,
        deletedAt: null,
      };

      if (filters.searchId) {
        whereClause.searchResults = { some: { searchId: filters.searchId } };
      } else if (filters.listId) {
        whereClause.listItems = { some: { listId: filters.listId } };
      } else if (filters.companyIds && Array.isArray(filters.companyIds)) {
        whereClause.id = { in: filters.companyIds };
      }

      const companies = await prisma.company.findMany({
        where: whereClause,
        include: {
          contacts: true,
          tags: { include: { tag: true } },
          sourceRecords: true
        }
      });

      // 2. Format data for export
      const exportData = companies.map(c => ({
        Name: c.name,
        Website: c.website,
        Domain: c.domain,
        Industry: c.industry,
        Location: c.location,
        Description: c.description,
        AI_Summary: (c.metadata as any)?.ai_summary || '',
        Tags: c.tags.map(t => t.tag.name).join(', '),
        Contacts: c.contacts.map(con => `${con.firstName} ${con.lastName} (${con.email})`).join(' | '),
        LinkedIn: c.linkedin,
        Twitter: c.twitter,
        LastUpdated: c.updatedAt.toISOString()
      }));

      // 3. Generate file content
      const fileName = `export_${jobId}.${job.format.toLowerCase()}`;
      const filePath = path.join(EXPORT_DIR, fileName);
      
      if (job.format === 'CSV') {
        const parser = new Parser();
        const csv = parser.parse(exportData);
        fs.writeFileSync(filePath, csv);
      } else if (job.format === 'XLSX') {
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
        XLSX.writeFile(workbook, filePath);
      } else {
        // Default to JSON
        fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2));
      }

      // 5. Update job status
      return prisma.exportJob.update({
        where: { id: jobId },
        data: { 
          status: 'completed', 
          lastRun: new Date(),
          filePath: filePath,
          fileUrl: `/api/exports/${jobId}/download`,
          recordsCount: companies.length
        }
      });
    } catch (error: any) {
      console.error(`[Export Service] Export failed:`, error);
      return prisma.exportJob.update({
        where: { id: jobId },
        data: { 
          status: 'failed', 
          errorMessage: error.message 
        }
      });
    }
  }
};
