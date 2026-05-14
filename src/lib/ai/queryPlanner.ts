import { aiFunctionService } from "./functionService";

export interface SearchPlan {
  interpretedIntent: string;
  targetCompanyType: string;
  targetLocation: string;
  industryTags: string[];
  technologyTags: string[];
  exclusionRules: string[];
  searchQueries: string[];
  recommendedSources: string[];
  enrichmentPlan: string[];
}

export async function planSearchQuery(prompt: string, options: { mode: string, limit: number }) {
  const result = await aiFunctionService.run('queryPlanner', {
    variables: { 
      searchQuery: prompt,
      mode: options.mode,
      limit: options.limit
    }
  });

  if (result && result.result) {
    try {
      const plan = typeof result.result === 'string' ? JSON.parse(result.result) : result.result;
      return {
        plan: plan as SearchPlan,
        usage: { totalTokens: result.tokensUsed }
      };
    } catch (e) {
      console.error("Failed to parse AI Search Plan:", e);
    }
  }

  // Deterministic Fallback
  return {
    plan: {
      interpretedIntent: "Basic discovery based on: " + prompt,
      targetCompanyType: "general business",
      targetLocation: "global",
      industryTags: [],
      technologyTags: [],
      exclusionRules: [],
      searchQueries: [prompt],
      recommendedSources: ["Google Places", "Firecrawl"],
      enrichmentPlan: ["Website validation"]
    },
    usage: null
  };
}
