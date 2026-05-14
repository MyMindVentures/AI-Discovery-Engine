export interface NormalizedCompany {
  name: string;
  domain?: string;
  website?: string;
  description?: string;
  industry?: string;
  location?: string;
  linkedin?: string;
  twitter?: string;
  logo?: string;
  phone?: string;
  metadata?: any;
}

export type ProviderType = 'search' | 'scraping' | 'enrichment' | 'automation';

export abstract class SearchProvider {
  abstract name: string;
  abstract type: ProviderType;
  abstract isConfigured(): boolean;
  abstract search(query: string, options?: any): Promise<NormalizedCompany[]>;
  
  async enrich?(domain: string, options?: any): Promise<Partial<NormalizedCompany>> {
    return {};
  }

  estimateCost?(params: any): number {
    return 0;
  }
}
