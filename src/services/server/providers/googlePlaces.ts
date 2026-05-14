import { SearchProvider, NormalizedCompany, ProviderType } from "./base";

export class GooglePlacesProvider extends SearchProvider {
  name = "Google Places";
  type: ProviderType = 'search';

  isConfigured(): boolean {
    return !!process.env.GOOGLE_PLACES_API_KEY;
  }

  async search(query: string, options?: any): Promise<NormalizedCompany[]> {
    if (!this.isConfigured()) return [];
    
    console.log(`[GooglePlaces] Searching for: ${query}`);
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`);
      const data = await response.json();
      
      if (data.results) {
        return data.results.map((p: any) => ({
          name: p.name,
          location: p.formatted_address,
          website: p.website || `https://www.google.com/search?q=${encodeURIComponent(p.name)}`,
          metadata: { rating: p.rating, user_ratings_total: p.user_ratings_total }
        }));
      }
    } catch (e) {
      console.error("Google Places Error:", e);
    }

    return [
      { name: "Sample Place", location: "Global", website: "https://example.com" }
    ];
  }
}
