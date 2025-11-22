import Breadcrumbs from '@/components/Breadcrumbs';
import Link from 'next/link';
import sitesData from '@/data/sites.json';

interface Site {
  id: string;
  name: string;
  kingdom: string;
  period: string;
  type: string;
}

export default function SitesPage() {
  return (
    <main className="max-w-7xl mx-auto py-6 px-5">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: 'Historical Sites' }
        ]} />
        
        <div className="hero-section text-center mb-16">
          <h1 className="apple-headline mb-4">Historical Sites</h1>
          <p className="apple-subheadline text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore ancient monuments, temples, palaces, and archaeological sites from Sri Lanka&apos;s royal kingdoms
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sitesData.map((site: Site, index: number) => (
            <Link 
              key={site.id}
              href={`/sites/${site.id}`}
              className="card p-6 hover:scale-105 transition-transform scroll-animate"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-center mb-4">
                <span className="text-6xl">
                  {site.type === 'stupa' && '⛩️'}
                  {site.type === 'palace' && '🏰'}
                  {site.type === 'temple' && '🛕'}
                  {site.type === 'fortress' && '🏛️'}
                  {site.type === 'monastery' && '🕉️'}
                  {!['stupa', 'palace', 'temple', 'fortress', 'monastery'].includes(site.type) && '📍'}
                </span>
              </div>
              <h2 className="text-xl font-bold mb-2 text-center">{site.name}</h2>
              <div className="text-sm text-gray-600 dark:text-gray-400 text-center space-y-1">
                <p>{site.kingdom}</p>
                <p>{site.period}</p>
                <p className="capitalize">{site.type}</p>
              </div>
            </Link>
          ))}
        </div>

        {sitesData.length === 0 && (
          <div className="text-center text-gray-600 dark:text-gray-400 py-12">
            <p className="text-xl">Historical sites data is being compiled and will be added soon.</p>
          </div>
        )}
      </main>
  );
}
