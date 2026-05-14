import { prisma } from '../lib/db';
import { withDbFallback } from './baseService';
import { mockUsers, mockSystemLogs, adminStats } from '../lib/mock/data';

export const adminService = {
  getStats: async () => {
    return withDbFallback(
      async () => {
        const userCount = await prisma.user.count();
        const companyCount = await prisma.company.count();
        const searchCount = await prisma.search.count();
        
        return [
          { label: 'Active Intelligence Nodes', value: userCount.toString(), change: '+12.4%', trend: 'up' },
          { label: 'Enriched Entities', value: companyCount.toString(), change: '+8.1%', trend: 'up' },
          { label: 'Neural Protocols Run', value: searchCount.toString(), change: '-2.4%', trend: 'down' },
        ];
      },
      adminStats,
      'adminService.getStats'
    );
  },

  getUsers: async () => {
    return withDbFallback(
      async () => {
        const users = await prisma.user.findMany({
          include: {
            memberships: {
              include: {
                organization: true
              }
            }
          }
        });
        return users.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: 'platform_admin', // Simplified for demo
          plan: 'enterprise',
          status: 'active',
          lastSeen: '2h ago'
        }));
      },
      mockUsers,
      'adminService.getUsers'
    );
  },

  getSystemLogs: async () => {
    return withDbFallback(
      async () => {
        // Mock system logs for now as we don't have a dedicated table yet
        return mockSystemLogs;
      },
      mockSystemLogs,
      'adminService.getSystemLogs'
    );
  }
};
