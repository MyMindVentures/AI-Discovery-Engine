import { prisma } from '../lib/db';
import { withDbFallback } from './baseService';
import { mockUsers } from '../lib/mock/data';

export const userService = {
  async getAll() {
    return withDbFallback(
      async () => prisma.user.findMany({
        orderBy: { createdAt: 'desc' }
      }),
      mockUsers as any[],
      'userService.getAll'
    );
  },

  async getById(id: string) {
    return withDbFallback(
      async () => prisma.user.findUnique({
        where: { id },
        include: {
          memberships: {
            include: {
              organization: true
            }
          }
        }
      }),
      mockUsers.find(u => u.id === id) as any,
      'userService.getById'
    );
  },

  async getProfile(id: string) {
    return withDbFallback(
      async () => prisma.user.findUnique({
        where: { id },
        include: {
          memberships: {
            include: {
              organization: true
            }
          }
        }
      }),
      mockUsers.find(u => u.id === id) as any,
      'userService.getProfile'
    );
  },

  async getApiKeys(organizationId: string) {
    return withDbFallback(
      async () => prisma.apiKey.findMany({ 
        where: { 
          user: { 
            memberships: { 
              some: { organizationId } 
            } 
          } 
        } 
      }),
      [],
      'userService.getApiKeys'
    );
  },

  async createApiKey(data: any) {
    return withDbFallback(
      async () => prisma.apiKey.create({ data }),
      { id: 'key_' + Math.random().toString(36).substr(2, 9), ...data, rawKey: 'sk_mock_' + Math.random().toString(36).substr(2, 24) },
      'userService.createApiKey'
    );
  },

  async deleteApiKey(id: string) {
    return withDbFallback(
      async () => prisma.apiKey.delete({ where: { id } }),
      { id } as any,
      'userService.deleteApiKey'
    );
  },

  async updateProfile(id: string, data: any) {
    return withDbFallback(
      async () => prisma.user.update({
        where: { id },
        data
      }),
      { id, ...data },
      'userService.updateProfile'
    );
  }
};

export const organizationService = {
  async getAll() {
    return withDbFallback(
      async () => prisma.organization.findMany(),
      [{ id: 'org_1', name: 'Demo Org', plan: 'pro' }] as any[],
      'organizationService.getAll'
    );
  },

  async update(id: string, data: any) {
    return withDbFallback(
      async () => prisma.organization.update({
        where: { id },
        data
      }),
      { id, ...data },
      'organizationService.update'
    );
  },

  async getStats(organizationId: string) {
    return withDbFallback(
      async () => {
        const counts = await Promise.all([
          prisma.company.count({ where: { organizationId } }),
          prisma.contact.count({ where: { company: { organizationId } } }),
          prisma.search.count({ where: { organizationId } }),
          prisma.scrapingJob.count({ where: { organizationId } })
        ]);
        
        return {
          companies: counts[0],
          contacts: counts[1],
          searches: counts[2],
          scrapingJobs: counts[3]
        };
      },
      { companies: 5420, contacts: 12842, searches: 142, scrapingJobs: 42 },
      'organizationService.getStats'
    );
  }
};
