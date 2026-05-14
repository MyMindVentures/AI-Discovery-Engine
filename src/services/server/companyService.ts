import { prisma } from "../../lib/db";

export const companyService = {
  async getAll(orgId: string) {
    return prisma.company.findMany({
      where: { organizationId: orgId, deletedAt: null },
      include: { tags: true }
    });
  },

  async getById(id: string) {
    return prisma.company.findUnique({
      where: { id },
      include: { 
        contacts: { where: { deletedAt: null } },
        tags: true,
        sourceRecords: true
      }
    });
  },

  async upsert(data: any, orgId: string) {
    const { domain, name, ...rest } = data;
    
    // Simple deduplication logic
    if (domain) {
      return prisma.company.upsert({
        where: { 
          organizationId_domain: { organizationId: orgId, domain } 
        },
        update: { ...rest, updatedAt: new Date() },
        create: { ...data, organizationId: orgId }
      });
    }

    return prisma.company.create({
      data: { ...data, organizationId: orgId }
    });
  }
};
