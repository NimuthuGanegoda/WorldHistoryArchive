import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import Link from 'next/link';
import sitesData from '@/data/sites.json';
import kingdomsData from '@/data/kingdoms.json';

interface Site {
  id: string;
  name: string;
  kingdom: string;
  period: string;
  type: string;
  builtBy?: string;
  builtByKingId?: string;
  constructed?: string;
  description?: string;
  history?: string;
  construction?: string;
  architecture?: string;
  significance?: string;
  currentStatus?: string;
  googleMapsUrl?: string;
  media?: {
    type: 'youtube' | 'vimeo' | 'embed';
    url: string;
    title?: string;
  }[];
  [key: string]: any;
}

// Optimization: Hoist Map creation for O(1) lookups
const sitesMap = new Map(sitesData.map((s) => [s.id, s]));

// Optimization: Pre-compute Site -> Kingdom mapping to avoid O(N*M) lookups per request
const siteKingdomMap = new Map();

// Helper to prepare kingdoms for efficient searching
const preparedKingdoms = kingdomsData.map(k => ({
  original: k,
  titleLower: k.title.toLowerCase(),
}));

// Optimization: Create lookup map for O(1) matching
const kingdomLookup = new Map<string, typeof kingdomsData[0]>();
kingdomsData.forEach((k) => {
  kingdomLookup.set(k.slug, k);
  kingdomLookup.set(k.slug.toLowerCase(), k);
  kingdomLookup.set(k.title.toLowerCase(), k);
});

sitesData.forEach(site => {
  if (!site.kingdom) return;
  const siteKingdomLower = site.kingdom.toLowerCase();

  // Optimization: Bolt ⚡ O(1) exact match lookup
  let kingdom = kingdomLookup.get(siteKingdomLower);

  if (!kingdom) {
    // Fallback: O(M) fuzzy matching
    const match = preparedKingdoms.find(k =>
      siteKingdomLower.includes(k.titleLower) ||
      k.titleLower.includes(siteKingdomLower)
    );
    if (match) kingdom = match.original;
  }

  if (kingdom) {
    siteKingdomMap.set(site.id, kingdom);
  }
});

export async function generateStaticParams() {
  return sitesData.map((site) => ({
    slug: site.id,
  }));
}

export default async function SitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = sitesMap.get(slug) as Site | undefined;
  
  if (!site) {
    notFound();
  }

  // O(1) Lookup
  const kingdom = siteKingdomMap.get(site.id);

  return (
    <div className="max-w-5xl mx-auto py-6 px-5">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: 'Historical Sites', href: '/sites' },
          { label: site.name }
        ]} />
        
        <article>
          <div className="text-center mb-8">
            <span className="text-8xl block mb-4">
              {site.type === 'stupa' && '⛩️'}
              {site.type === 'palace' && '🏰'}
              {site.type === 'temple' && '🛕'}
              {site.type === 'fortress' && '🏛️'}
              {site.type === 'monastery' && '🕉️'}
              {!['stupa', 'palace', 'temple', 'fortress', 'monastery'].includes(site.type) && '📍'}
            </span>
            <h1 className="text-4xl font-bold mb-4">{site.name}</h1>
          </div>
          
          <section className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><strong>Kingdom:</strong> {kingdom ? (
                <Link href={`/kingdoms/${kingdom.slug}`} className="text-[var(--accent)] hover:underline">
                  {site.kingdom}
                </Link>
              ) : site.kingdom}</div>
              <div><strong>Period:</strong> {site.period}</div>
              <div><strong>Type:</strong> <span className="capitalize">{site.type}</span></div>
              {site.builtBy && (
                <div><strong>Built By:</strong> {site.builtByKingId ? (
                  <Link href={`/kings/${site.builtByKingId}`} className="text-[var(--accent)] hover:underline">
                    {site.builtBy}
                  </Link>
                ) : site.builtBy}</div>
              )}
              {site.constructed && <div><strong>Constructed:</strong> {site.constructed}</div>}
            </div>
          </section>

          {site.description && (
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4">Overview</h2>
              <p className="text-lg leading-relaxed">{site.description}</p>
            </div>
          )}

          {site.history && (
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4">History</h2>
              <div className="prose dark:prose-invert max-w-none">
                {site.history.split('\n\n').map((paragraph: string, index: number) => (
                  <p key={index} className="mb-4 text-lg leading-relaxed">{paragraph}</p>
                ))}
              </div>
            </div>
          )}

          {site.construction && (
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4">Construction</h2>
              <div className="prose dark:prose-invert max-w-none">
                {site.construction.split('\n\n').map((paragraph: string, index: number) => (
                  <p key={index} className="mb-4 text-lg leading-relaxed">{paragraph}</p>
                ))}
              </div>
            </div>
          )}

          {site.architecture && (
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4">Architecture</h2>
              <div className="prose dark:prose-invert max-w-none">
                {site.architecture.split('\n\n').map((paragraph: string, index: number) => (
                  <p key={index} className="mb-4 text-lg leading-relaxed">{paragraph}</p>
                ))}
              </div>
            </div>
          )}

          {site.significance && (
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4">Significance</h2>
              <div className="prose dark:prose-invert max-w-none">
                {site.significance.split('\n\n').map((paragraph: string, index: number) => (
                  <p key={index} className="mb-4 text-lg leading-relaxed">{paragraph}</p>
                ))}
              </div>
            </div>
          )}

          {site.currentStatus && (
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4">Current Status</h2>
              <p className="text-lg leading-relaxed">{site.currentStatus}</p>
            </div>
          )}

          {site.media && site.media.length > 0 && (
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4">Media & Documentaries</h2>
              <div className="grid grid-cols-1 gap-6">
                {site.media.map((item: any, index: number) => (
                  <div key={`${site.id}-media-${index}`} className="card overflow-hidden">
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
                          title={item.title || `Video about ${site.name}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      )}
                      {item.type === 'vimeo' && (
                        <iframe
                          className="absolute top-0 left-0 w-full h-full"
                          src={`https://player.vimeo.com/video/${item.url}`}
                          title={item.title || `Video about ${site.name}`}
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                        />
                      )}
                      {item.type === 'embed' && (
                        <iframe
                          className="absolute top-0 left-0 w-full h-full"
                          src={item.url}
                          title={item.title || `Video about ${site.name}`}
                          allowFullScreen
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {site.googleMapsUrl && (
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4">Location</h2>
              <div className="card overflow-hidden">
                <div className="relative" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={site.googleMapsUrl}
                    title={`Map of ${site.name}`}
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          )}
        </article>
      </div>
  );
}
