'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { parseStartYear } from '@/lib/utils';

interface King {
  slug: string;
  title: string;
  reign: string;
  kingdom: string;
}

interface Kingdom {
  slug: string;
  title: string;
}

interface Props {
  kings: King[];
  kingdoms: Kingdom[];
}

export default function TimelineOverview({ kings, kingdoms }: Props) {
  // Group kings by kingdom and sort everything chronologically
  const groupedData = useMemo(() => {
    const kingdomMap = new Map(kingdoms.map(k => [k.slug, k]));
    const groups: Record<string, King[]> = {};

    kings.forEach(king => {
      // Normalize kingdom slug if needed (though data should be consistent)
      const kSlug = king.kingdom;
      if (!groups[kSlug]) {
        groups[kSlug] = [];
      }
      groups[kSlug].push(king);
    });

    // Create array of kingdom groups with metadata
    const groupArray = Object.entries(groups).map(([slug, kingsInGroup]) => {
        // Sort kings within the kingdom by year
        const sortedKings = [...kingsInGroup].sort((a, b) =>
            parseStartYear(a.reign) - parseStartYear(b.reign)
        );

        const kingdom = kingdomMap.get(slug);
        const startYear = sortedKings.length > 0 ? parseStartYear(sortedKings[0].reign) : 9999;

        return {
            slug,
            title: kingdom ? kingdom.title : slug, // Fallback to slug if title not found
            kings: sortedKings,
            startYear
        };
    });

    // Sort kingdoms by the start year of their first king
    return groupArray.sort((a, b) => a.startYear - b.startYear);
  }, [kings, kingdoms]);

  return (
    <div className="w-full mb-10">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-xl font-bold">Timeline Overview</h2>
        <span className="text-sm text-gray-500">Scroll to explore eras</span>
      </div>

      {/* Main Horizontal Scroll Container */}
      <div className="w-full overflow-x-auto pb-6 scroll-smooth snap-x snap-mandatory">
        <div className="flex gap-4 w-max px-1">
          {groupedData.map((group) => (
            <div
              key={group.slug}
              className="flex flex-col gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 snap-start"
            >
              {/* Kingdom Header */}
              <div className="flex items-baseline gap-2 border-b border-gray-200 dark:border-gray-700 pb-2 mb-1 min-w-[150px]">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  {group.title}
                </span>
                <span className="text-xs text-gray-400">
                  {group.kings.length} {group.kings.length === 1 ? 'King' : 'Kings'}
                </span>
              </div>

              {/* Kings Row for this Kingdom */}
              <div className="flex gap-2">
                {group.kings.map((king) => {
                  const startYear = parseStartYear(king.reign);
                  // Format year: remove negative sign for BCE
                  const yearDisplay = startYear < 0
                    ? `${Math.abs(startYear)} BCE`
                    : `${startYear} CE`;

                  return (
                    <Link
                      key={king.slug}
                      href={`/kings/${king.slug}`}
                      className="group relative flex flex-col justify-between w-28 h-28 p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-accent hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                      title={`${king.title} (${king.reign})`}
                    >
                      {/* King Name */}
                      <span className="text-xs font-semibold text-gray-900 dark:text-gray-100 line-clamp-3 leading-tight group-hover:text-accent transition-colors">
                        {king.title}
                      </span>

                      {/* Year Display - "small year without the king's name" (separated) */}
                      <div className="mt-auto pt-2 border-t border-gray-50 dark:border-gray-800">
                        <span className="text-[10px] font-mono font-medium text-gray-400 dark:text-gray-500 block">
                          {yearDisplay}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
