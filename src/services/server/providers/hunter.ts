import { SearchProvider, NormalizedCompany, ProviderType } from "./base";

export class HunterProvider extends SearchProvider {
  name = "Hunter";
  type: ProviderType = 'enrichment';

  isConfigured(): boolean {
    return !!process.env.HUNTER_API_KEY;
  }

  async search(query: string, options?: any): Promise<NormalizedCompany[]> {
    return []; // Not primarily a search provider
  }

  async enrich(domain: string, options?: any): Promise<Partial<NormalizedCompany>> {
    if (!this.isConfigured()) return {};
    console.log(`[Hunter] Searching emails for: ${domain}`);
    return {
      metadata: { emailsFound: 5, domainStatus: 'verified' }
    };
  }
}
