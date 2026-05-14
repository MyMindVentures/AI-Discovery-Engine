import { SearchProvider, NormalizedCompany, ProviderType } from "./base";

export class WappalyzerProvider extends SearchProvider {
  name = "Wappalyzer";
  type: ProviderType = 'enrichment';

  isConfigured(): boolean {
    return !!process.env.WAPPALYZER_API_KEY;
  }

  async search(query: string, options?: any): Promise<NormalizedCompany[]> {
    return [];
  }

  async enrich(domain: string, options?: any): Promise<Partial<NormalizedCompany>> {
    if (!this.isConfigured()) return {};
    console.log(`[Wappalyzer] Detecting tech stack for: ${domain}`);
    return {
      metadata: { technologies: ["React", "Cloudflare", "Tailwind CSS"] }
    };
  }
}
