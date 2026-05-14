import { prisma } from '../lib/db';
import { withDbFallback } from './baseService';
import { mockLists, mockMonitoringJobs } from '../lib/mock/data';

export const savedListService = {
  async getAll(organizationId: string) {
    return withDbFallback(
      async () => {
        const lists = await prisma.savedList.findMany({
          where: { organizationId },
          include: {
            _count: { select: { companies: true } }
          },
          orderBy: { updatedAt: 'desc' }
        });

        return lists.map(l => ({
          ...l,
          count: l._count.companies,
          lastModified: l.updatedAt.toISOString(),
          tags: [] // Tags could be implemented as metadata or separate model if needed
        }));
      },
      mockLists as any[],
      'savedListService.getAll'
    );
  },

  async getById(id: string) {
    return withDbFallback(
      async () => prisma.savedList.findUnique({
        where: { id },
        include: {
          companies: {
            include: {
              company: true
            }
          }
        }
      }),
      mockLists.find(l => l.id === id) as any,
      'savedListService.getById'
    );
  },
  async delete(id: string) {
    return withDbFallback(
      async () => prisma.savedList.delete({ where: { id } }),
      { id } as any,
      'savedListService.delete'
    );
  },

  async create(data: any) {
    return withDbFallback(
      async () => prisma.savedList.create({ data }),
      { id: Math.random().toString(36).substr(2, 9), ...data },
      'savedListService.create'
    );
  }
};
