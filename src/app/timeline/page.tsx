import Link from 'next/link';
import kingsData from '@/data/kings.json';
import kingdomsData from '@/data/kingdoms.json';

export const metadata = {
  title: 'Historical Timeline | Sri Lanka History',
  description: 'Complete chronological timeline of Sri Lankan monarchs from 543 BCE to 1815 CE',
};

// Group kings by era
function groupKingsByEra(kings: any[]) {
  const eras = {
    'Ancient Period (543 BCE - 250 CE)': [] as any[],
    'Classical Period (250 CE - 1017 CE)': [] as any[],
    'Medieval Period (1017 CE - 1400 CE)': [] as any[],
    'Late Medieval Period (1400 CE - 1600 CE)': [] as any[],
    'Colonial Era (1600 CE - 1815 CE)': [] as any[],
  };

  kings.forEach(king => {
    const year = extractStartYear(king.reign);
    
    if (year < 250) {
      eras['Ancient Period (543 BCE - 250 CE)'].push(king);
    } else if (year < 1017) {
      eras['Classical Period (250 CE - 1017 CE)'].push(king);
    } else if (year < 1400) {
      eras['Medieval Period (1017 CE - 1400 CE)'].push(king);
    } else if (year < 1600) {
      eras['Late Medieval Period (1400 CE - 1600 CE)'].push(king);
    } else {
      eras['Colonial Era (1600 CE - 1815 CE)'].push(king);
    }
  });

  return eras;
}

function extractStartYear(reign: string): number {
  if (!reign) return 9999;
  const match = reign.match(/(\d+)/);
  if (!match) return 9999;
  const year = parseInt(match[1]);
  if (reign.includes('BCE') || reign.includes('BC')) {
    return -year;
  }
  return year;
}

// Pre-compute eras and kingdom map at module scope
const kings = kingsData as any[];
const eras = groupKingsByEra(kings);
// Create Map for O(1) lookup using 'id' (which corresponds to king.kingdom slug)
const kingdomMap = new Map(kingdomsData.map((k: any) => [k.id, k]));

export default function TimelinePage() {
  return (
    <main className="max-w-7xl mx-auto py-6 px-5">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Historical Timeline</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Complete chronological timeline of Sri Lankan monarchs spanning over 2,300 years
        </p>
      </div>

      <div className="space-y-12">
        {Object.entries(eras).map(([eraName, eraKings]) => (
          <section key={eraName}>
            <h2 className="text-3xl font-bold mb-6 text-[var(--accent)] border-b-2 border-[var(--accent)] pb-2">
              {eraName}
            </h2>
            
            <div className="space-y-4">
              {eraKings.map((king: any) => {
                const kingdom = kingdomMap.get(king.kingdom);
                
                return (
                  <div 
                    key={king.slug}
                    className="flex items-start gap-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex-shrink-0 w-40">
                      <div className="text-sm font-semibold text-[var(--accent)]">
                        {king.reign}
                      </div>
                      {kingdom && (
                        <Link 
                          href={`/kingdoms/${kingdom.id}`}
                          className="text-xs text-gray-600 dark:text-gray-400 hover:text-[var(--accent)] hover:underline"
                        >
                          {kingdom.name}
                        </Link>
                      )}
                    </div>

                    <div className="flex-1">
                      <Link 
                        href={`/kings/${king.slug}`}
                        className="group"
                      >
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-[var(--accent)] transition-colors">
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
          This timeline presents {kings.length} monarchs who ruled various kingdoms across Sri Lanka, 
          from the legendary arrival of Prince Vijaya in 543 BCE to the last Kandyan king in 1815 CE. 
          The timeline reflects the island&apos;s rich history of shifting capitals, regional kingdoms, 
          and cultural evolution spanning over two millennia.
        </p>
      </div>
    </main>
  );
}
