import Link from 'next/link';
import { getKings, getKingdoms, getCountries } from '@/lib/data';
import { parseStartYear } from '@/lib/utils';

export const metadata = {
  title: 'Historical Timeline',
  description: 'Complete chronological timeline of monarchs.',
};

// Group kings by era
function groupKingsByEra(kings: any[]) {
  const eras = {
    'Ancient Period': [] as any[],
    'Classical Period': [] as any[],
    'Medieval Period': [] as any[],
    'Late Medieval Period': [] as any[],
    'Colonial Era': [] as any[],
    'Other': [] as any[]
  };

  // Pre-calculate years for O(N) sort performance instead of O(N log N) regex parsing
  const kingsWithYear = kings.map(king => ({
    king,
    year: parseStartYear(king.reign)
  }));

  kingsWithYear.forEach(item => {
    const { year } = item;
    
    // Using approximated eras for Sri Lanka context.
    // Ideally this should be configurable per country.
    if (year < 250) {
      eras['Ancient Period'].push(item);
    } else if (year < 1017) {
      eras['Classical Period'].push(item);
    } else if (year < 1400) {
      eras['Medieval Period'].push(item);
    } else if (year < 1600) {
      eras['Late Medieval Period'].push(item);
    } else if (year < 1815) {
      eras['Colonial Era'].push(item);
    } else {
      eras['Other'].push(item);
    }
  });

  // Remove empty eras
  const filteredEras: Record<string, any[]> = {};
  Object.keys(eras).forEach(key => {
    const list = (eras as any)[key];
    if (list.length > 0) {
      // Sort
      list.sort((a: any, b: any) => a.year - b.year);
      filteredEras[key] = list.map((item: any) => item.king);
    }
  });

  return filteredEras;
}

export async function generateStaticParams() {
  const countries = getCountries();
  return countries.map(c => ({ country: c.slug }));
}

export default async function TimelinePage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  const kingsData = getKings(country);
  const kingdomsData = getKingdoms(country);

  // Pre-compute kingdoms map for O(1) lookup
  const kingdomsMap = new Map(kingdomsData.map((k: any) => [k.slug, k]));

  const eras = groupKingsByEra(kingsData);

  return (
    <main className="max-w-7xl mx-auto py-6 px-5">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Historical Timeline</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Complete chronological timeline of monarchs.
        </p>
      </div>

      <div className="space-y-12">
        {Object.entries(eras).map(([eraName, eraKings]) => (
          <section key={eraName}>
            <h2 className="text-3xl font-bold mb-6 text-accent border-b-2 border-accent pb-2">
              {eraName}
            </h2>
            
            <div className="space-y-4">
              {eraKings.map((king: any) => {
                // O(1) lookup
                const kingdom = kingdomsMap.get(king.kingdom);
                
                return (
                  <div 
                    key={king.slug}
                    className="flex items-start gap-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex-shrink-0 w-40">
                      <div className="text-sm font-semibold text-accent">
                        {king.reign}
                      </div>
                      {kingdom && (
                        <Link 
                          href={`/${country}/kingdoms/${kingdom.slug}`}
                          className="text-xs text-gray-600 dark:text-gray-400 hover:text-accent hover:underline"
                        >
                          {kingdom.title}
                        </Link>
                      )}
                    </div>

                    <div className="flex-1">
                      <Link 
                        href={`/${country}/kings/${king.slug}`}
                        className="group"
                      >
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-accent transition-colors">
                          {king.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {king.biography}
                        </p>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 text-sm text-gray-500 dark:text-gray-500">
              {eraKings.length} {eraKings.length === 1 ? 'monarch' : 'monarchs'}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded">
        <h3 className="text-lg font-bold mb-2">About This Timeline</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          This timeline presents {kingsData.length} monarchs.
        </p>
      </div>
    </main>
  );
}
