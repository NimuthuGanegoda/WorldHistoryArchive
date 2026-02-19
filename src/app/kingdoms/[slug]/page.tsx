import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import Timeline from '@/components/Timeline';
import Link from 'next/link';
import kingdomsData from '@/data/kingdoms.json';
import kingsData from '@/data/kings.json';
import sitesData from '@/data/sites.json';
import { parseStartYear } from '@/lib/utils';

interface King {
  name: string;
  slug: string;
  reign: string;
  kingdom: string;
  notes?: string;
}

interface Kingdom {
  slug: string;
  title: string;
  reign: string;
  biography: string;
  sections?: any[];
  mapUrl?: string;
  locations?: {
    name: string;
    description?: string;
    googleMapsUrl: string;
  }[];
}

// Optimization: Pre-compute lookups for O(1) access
const kingdomsMap = new Map(kingdomsData.map((k) => [k.slug, k]));
const kingdomKingsMap = new Map();
const kingdomSitesMap = new Map();

// Initialize maps once
// Optimization: Bolt ⚡ optimized grouping from O(N*K) to O(N) using Map lookups
const kingsByKingdom = new Map<string, any[]>();
(kingsData as any[]).forEach((king) => {
  if (!kingsByKingdom.has(king.kingdom)) {
    kingsByKingdom.set(king.kingdom, []);
  }
  kingsByKingdom.get(king.kingdom)?.push(king);
});

// Pre-process kingdoms for faster site matching
const processedKingdoms = kingdomsData.map((k) => ({
  slug: k.slug,
  slugLower: k.slug.toLowerCase(),
  titleLower: k.title.toLowerCase(),
}));

const sitesByKingdom = new Map<string, any[]>();
processedKingdoms.forEach((pk) => sitesByKingdom.set(pk.slug, []));

// Create lookup map for O(1) matching
const kingdomLookup = new Map<string, string>();
processedKingdoms.forEach((pk) => {
  kingdomLookup.set(pk.slug, pk.slug);
  kingdomLookup.set(pk.slugLower, pk.slug);
  kingdomLookup.set(pk.titleLower, pk.slug);
});

(sitesData as any[]).forEach((site) => {
  if (!site.kingdom) return;
  const siteKingdomLower = site.kingdom.toLowerCase();

  // Optimization: Bolt ⚡ O(1) exact match lookup
  // Matches ~93% of sites instantly without iterating kingdoms
  const exactMatchSlug = kingdomLookup.get(siteKingdomLower);

  if (exactMatchSlug) {
    sitesByKingdom.get(exactMatchSlug)?.push(site);
    return;
  }

  // Fallback: O(M) fuzzy matching for remaining ~7%
  processedKingdoms.forEach((pk) => {
    if (
      siteKingdomLower.includes(pk.titleLower) ||
      pk.titleLower.includes(siteKingdomLower)
    ) {
      sitesByKingdom.get(pk.slug)?.push(site);
    }
  });
});

kingdomsData.forEach((kingdom) => {
  // Get grouped kings and sort
  const kKings = (kingsByKingdom.get(kingdom.slug) || [])
    .map((king: any) => ({ king, year: parseStartYear(king.reign) }))
    .sort((a, b) => a.year - b.year)
    .map((item) => item.king);
  kingdomKingsMap.set(kingdom.slug, kKings);

  // Get grouped sites
  const kSites = sitesByKingdom.get(kingdom.slug) || [];
  kingdomSitesMap.set(kingdom.slug, kSites);
});

export async function generateStaticParams() {
  return kingdomsData.map((kingdom) => ({
    slug: kingdom.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const kingdom = kingdomsMap.get(slug);

  if (!kingdom) {
    return {
      title: 'Kingdom Not Found | World History Archive',
    };
  }

  return {
    title: `${kingdom.title} | World History Archive`,
    description: kingdom.biography || `Historical overview of ${kingdom.title}.`,
  };
}

export default async function KingdomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // O(1) Lookup
  const kingdom = kingdomsMap.get(slug);
  
  if (!kingdom) {
    notFound();
  }

  // O(1) Lookup
  const kingdomKings = kingdomKingsMap.get(slug) || [];
  const kingdomSites = kingdomSitesMap.get(slug) || [];

  return (
    <main className="max-w-5xl mx-auto py-6 px-5">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: kingdom.title }
        ]} />
        
        <article>
          <h1 className="text-4xl font-bold mb-4">{kingdom.title}</h1>
          <p className="text-lg mb-6">{kingdom.biography}</p>
          
          {kingdom.reign && (
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
              <strong>Period:</strong> {kingdom.reign}
            </div>
          )}

          {(kingdom as any).mapUrl && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Kingdom Map</h2>
              <div className="card overflow-hidden">
                <div className="relative" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={(kingdom as any).mapUrl}
                    title={`Map of ${kingdom.title}`}
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          )}

          {(kingdom as any).locations && (kingdom as any).locations.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Important Sites</h2>
              <div className="grid grid-cols-1 gap-6">
                {(kingdom as any).locations.map((location: any, index: number) => (
                  <div key={`${kingdom.slug}-location-${index}`} className="card overflow-hidden">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800">
                      <h3 className="font-semibold text-lg mb-1">📍 {location.name}</h3>
                      {location.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{location.description}</p>
                      )}
                    </div>
                    <div className="relative" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={location.googleMapsUrl}
                        title={`Map of ${location.name}`}
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {kingdomSites.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Known Historical Sites</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {kingdomSites.map((site: any) => (
                  <Link 
                    key={site.id}
                    href={`/sites/${site.id}`}
                    className="card p-5 hover:scale-105 transition-transform"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-4xl">
                        {site.type === 'stupa' && '⛩️'}
                        {site.type === 'palace' && '🏰'}
                        {site.type === 'temple' && '🛕'}
                        {site.type === 'fortress' && '🏛️'}
                        {site.type === 'monastery' && '🕉️'}
                        {!['stupa', 'palace', 'temple', 'fortress', 'monastery'].includes(site.type) && '📍'}
                      </span>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{site.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{site.period}</p>
                        {site.builtBy && (
                          <p className="text-sm text-gray-500 dark:text-gray-500">Built by {site.builtBy}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <h2 className="text-2xl font-bold mt-8 mb-6">Monarchs Timeline</h2>
          
          {kingdomKings.length > 0 ? (
            <Timeline kings={kingdomKings} />
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No monarchs currently listed for this kingdom.</p>
          )}
        </article>
      </main>
  );
}
