import { prisma } from '../lib/db';
import { withDbFallback } from './baseService';
import { mockCompanies } from '../lib/mock/data';

export const companyService = {
  async getAll(organizationId?: string) {
    return withDbFallback(
      async () => {
        const companies = await prisma.company.findMany({
          where: organizationId ? { organizationId } : {},
          include: {
            tags: { include: { tag: true } },
            technologies: { include: { technology: true } }
          },
          orderBy: { createdAt: 'desc' }
        });
        
        // Map to UI friendly format
        return companies.map(c => ({
          ...c,
          tags: c.tags.map(t => t.tag.name),
          technologies: c.technologies.map(t => t.technology.name),
          score: c.score || 0,
          confidenceScore: c.confidenceScore || 0
        }));
      },
      mockCompanies as any[],
      'companyService.getAll'
    );
  },

  async getById(id: string) {
    return withDbFallback(
      async () => {
        const company = await prisma.company.findUnique({
          where: { id },
          include: {
            tags: { include: { tag: true } },
            technologies: { include: { technology: true } },
            contacts: true,
            sourceRecords: true
          }
        });
        
        if (!company) return null;

        return {
          ...company,
          tags: company.tags.map(t => t.tag.name),
          technologies: company.technologies.map(t => t.technology.name),
        };
      },
      mockCompanies.find(c => c.id === id) as any,
      'companyService.getById'
    );
  },

  async create(data: any) {
    return prisma.company.create({
      data: {
        ...data,
        metadata: data.metadata || {},
      }
    });
  }
};
