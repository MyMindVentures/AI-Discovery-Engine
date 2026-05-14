import { SearchProvider, NormalizedCompany, ProviderType } from "./base";

export class ExaProvider extends SearchProvider {
  name = "Exa";
  type: ProviderType = 'search';

  isConfigured(): boolean {
    return !!process.env.EXA_API_KEY;
  }

  async search(query: string, options?: any): Promise<NormalizedCompany[]> {
    if (!this.isConfigured()) return [];
    console.log(`[Exa] Semantic search for: ${query}`);
    return [
      { name: "Exa Result", website: "https://exa.ai" }
    ];
  }
}
