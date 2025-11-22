import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import Timeline from '@/components/Timeline';
import Link from 'next/link';
import kingdomsData from '@/data/kingdoms.json';
import kingsData from '@/data/kings.json';
import sitesData from '@/data/sites.json';

interface King {
  name: string;
  slug: string;
  reign: string;
  kingdom: string;
  notes?: string;
}

interface Kingdom {
  id: string;
  name: string;
  period: string;
  description: string;
  mapUrl?: string;
  locations?: {
    name: string;
    description?: string;
    googleMapsUrl: string;
  }[];
}

export async function generateStaticParams() {
  return kingdomsData.map((kingdom) => ({
    slug: kingdom.id,
  }));
}

export default async function KingdomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const kingdom = kingdomsData.find((k) => k.id === slug);
  
  if (!kingdom) {
    notFound();
  }

  // Filter kings for this kingdom
  const kingdomKings = kingsData.filter((king: any) => 
    king.kingdom === kingdom.id ||
    king.kingdom.toLowerCase().includes(kingdom.name.toLowerCase()) ||
    kingdom.name.toLowerCase().includes(king.kingdom.toLowerCase())
  );

  // Filter sites for this kingdom
  const kingdomSites = (sitesData as any[]).filter((site: any) => 
    site.kingdom.toLowerCase() === kingdom.id.toLowerCase() ||
    site.kingdom.toLowerCase().includes(kingdom.name.toLowerCase()) ||
    kingdom.name.toLowerCase().includes(site.kingdom.toLowerCase())
  );

  return (
    <main className="max-w-5xl mx-auto py-6 px-5">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: kingdom.name }
        ]} />
        
        <article>
          <h1 className="text-4xl font-bold mb-4">{kingdom.name} Kingdom</h1>
          <p className="text-lg mb-6">{kingdom.description}</p>
          
          {kingdom.period && (
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
              <strong>Period:</strong> {kingdom.period}
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
                    title={`Map of ${kingdom.name}`}
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
                  <div key={`${kingdom.id}-location-${index}`} className="card overflow-hidden">
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
