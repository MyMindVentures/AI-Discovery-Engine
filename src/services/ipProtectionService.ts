import { withDbFallback } from './baseService';
import { mockIpEvidence, IpEvidenceRecord } from '../lib/mock/data';

// Note: IpEvidenceRecord mapping for Prisma if we had it
// model IpEvidenceRecord { ... }

export const ipProtectionService = {
  getEvidenceRecords: async (organizationId: string) => {
    return withDbFallback(
      async () => {
        // Return records for the organization
        // In a real app we would use prisma.ipEvidenceRecord.findMany({ where: { organizationId } })
        return mockIpEvidence;
      },
      mockIpEvidence.filter(r => r.organizationId === organizationId || organizationId === 'all'),
      'getEvidenceRecords'
    );
  },

  createEvidenceRecord: async (data: Partial<IpEvidenceRecord>) => {
    return withDbFallback(
      async () => {
        // Create in DB
        const newRecord = {
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...data
        } as IpEvidenceRecord;
        return newRecord;
      },
      {
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data
      } as IpEvidenceRecord,
      'createEvidenceRecord'
    );
  },

  updateEvidenceRecord: async (id: string, data: Partial<IpEvidenceRecord>) => {
    return withDbFallback(
      async () => {
        // Update in DB
        return { id, ...data } as IpEvidenceRecord;
      },
      { id, ...data } as IpEvidenceRecord,
      'updateEvidenceRecord'
    );
  },

  markAsTimestamped: async (id: string, provider: string, proofUrl: string) => {
    return ipProtectionService.updateEvidenceRecord(id, {
      status: 'timestamped',
      timestampProvider: provider,
      timestampProofUrl: proofUrl,
      updatedAt: new Date().toISOString()
    });
  },

  archiveEvidenceRecord: async (id: string) => {
    return ipProtectionService.updateEvidenceRecord(id, {
      status: 'archived',
      updatedAt: new Date().toISOString()
    });
  }
};
