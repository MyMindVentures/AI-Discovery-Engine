import { prisma } from "../../lib/db";
import { startOfMonth, endOfMonth } from "date-fns";

export type PlanType = 'free' | 'starter' | 'pro' | 'team' | 'enterprise';

interface PlanConfig {
  name: string;
  limits: {
    searches: number;
    exports: number;
    monitoring: number;
    api_calls: number;
    scraping_records: number;
  };
  features: string[];
}

export const PLANS: Record<PlanType, PlanConfig> = {
  free: {
    name: 'Free',
    limits: {
      searches: 10,
      exports: 1,
      monitoring: 0,
      api_calls: 0,
      scraping_records: 100
    },
    features: ['basic_search', 'low_priority']
  },
  starter: {
    name: 'Starter',
    limits: {
      searches: 100,
      exports: 10,
      monitoring: 5,
      api_calls: 0,
      scraping_records: 1000
    },
    features: ['basic_search', 'standard_priority', 'monitoring']
  },
  pro: {
    name: 'Pro',
    limits: {
      searches: 1000,
      exports: 100,
      monitoring: 50,
      api_calls: 1000,
      scraping_records: 10000
    },
    features: ['advanced_discovery', 'high_priority', 'monitoring', 'api_access']
  },
  team: {
    name: 'Team',
    limits: {
      searches: 10000,
      exports: 1000,
      monitoring: 500,
      api_calls: 10000,
      scraping_records: 100000
    },
    features: ['team_collaboration', 'priority_support', 'advanced_discovery', 'api_access', 'custom_exports']
  },
  enterprise: {
    name: 'Enterprise',
    limits: {
      searches: Infinity,
      exports: Infinity,
      monitoring: Infinity,
      api_calls: Infinity,
      scraping_records: Infinity
    },
    features: ['everything', 'dedicated_support', 'sla', 'unlimited_users']
  }
};

export const billingService = {
  async getOrganizationPlan(orgId: string): Promise<PlanType> {
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      select: { plan: true }
    });
    return (org?.plan as PlanType) || 'free';
  },

  async getUsageStats(orgId: string) {
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());

    const events = await prisma.usageEvent.findMany({
      where: {
        organizationId: orgId,
        createdAt: {
          gte: start,
          lte: end
        }
      }
    });

    const stats = {
      searches: 0,
      exports: 0,
      monitoring: 0,
      api_calls: 0,
      scraping_records: 0
    };

    events.forEach(event => {
      switch (event.eventType) {
        case 'search':
          stats.searches += event.amount;
          break;
        case 'export':
          stats.exports += event.amount;
          break;
        case 'monitoring_run':
          stats.monitoring += event.amount;
          break;
        case 'api_request':
          stats.api_calls += event.amount;
          break;
        case 'scraping':
          stats.scraping_records += event.amount;
          break;
      }
    });

    return stats;
  },

  async canUseFeature(orgId: string, feature: keyof PlanConfig['limits']): Promise<boolean> {
    const planType = await this.getOrganizationPlan(orgId);
    const plan = PLANS[planType];
    const stats = await this.getUsageStats(orgId);

    const limit = plan.limits[feature];
    const current = stats[feature];

    return current < limit;
  },

  async recordUsage(orgId: string, type: string, amount: number = 1, metadata: any = {}) {
    const { usageService } = await import("./usageService");
    const unit = type === 'scraping' ? 'records' : 'count';
    return usageService.track(orgId, type, amount, unit, metadata);
  }
};
