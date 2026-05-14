import { prisma } from "../../lib/db";
import crypto from "crypto";

export const apiService = {
  async generateKey(userId: string, name: string, scopes: string[]) {
    const rawKey = `sk_${crypto.randomBytes(24).toString("hex")}`;
    const hashedKey = crypto.createHash("sha256").update(rawKey).digest("hex");
    const keyHint = `****${rawKey.slice(-4)}`;

    const apiKey = await prisma.apiKey.create({
      data: {
        userId,
        name,
        hashedKey,
        keyHint,
        scopes,
      },
    });

    return { ...apiKey, rawKey };
  },

  async validateKey(rawKey: string) {
    const hashedKey = crypto.createHash("sha256").update(rawKey).digest("hex");
    const apiKey = await prisma.apiKey.findUnique({
      where: { hashedKey },
      include: { 
        user: { 
          include: { 
            memberships: { 
              include: { organization: true } 
            } 
          } 
        } 
      },
    });

    if (!apiKey) return null;

    // Update last used at
    await prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() }
    });

    return apiKey;
  },

  async getKeys(userId: string) {
    return prisma.apiKey.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  async deleteKey(id: string, userId: string) {
    return prisma.apiKey.delete({
      where: { id, userId },
    });
  },

  async listCompanies(orgId: string, { limit = 20, offset = 0, filter = "" }: any) {
    return prisma.company.findMany({
      where: {
        organizationId: orgId,
        deletedAt: null,
        OR: [
          { name: { contains: filter, mode: 'insensitive' } },
          { industry: { contains: filter, mode: 'insensitive' } }
        ]
      },
      take: limit,
      skip: offset,
      include: {
        tags: true,
        contacts: true
      }
    });
  }
};
