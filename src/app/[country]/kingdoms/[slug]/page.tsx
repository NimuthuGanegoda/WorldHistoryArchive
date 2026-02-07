import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import Timeline from '@/components/Timeline';
import Link from 'next/link';
import { getKingdoms, getKings, getSites, getCountries } from '@/lib/data';
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

export async function generateStaticParams() {
  const countries = getCountries();
  const params = [];
  for (const country of countries) {
    const kingdoms = getKingdoms(country.slug);
    for (const kingdom of kingdoms) {
      params.push({ country: country.slug, slug: kingdom.slug });
    }
  }
  return params;
}

export default async function KingdomPage({ params }: { params: Promise<{ country: string, slug: string }> }) {
  const { country, slug } = await params;

  const kingdomsData = getKingdoms(country);
  const kingsData = getKings(country);
  const sitesData = getSites(country);

  const kingdom = kingdomsData.find((k: any) => k.slug === slug);

  if (!kingdom) {
    notFound();
  }

  // Filter kings for this kingdom
  const kingdomKings = kingsData
    .filter((k: any) => k.kingdom === slug)
    .sort((a: any, b: any) => parseStartYear(a.reign) - parseStartYear(b.reign));

  // Filter sites for this kingdom
  const kingdomSlugLower = kingdom.slug.toLowerCase();
  const kingdomTitleLower = kingdom.title.toLowerCase();

  const kingdomSites = sitesData.filter((site: any) => {
    if (!site.kingdom) return false;
    const siteKingdomLower = site.kingdom.toLowerCase();

    // Exact match
    if (siteKingdomLower === kingdomSlugLower || siteKingdomLower === kingdomTitleLower) {
      return true;
    }

    // Fuzzy match
    if (siteKingdomLower.includes(kingdomTitleLower) || kingdomTitleLower.includes(siteKingdomLower)) {
      return true;
    }
    return false;
  });

  return (
    <main className="max-w-5xl mx-auto py-6 px-5">
        <Breadcrumbs items={[
          { label: 'Home', href: `/${country}` },
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
                    href={`/${country}/sites/${site.id}`}
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
            <Timeline kings={kingdomKings} countrySlug={country} />
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No monarchs currently listed for this kingdom.</p>
          )}
        </article>
      </main>
  );
}
