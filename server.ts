import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { companyService } from "./src/services/server/companyService";
import { searchService } from "./src/services/server/searchService";
import { adminService } from "./src/services/server/adminService";
import { enrichmentService } from "./src/services/server/enrichmentService";
import { initWorkers } from "./src/services/server/workers/index";

dotenv.config();

// Initialize Background Workers
initWorkers();

const isProd = process.env.NODE_ENV === "production";
const PORT = 3000;
const ORG_ID_HARDCODED = "default-org"; // For demo purposes

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      demoMode: process.env.VITE_DEMO_MODE === "true" || !process.env.DATABASE_URL 
    });
  });

  // Admin Stats
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const stats = await adminService.getOverviewStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admin stats" });
    }
  });

  app.get("/api/admin/queues", async (req, res) => {
    try {
      const { getQueue, QUEUES } = await import("./src/lib/queue/client");
      
      const stats: any = {};
      
      for (const [key, name] of Object.entries(QUEUES)) {
        const queue = getQueue(name);
        if (queue) {
          const [waiting, active, completed, failed, delayed] = await Promise.all([
            queue.getWaitingCount(),
            queue.getActiveCount(),
            queue.getCompletedCount(),
            queue.getFailedCount(),
            queue.getDelayedCount(),
          ]);
          stats[key] = { name, waiting, active, completed, failed, delayed };
        } else {
          stats[key] = { name, offline: true };
        }
      }
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch queue stats" });
    }
  });

  app.get("/api/admin/providers", async (req, res) => {
    try {
      const { allProviders } = await import("./src/services/server/providers/index");
      const status = allProviders.map(p => ({
        name: p.name,
        type: p.type,
        configured: p.isConfigured()
      }));
      res.json(status);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch provider status" });
    }
  });

  // Search
  app.post("/api/search/plan", async (req, res) => {
    try {
      const { billingService } = await import("./src/services/server/billingService");
      const canSearch = await billingService.canUseFeature(ORG_ID_HARDCODED, 'searches');
      if (!canSearch) {
        return res.status(403).json({ error: "PLAN_LIMIT_EXCEEDED: Search limit reached for this period." });
      }

      const { prompt, mode, limit } = req.body;
      const { planSearchQuery } = await import("./src/lib/ai/queryPlanner");
      const { plan } = await planSearchQuery(prompt, { mode: mode || 'quick', limit: limit || 10 });
      res.json(plan);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate search plan" });
    }
  });

  app.post("/api/search/run", async (req, res) => {
    try {
      const { prompt, mode, sources, limit } = req.body;
      const results = await searchService.runSearch({
        prompt,
        mode,
        sources,
        limit,
        organizationId: ORG_ID_HARDCODED
      });
      res.json(results);
    } catch (error: any) {
      console.error("Search Run Error:", error);
      res.status(500).json({ error: error.message || "Failed to run search orchestrator" });
    }
  });

  app.post("/api/search", async (req, res) => {
    try {
      const { query, filters } = req.body;
      const result = await searchService.runSearch({
        prompt: query,
        mode: 'quick',
        organizationId: ORG_ID_HARDCODED
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to initiate search" });
    }
  });

  // Companies
  app.get("/api/companies", async (req, res) => {
    try {
      const companies = await companyService.getAll(ORG_ID_HARDCODED);
      res.json(companies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch companies" });
    }
  });

  app.get("/api/companies/:id", async (req, res) => {
    try {
      const company = await companyService.getById(req.params.id);
      if (!company) return res.status(404).json({ error: "Company not found" });
      res.json(company);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch company" });
    }
  });

  app.post("/api/companies/:id/enrich", async (req, res) => {
    try {
      const { enrichmentTypes } = req.body;
      const result = await enrichmentService.enrichCompany(
        req.params.id, 
        enrichmentTypes || ['ai_summary'],
        ORG_ID_HARDCODED
      );
      res.json(result);
    } catch (error: any) {
      console.error("Enrichment Error:", error);
      res.status(500).json({ error: error.message || "Failed to enrich company" });
    }
  });

  // Scraping Jobs
  app.get("/api/jobs", async (req, res) => {
    try {
      const { scrapingService } = await import("./src/services/server/scrapingService");
      const jobs = await scrapingService.getJobs(ORG_ID_HARDCODED);
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  });

  app.post("/api/jobs/:id/retry", async (req, res) => {
    try {
      const { scrapingService } = await import("./src/services/server/scrapingService");
      const { searchService } = await import("./src/services/server/searchService");
      const { addJob, QUEUES } = await import("./src/lib/queue/client");
      const { prisma } = await import("./src/lib/db");

      const jobRecord = await prisma.scrapingJob.findUnique({ where: { id: req.params.id } });
      if (!jobRecord) return res.status(404).json({ error: "Job not found" });

      // Reset job status
      await scrapingService.updateJob(jobRecord.id, {
        status: 'running',
        errorMessage: null,
        startedAt: new Date()
      });

      // Queue it back (or run inline)
      const search = await prisma.search.findUnique({ where: { id: jobRecord.searchId || '' } });
      
      const jobData = {
        sourceName: jobRecord.source,
        prompt: jobRecord.prompt,
        searchId: jobRecord.searchId,
        organizationId: jobRecord.organizationId,
        limit: 50, // Default limit
        mode: 'standard',
        plan: search?.filters || {}
      };

      await addJob(
        QUEUES.SEARCH, 
        `retry-${jobRecord.source}-${jobRecord.id}`, 
        jobData,
        async (data) => searchService.processProviderSearch(data)
      );

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Exports
  app.get("/api/exports", async (req, res) => {
    try {
      const { exportService } = await import("./src/services/server/exportService");
      const exports = await exportService.getExports(ORG_ID_HARDCODED);
      res.json(exports);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch exports" });
    }
  });

  app.post("/api/exports", async (req, res) => {
    try {
      const { exportService } = await import("./src/services/server/exportService");
      const { name, type, format, filters } = req.body;
      const job = await exportService.createExportJob({ name, type, format, filters }, ORG_ID_HARDCODED);
      res.json(job);
    } catch (error: any) {
      if (error.message?.includes('PLAN_LIMIT_EXCEEDED')) {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: "Failed to create export job" });
    }
  });

  app.get("/api/exports/:id/download", async (req, res) => {
    try {
      const { prisma } = await import("./src/lib/db");
      const job = await prisma.exportJob.findUnique({ where: { id: req.params.id } });
      if (!job || !job.filePath || job.status !== 'completed') {
        return res.status(404).json({ error: "File not found or export not completed" });
      }

      const fileName = `export_${job.id}.${job.format.toLowerCase()}`;
      res.download(job.filePath, fileName);
    } catch (error) {
      res.status(500).json({ error: "Failed to download file" });
    }
  });

  // Billing
  app.get("/api/billing/usage", async (req, res) => {
    try {
      const { billingService } = await import("./src/services/server/billingService");
      const usage = await billingService.getUsageStats(ORG_ID_HARDCODED);
      const planType = await billingService.getOrganizationPlan(ORG_ID_HARDCODED);
      const { PLANS } = await import("./src/services/server/billingService");
      res.json({
        usage,
        plan: PLANS[planType],
        planType
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch billing usage" });
    }
  });

  app.post("/api/billing/subscribe", async (req, res) => {
    try {
      const { plan } = req.body;
      const { prisma } = await import("./src/lib/db");
      // Placeholder: Update plan directly for demo
      await prisma.organization.update({
        where: { id: ORG_ID_HARDCODED },
        data: { plan }
      });
      res.json({ success: true, message: `Subscribed to ${plan}` });
    } catch (error) {
      res.status(500).json({ error: "Failed to update subscription" });
    }
  });

  // Monitoring
  app.get("/api/monitoring", async (req, res) => {
    try {
      const { monitoringService } = await import("./src/services/server/monitoringService");
      const jobs = await monitoringService.getJobs(ORG_ID_HARDCODED);
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch monitoring jobs" });
    }
  });

  app.post("/api/monitoring", async (req, res) => {
    try {
      const { monitoringService } = await import("./src/services/server/monitoringService");
      const job = await monitoringService.createMonitoringJob(
        { ...req.body, userId: process.env.VITE_USER_ID_HARDCODED || "default-user" }, 
        ORG_ID_HARDCODED
      );
      res.json(job);
    } catch (error: any) {
      if (error.message?.includes('PLAN_LIMIT_EXCEEDED')) {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: "Failed to create monitoring job" });
    }
  });

  app.patch("/api/monitoring/:id", async (req, res) => {
    try {
      const { monitoringService } = await import("./src/services/server/monitoringService");
      const job = await monitoringService.updateJob(req.params.id, req.body, ORG_ID_HARDCODED);
      res.json(job);
    } catch (error) {
      res.status(500).json({ error: "Failed to update monitoring job" });
    }
  });

  app.delete("/api/monitoring/:id", async (req, res) => {
    try {
      const { monitoringService } = await import("./src/services/server/monitoringService");
      await monitoringService.deleteJob(req.params.id, ORG_ID_HARDCODED);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete monitoring job" });
    }
  });

  app.post("/api/monitoring/:id/run", async (req, res) => {
    try {
      const { monitoringService } = await import("./src/services/server/monitoringService");
      const result = await monitoringService.runMonitoring(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to run monitoring job" });
    }
  });

  // Feedback
  app.post("/api/feedback", async (req, res) => {
    try {
      const { feedbackService } = await import("./src/services/server/feedbackService");
      const feedback = await feedbackService.submitFeedback(
        req.body, 
        ORG_ID_HARDCODED, 
        process.env.VITE_USER_ID_HARDCODED || "default-user"
      );
      res.json(feedback);
    } catch (error) {
      console.error("Feedback error:", error);
      res.status(500).json({ error: "Failed to submit feedback" });
    }
  });

  app.get("/api/feedback", async (req, res) => {
    try {
      const { feedbackService } = await import("./src/services/server/feedbackService");
      const feedback = await feedbackService.getAllFeedback();
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch feedback" });
    }
  });

  app.get("/api/feedback/insights", async (req, res) => {
    try {
      const { feedbackService } = await import("./src/services/server/feedbackService");
      const insights = await feedbackService.getInsights();
      res.json(insights);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch insights" });
    }
  });

  app.patch("/api/feedback/:id", async (req, res) => {
    try {
      const { feedbackService } = await import("./src/services/server/feedbackService");
      const feedback = await feedbackService.updateStatus(req.params.id, req.body);
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ error: "Failed to update feedback" });
    }
  });

  // API Key Management (Internal UI)
  app.get("/api/keys", async (req, res) => {
    try {
      const { apiService } = await import("./src/services/server/apiService");
      const keys = await apiService.getKeys(process.env.VITE_USER_ID_HARDCODED || "default-user");
      res.json(keys);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch API keys" });
    }
  });

  app.post("/api/keys", async (req, res) => {
    try {
      const { apiService } = await import("./src/services/server/apiService");
      const { name, scopes } = req.body;
      const key = await apiService.generateKey(
        process.env.VITE_USER_ID_HARDCODED || "default-user", 
        name, 
        scopes || ["read:companies"]
      );
      res.json(key);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate API key" });
    }
  });

  app.delete("/api/keys/:id", async (req, res) => {
    try {
      const { apiService } = await import("./src/services/server/apiService");
      await apiService.deleteKey(req.params.id, process.env.VITE_USER_ID_HARDCODED || "default-user");
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete API key" });
    }
  });

  // API v1 (External)
  const v1 = express.Router();
  const { apiAuthMiddleware } = await import("./src/middleware/apiAuthMiddleware");
  v1.use(apiAuthMiddleware);

  v1.get("/companies", async (req, res) => {
    const { limit, offset, filter } = req.query;
    const { apiService } = await import("./src/services/server/apiService");
    const companies = await apiService.listCompanies((req as any).orgId, { limit: Number(limit), offset: Number(offset), filter });
    res.json(companies);
  });

  v1.get("/companies/:id", async (req, res) => {
    const company = await companyService.getById(req.params.id);
    if (!company || company.organizationId !== (req as any).orgId) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.json(company);
  });

  v1.get("/contacts", async (req, res) => {
    const { prisma } = await import("./src/lib/db");
    const contacts = await prisma.contact.findMany({
      where: { company: { organizationId: (req as any).orgId }, deletedAt: null },
      take: 50
    });
    res.json(contacts);
  });

  v1.post("/search", async (req, res) => {
    const { prompt, mode, limit } = req.body;
    const results = await searchService.runSearch({
      prompt,
      mode: mode || 'quick',
      limit: limit || 10,
      organizationId: (req as any).orgId
    });
    res.json(results);
  });

  v1.post("/exports", async (req, res) => {
    const { exportService } = await import("./src/services/server/exportService");
    const { name, format, filters } = req.body;
    const job = await exportService.createExportJob({ name, format, filters }, (req as any).orgId);
    res.json(job);
  });

  app.use("/api/v1", v1);

  // AI Function Management
  app.get("/api/admin/ai-functions", async (req, res) => {
    try {
      const { prisma } = await import("./src/lib/db");
      const { defaultPrompts } = await import("./src/lib/ai/prompts");
      
      const dbConfigs = await prisma.aiFunctionConfig.findMany();
      const dbKeys = new Set(dbConfigs.map(c => c.key));
      
      const configs = [...dbConfigs];
      
      // Add defaults if not in DB
      for (const key of Object.keys(defaultPrompts)) {
        if (!dbKeys.has(key)) {
          configs.push({
            key,
            name: key.replace(/([A-Z])/g, ' $1').trim(),
            description: `Default configuration for ${key}`,
            provider: "gemini",
            model: "gemini-3-flash-preview",
            temperature: 0.7,
            maxTokens: 2048,
            enabled: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          } as any);
        }
      }
      
      res.json(configs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch AI functions" });
    }
  });

  app.get("/api/admin/ai-functions/:key", async (req, res) => {
    try {
      const { prisma } = await import("./src/lib/db");
      const { aiFunctionService } = await import("./src/lib/ai/functionService");
      
      const config = await aiFunctionService.getConfig(req.params.key);
      const runs = await prisma.aiFunctionRun.findMany({
        where: { functionKey: req.params.key },
        orderBy: { createdAt: 'desc' },
        take: 50
      });
      
      res.json({ config, runs });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch AI function details" });
    }
  });

  app.post("/api/admin/ai-functions", async (req, res) => {
    try {
      const { prisma } = await import("./src/lib/db");
      const { key, ...data } = req.body;
      
      const config = await prisma.aiFunctionConfig.upsert({
        where: { key },
        create: { key, ...data },
        update: data
      });
      
      res.json(config);
    } catch (error) {
      res.status(500).json({ error: "Failed to save AI function config" });
    }
  });

  app.post("/api/admin/ai-functions/:key/test", async (req, res) => {
    try {
      const { aiFunctionService } = await import("./src/lib/ai/functionService");
      const result = await aiFunctionService.run(req.params.key, {
        variables: req.body.variables || {}
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to test AI function" });
    }
  });

  app.get("/api/admin/ai-functions/stats", async (req, res) => {
    try {
      const { prisma } = await import("./src/lib/db");
      
      const statusStats = await prisma.aiFunctionRun.groupBy({
        by: ['status'],
        _count: { id: true },
        _sum: { tokensUsed: true },
        _avg: { latencyMs: true }
      });
      
      const functionStats = await prisma.aiFunctionRun.groupBy({
        by: ['functionKey'],
        _sum: { tokensUsed: true },
        _count: { id: true },
        _avg: { latencyMs: true }
      });
      
      res.json({
        status: statusStats,
        functions: functionStats
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch AI stats" });
    }
  });

  // GraphQL (External)
  const { createHandler } = await import("graphql-http/lib/use/express");
  const { schema } = await import("./src/services/server/graphqlSchema");
  const { resolvers } = await import("./src/services/server/graphqlResolvers");

  app.all("/api/graphql", apiAuthMiddleware, createHandler({
    schema,
    rootValue: resolvers,
    context: (req: any) => ({ orgId: req.orgId, userId: req.userId })
  }));

  // Vite middleware for development
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`>>> Engine running on http://localhost:${PORT}`);
    if (process.env.VITE_DEMO_MODE === "true") {
      console.log(">>> DEMO MODE ACTIVE: Mock fallbacks enabled.");
    }
  });
}

startServer().catch((err) => {
  console.error("Critical Failure during Engine startup:", err);
  process.exit(1);
});
