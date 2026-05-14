import { SearchProvider, NormalizedCompany, ProviderType } from "./base";

export class FirecrawlProvider extends SearchProvider {
  name = "Firecrawl";
  type: ProviderType = 'scraping';

  isConfigured(): boolean {
    return !!process.env.FIRECRAWL_API_KEY;
  }

  async search(query: string, options?: any): Promise<NormalizedCompany[]> {
    if (!this.isConfigured()) return [];
    console.log(`[Firecrawl] Crawling for: ${query}`);
    return [
      { name: "Crawl Entity", domain: "crawl.io", website: "https://crawl.io" }
    ];
  }
}
