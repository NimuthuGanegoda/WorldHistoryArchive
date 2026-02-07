import fs from 'fs';
import path from 'path';
import countries from '@/data/countries.json';

// Define types to ensure safety
export interface Country {
  slug: string;
  name: string;
  description: string;
}

// Cache for loaded country data to avoid repeated file reads
const dataCache: Record<string, { kings: any[]; kingdoms: any[]; sites: any[] }> = {};

/**
 * Loads country data dynamically from the filesystem.
 * Supports any country listed in countries.json without code changes.
 */
function loadCountryData(countrySlug: string): { kings: any[]; kingdoms: any[]; sites: any[] } {
  // Return cached data if available
  if (dataCache[countrySlug]) {
    return dataCache[countrySlug];
  }

  // Path to the country's data directory
  const dataDir = path.join(process.cwd(), 'src', 'data', countrySlug);

  // Initialize empty arrays as defaults
  let kings: any[] = [];
  let kingdoms: any[] = [];
  let sites: any[] = [];

  // Load each JSON file if it exists
  try {
    const kingsPath = path.join(dataDir, 'kings.json');
    if (fs.existsSync(kingsPath)) {
      kings = JSON.parse(fs.readFileSync(kingsPath, 'utf-8'));
    }
  } catch (error) {
    console.warn(`Failed to load kings.json for ${countrySlug}:`, error);
  }

  try {
    const kingdomsPath = path.join(dataDir, 'kingdoms.json');
    if (fs.existsSync(kingdomsPath)) {
      kingdoms = JSON.parse(fs.readFileSync(kingdomsPath, 'utf-8'));
    }
  } catch (error) {
    console.warn(`Failed to load kingdoms.json for ${countrySlug}:`, error);
  }

  try {
    const sitesPath = path.join(dataDir, 'sites.json');
    if (fs.existsSync(sitesPath)) {
      sites = JSON.parse(fs.readFileSync(sitesPath, 'utf-8'));
    }
  } catch (error) {
    console.warn(`Failed to load sites.json for ${countrySlug}:`, error);
  }

  // Cache the loaded data
  const data = { kings, kingdoms, sites };
  dataCache[countrySlug] = data;

  return data;
}

export function getCountries(): Country[] {
  return countries;
}

export function getCountry(slug: string): Country | undefined {
  return countries.find(c => c.slug === slug);
}

export function getKings(countrySlug: string): any[] {
  return loadCountryData(countrySlug).kings;
}

export function getKingdoms(countrySlug: string): any[] {
  return loadCountryData(countrySlug).kingdoms;
}

export function getSites(countrySlug: string): any[] {
  return loadCountryData(countrySlug).sites;
}
