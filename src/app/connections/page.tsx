import Breadcrumbs from '@/components/Breadcrumbs';
import Link from 'next/link';
import kingsData from '@/data/kings.json';

interface King {
  name: string;
  slug: string;
  kingdom: string;
  reign: string;
  internationalConnections?: string;
  [key: string]: any;
}

export default function ConnectionsPage() {
  const kingsWithConnections = kingsData.filter((king: any) => king.internationalConnections);

  return (
    <main className="max-w-7xl mx-auto py-6 px-5">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: 'International Connections' }
        ]} />
        
        <div className="hero-section text-center mb-16">
          <h1 className="apple-headline mb-4">International Connections</h1>
          <p className="apple-subheadline text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore the diplomatic, religious, and political relationships between Sri Lankan monarchs and international empires
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {kingsWithConnections.map((king: King, index: number) => (
            <div 
              key={king.slug}
              className="card p-6 scroll-animate"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-1">
                    <Link href={`/kings/${king.slug}`} className="hover:text-[var(--accent)] transition-colors">
                      {king.name}
                    </Link>
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {king.reign} • {king.kingdom}
                  </p>
                </div>
                <span className="text-4xl">🌏</span>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-gray-700 dark:text-gray-300">{king.internationalConnections}</p>
              </div>
            </div>
          ))}
        </div>

        {kingsWithConnections.length === 0 && (
          <div className="text-center text-gray-600 dark:text-gray-400 py-12">
            <p className="text-xl">International connections data is being compiled and will be added soon.</p>
          </div>
        )}
      </main>
  );
}
