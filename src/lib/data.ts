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
 * Helper to load a single JSON file, returning empty array if it doesn't exist
 */
function loadJsonFile(filepath: string, countrySlug: string, filename: string): any[] {
  try {
    return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
  } catch (error) {
    // File doesn't exist or is invalid - return empty array
    return [];
  }
}

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

  // Load each JSON file
  const kings = loadJsonFile(path.join(dataDir, 'kings.json'), countrySlug, 'kings.json');
  const kingdoms = loadJsonFile(path.join(dataDir, 'kingdoms.json'), countrySlug, 'kingdoms.json');
  const sites = loadJsonFile(path.join(dataDir, 'sites.json'), countrySlug, 'sites.json');

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
