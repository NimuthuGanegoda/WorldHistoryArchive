import countries from '@/data/countries.json';
import slKings from '@/data/sri-lanka/kings.json';
import slKingdoms from '@/data/sri-lanka/kingdoms.json';
import slSites from '@/data/sri-lanka/sites.json';

// Define types to ensure safety
export interface Country {
  slug: string;
  name: string;
  description: string;
}

const DATA_MAP: Record<string, { kings: any[]; kingdoms: any[]; sites: any[] }> = {
  'sri-lanka': {
    kings: slKings,
    kingdoms: slKingdoms,
    sites: slSites
  }
};

export function getCountries(): Country[] {
  return countries;
}

export function getCountry(slug: string): Country | undefined {
  return countries.find(c => c.slug === slug);
}

export function getKings(countrySlug: string): any[] {
  return DATA_MAP[countrySlug]?.kings || [];
}

export function getKingdoms(countrySlug: string): any[] {
  return DATA_MAP[countrySlug]?.kingdoms || [];
}

export function getSites(countrySlug: string): any[] {
  return DATA_MAP[countrySlug]?.sites || [];
}
