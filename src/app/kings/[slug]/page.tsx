import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import kingsData from '@/data/kings.json';
import kingdomsData from '@/data/kingdoms.json';

interface King {
  name: string;
  slug: string;
  kingdom: string;
  reign: string;
  internationalConnections?: string;
  media?: {
    type: 'youtube' | 'vimeo' | 'embed';
    url: string;
    title?: string;
  }[];
  locations?: {
    name: string;
    description?: string;
    googleMapsUrl: string;
  }[];
  [key: string]: any; // Allow additional properties
}

export async function generateStaticParams() {
  return kingsData.map((king) => ({
    slug: king.slug,
  }));
}

export default async function KingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const king = kingsData.find((k: any) => k.slug === slug) as King | undefined;
  
  if (!king) {
    notFound();
  }

  // Find the kingdom
  const kingdom = kingdomsData.find((k) => 
    king.kingdom.toLowerCase().includes(k.name.toLowerCase()) ||
    k.name.toLowerCase().includes(king.kingdom.toLowerCase())
  );

  return (
    <main className="max-w-5xl mx-auto py-6 px-5">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          ...(kingdom ? [{ label: kingdom.name, href: `/kingdoms/${kingdom.id}` }] : []),
          { label: king.name }
        ]} />
        
        <article>
          <h1 className="text-4xl font-bold mb-4">{king.name}</h1>
          
          <section className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div><strong>Reign:</strong> {king.reign}</div>
              <div><strong>Kingdom:</strong> {king.kingdom}</div>
            </div>
          </section>

          {king.notes && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-3">Overview</h2>
              <p className="text-lg">{king.notes}</p>
            </div>
          )}

          {king.internationalConnections && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-3">International Connections</h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-lg">{king.internationalConnections}</p>
              </div>
            </div>
          )}

          {king.biography && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-3">Biography</h2>
              <div className="prose dark:prose-invert max-w-none">
                {king.biography.split('\n\n').map((paragraph: string) => (
                  <p key={paragraph.substring(0, 50)} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>
          )}

          {king.media && king.media.length > 0 && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Media & Films</h2>
              <div className="grid grid-cols-1 gap-6">
                {king.media.map((item: any, index: number) => (
                  <div key={`${king.id}-media-${index}`} className="card overflow-hidden">
                    {item.title && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-800">
                        <h3 className="font-semibold">{item.title}</h3>
                      </div>
                    )}
                    <div className="relative" style={{ paddingBottom: '56.25%' }}>
                      {item.type === 'youtube' && (
                        <iframe
                          className="absolute top-0 left-0 w-full h-full"
                          src={`https://www.youtube.com/embed/${item.url}`}
                          title={item.title || `Video about ${king.name}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      )}
                      {item.type === 'vimeo' && (
                        <iframe
                          className="absolute top-0 left-0 w-full h-full"
                          src={`https://player.vimeo.com/video/${item.url}`}
                          title={item.title || `Video about ${king.name}`}
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                        />
                      )}
                      {item.type === 'embed' && (
                        <iframe
                          className="absolute top-0 left-0 w-full h-full"
                          src={item.url}
                          title={item.title || `Video about ${king.name}`}
                          allowFullScreen
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {king.locations && king.locations.length > 0 && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Historical Locations</h2>
              <div className="grid grid-cols-1 gap-6">
                {king.locations.map((location: any, index: number) => (
                  <div key={`${king.id}-location-${index}`} className="card overflow-hidden">
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

          {!king.biography && !king.notes && !king.media && !king.locations && (
            <p className="text-gray-600 dark:text-gray-400">
              Detailed biography for {king.name} is being researched and will be added soon.
            </p>
          )}
        </article>
      </main>
  );
}
