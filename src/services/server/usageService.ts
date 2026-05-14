import { prisma } from "../../lib/db";

export const usageService = {
  async track(orgId: string, type: string, amount: number, unit: string, metadata: any = {}, apiKeyId?: string) {
    return prisma.usageEvent.create({
      data: {
        organizationId: orgId,
        eventType: type,
        amount,
        unit,
        metadata,
        apiKeyId
      }
    });
  }
};
