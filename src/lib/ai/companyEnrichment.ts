import { aiFunctionService } from "./functionService";

export interface EnrichedData {
  shortSummary: string;
  tags: string[];
  industry: string;
  relevanceScore: number;
  confidenceScore: number;
  startupFriendlyScore: number;
  partnershipPotential: string;
  suggestedContactApproach: string;
}

export async function enrichCompanyData(companyName: string, rawData: any) {
  const result = await aiFunctionService.run('companyEnrichment', {
    variables: { 
      companyName,
      companyData: rawData
    }
  });

  if (result && result.result) {
    try {
      const enriched = typeof result.result === 'string' ? JSON.parse(result.result) : result.result;
      return {
        enriched: enriched as EnrichedData,
        usage: { totalTokens: result.tokensUsed }
      };
    } catch (e) {
      console.error("Failed to parse AI Enrichment:", e);
    }
  }

  // Fallback
  return {
    enriched: {
      shortSummary: "No summary available.",
      tags: [],
      industry: "Unknown",
      relevanceScore: 0.5,
      confidenceScore: 0.5,
      startupFriendlyScore: 0.5,
      partnershipPotential: "Low - insufficient data",
      suggestedContactApproach: "General inquiry."
    },
    usage: null
  };
}
