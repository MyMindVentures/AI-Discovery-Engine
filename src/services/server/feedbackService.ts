import { prisma } from "../../lib/db";
import { callAI } from "../../lib/ai/client";

export const feedbackService = {
  async submitFeedback(data: any, orgId: string, userId?: string) {
    return prisma.feedback.create({
      data: {
        ...data,
        organizationId: orgId,
        userId: userId || null,
        aiTags: data.aiTags ? (Array.isArray(data.aiTags) ? data.aiTags : [data.aiTags]) : []
      }
    });
  },

  async getAllFeedback() {
    return prisma.feedback.findMany({
      orderBy: { createdAt: 'desc' }
    });
  },

  async getInsights() {
    const feedback = await prisma.feedback.findMany({
      where: { deletedAt: null },
      take: 100 // Scale limit
    });

    if (feedback.length === 0) {
      return { total: 0, categories: {}, priority: {}, sentiment: {}, clusters: [] };
    }

    // Basic aggregation
    const categories = feedback.reduce((acc: any, f) => {
      const cat = f.aiCategory || 'Uncategorized';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    const priority = feedback.reduce((acc: any, f) => {
      const p = f.aiPriority || 'Unknown';
      acc[p] = (acc[p] || 0) + 1;
      return acc;
    }, {});

    const sentiment = feedback.reduce((acc: any, f) => {
      const s = f.aiSentiment || 'Neutral';
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});

    // AI Clustering (Duplicate Detection & Trends)
    let clusters = [];
    try {
      const { aiFunctionService } = await import("../../lib/ai/functionService");
      const feedbackTexts = feedback.map(f => `[${f.id}] ${f.aiTitle}: ${f.aiSummary}`).join('\n');
      const aiResult = await aiFunctionService.run('feedbackClustering', {
        variables: { feedbackTexts }
      });

      if (aiResult && aiResult.result) {
        const parsed = typeof aiResult.result === 'string' ? JSON.parse(aiResult.result) : aiResult.result;
        clusters = Array.isArray(parsed) ? parsed : (parsed.clusters || []);
      }
    } catch (e) {
      console.error("Clustering failed", e);
    }

    return {
      total: feedback.length,
      categories,
      priority,
      sentiment,
      clusters,
      trending: feedback.slice(0, 5).map(f => f.aiTitle)
    };
  },

  async updateStatus(id: string, update: any) {
    return prisma.feedback.update({
      where: { id },
      data: update
    });
  }
};
