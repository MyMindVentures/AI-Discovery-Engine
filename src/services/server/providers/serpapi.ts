import { SearchProvider, NormalizedCompany, ProviderType } from "./base";

export class SerpApiProvider extends SearchProvider {
  name = "SerpApi";
  type: ProviderType = 'search';

  isConfigured(): boolean {
    return !!process.env.SERPAPI_API_KEY;
  }

  async search(query: string, options?: any): Promise<NormalizedCompany[]> {
    if (!this.isConfigured()) return [];
    
    console.log(`[SerpApi] Searching for: ${query}`);
    // Stub implementation
    return [
      { name: "Search Result Co", website: "https://search-results.com", description: "Found via Google Search (SerpApi)" }
    ];
  }
}
