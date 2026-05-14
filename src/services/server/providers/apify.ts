import { SearchProvider, NormalizedCompany, ProviderType } from "./base";

export class ApifyProvider extends SearchProvider {
  name = "Apify";
  type: ProviderType = 'scraping';

  isConfigured(): boolean {
    return !!process.env.APIFY_TOKEN;
  }

  async search(query: string, options?: any): Promise<NormalizedCompany[]> {
    if (!this.isConfigured()) return [];
    
    console.log(`[Apify] Running actor for: ${query}`);
    // Stub implementation
    return [
      { name: "Apify Scraped", domain: "apify.com", website: "https://apify.com" }
    ];
  }
}
