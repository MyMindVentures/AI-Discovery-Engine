import { GooglePlacesProvider } from "./googlePlaces";
import { FirecrawlProvider } from "./firecrawl";
import { ExaProvider } from "./exa";
import { SerpApiProvider } from "./serpapi";
import { ApifyProvider } from "./apify";
import { PhantomBusterProvider } from "./phantombuster";
import { HunterProvider } from "./hunter";
import { WappalyzerProvider } from "./wappalyzer";
import { ApolloProvider } from "./apollo";
import { SearchProvider } from "./base";

export const allProviders: SearchProvider[] = [
  new GooglePlacesProvider(),
  new FirecrawlProvider(),
  new ExaProvider(),
  new SerpApiProvider(),
  new ApifyProvider(),
  new PhantomBusterProvider(),
  new HunterProvider(),
  new WappalyzerProvider(),
  new ApolloProvider()
];

export function getProviderByName(name: string): SearchProvider | undefined {
  return allProviders.find(p => p.name === name);
}

export function getProvidersByType(type: string): SearchProvider[] {
  return allProviders.filter(p => p.type === type);
}
