import Link from 'next/link';
import kingsData from '@/data/kings.json';
import kingdomsData from '@/data/kingdoms.json';
import { parseStartYear } from '@/lib/utils';
import TimelineOverview from '@/components/TimelineOverview';

export const metadata = {
  title: 'Historical Timeline | World History Archive',
  description: 'Complete chronological timeline of monarchs and rulers from ancient times to the colonial era',
};

// Hoist regex patterns to avoid recompilation
const YEAR_REGEX = /(\d+)/;
const BCE_REGEX = /BCE|BC/;

// Pre-compute kingdoms map for O(1) lookup
const kingdomsMap = new Map(kingdomsData.map((k: any) => [k.slug, k]));

function extractStartYear(reign: string): number {
  if (!reign) return 9999;
  const match = reign.match(YEAR_REGEX);
  if (!match) return 9999;
  const year = parseInt(match[1]);
  if (BCE_REGEX.test(reign)) {
    return -year;
  }
  return year;
}

// Group kings by era
function groupKingsByEra(kings: any[]) {
  const eras = {
    'Ancient Period (Before 250 CE)': [] as any[],
    'Classical Period (250 CE - 1017 CE)': [] as any[],
    'Medieval Period (1017 CE - 1400 CE)': [] as any[],
    'Late Medieval Period (1400 CE - 1600 CE)': [] as any[],
    'Colonial Era (1600 CE - 1815 CE)': [] as any[],
  };

  // Pre-calculate years for O(N) sort performance instead of O(N log N) regex parsing
  const kingsWithYear = kings.map(king => ({
    king,
    year: parseStartYear(king.reign)
  }));

  kingsWithYear.forEach(item => {
    const { year } = item;
    
    if (year < 250) {
      eras['Ancient Period (Before 250 CE)'].push(item);
    } else if (year < 1017) {
      eras['Classical Period (250 CE - 1017 CE)'].push(item);
    } else if (year < 1400) {
      eras['Medieval Period (1017 CE - 1400 CE)'].push(item);
    } else if (year < 1600) {
      eras['Late Medieval Period (1400 CE - 1600 CE)'].push(item);
    } else {
      eras['Colonial Era (1600 CE - 1815 CE)'].push(item);
    }
  });

  // Sort kings within each era chronologically using pre-calculated year
  Object.keys(eras).forEach((key) => {
    const eraList = (eras as any)[key];
    eraList.sort((a: any, b: any) => a.year - b.year);
    // Unwrap back to original king objects
    (eras as any)[key] = eraList.map((item: any) => item.king);
  });

  return eras;
}

const STATIC_ERAS = groupKingsByEra(kingsData as any[]);

export default function TimelinePage() {
  const kings = kingsData as any[];
  const eras = STATIC_ERAS;

  return (
    <div className="max-w-7xl mx-auto py-6 px-5">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Historical Timeline</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Complete chronological timeline of monarchs and rulers spanning over 2,300 years
        </p>
      </div>

      <TimelineOverview kings={kingsData as any[]} kingdoms={kingdomsData as any[]} />

      <div className="space-y-12">
        {Object.entries(eras).map(([eraName, eraKings]) => (
          <section key={eraName}>
            <h2 className="text-3xl font-bold mb-6 text-accent border-b-2 border-accent pb-2">
              {eraName}
            </h2>
            
            <div className="space-y-4">
              {eraKings.map((king: any) => {
                // O(1) lookup instead of O(N) find
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
                          href={`/kingdoms/${kingdom.slug}`}
                          className="text-xs text-gray-600 dark:text-gray-400 hover:text-accent hover:underline"
                        >
                          {kingdom.title}
                        </Link>
                      )}
                    </div>

                    <div className="flex-1">
                      <Link 
                        href={`/kings/${king.slug}`}
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
          This timeline presents {kings.length} monarchs who ruled various kingdoms and empires.
          The timeline reflects the rich history of shifting powers, regional kingdoms,
          and cultural evolution spanning over two millennia.
        </p>
      </div>
    </div>
  );
}
