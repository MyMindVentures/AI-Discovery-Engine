import { prisma } from "../../lib/db";

export const resolvers = {
  companies: async ({ filter, limit = 20, offset = 0 }: any, context: any) => {
    return prisma.company.findMany({
      where: {
        organizationId: context.orgId,
        deletedAt: null,
        OR: filter ? [
          { name: { contains: filter, mode: 'insensitive' } },
          { description: { contains: filter, mode: 'insensitive' } }
        ] : undefined
      },
      take: limit,
      skip: offset,
      include: { tags: true, contacts: true }
    });
  },
  company: async ({ id }: any, context: any) => {
    return prisma.company.findFirst({
      where: { id, organizationId: context.orgId, deletedAt: null },
      include: { tags: true, contacts: true }
    });
  },
  contacts: async ({ filter }: any, context: any) => {
    return prisma.contact.findMany({
      where: {
        company: { organizationId: context.orgId },
        deletedAt: null,
        OR: filter ? [
          { firstName: { contains: filter, mode: 'insensitive' } },
          { lastName: { contains: filter, mode: 'insensitive' } },
          { email: { contains: filter, mode: 'insensitive' } }
        ] : undefined
      },
      include: { company: true }
    });
  },
  searches: async (_: any, context: any) => {
    return prisma.search.findMany({
      where: { organizationId: context.orgId },
      orderBy: { createdAt: 'desc' }
    });
  },
  searchResults: async ({ searchId }: any, context: any) => {
    return prisma.searchResult.findMany({
      where: { 
        searchId,
        search: { organizationId: context.orgId }
      },
      include: { company: { include: { tags: true, contacts: true } } }
    });
  },
  exports: async (_: any, context: any) => {
    return prisma.exportJob.findMany({
      where: { organizationId: context.orgId },
      orderBy: { createdAt: 'desc' }
    });
  }
};
