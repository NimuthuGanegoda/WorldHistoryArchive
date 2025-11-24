import Link from 'next/link';

interface TimelineKing {
  slug: string;
  title: string;
  reign: string;
}

interface TimelineProps {
  readonly kings: TimelineKing[];
}

export default function Timeline({ kings }: TimelineProps) {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--accent)] to-[var(--accent-alt)]" />
      
      {/* Timeline items */}
      <div className="space-y-6">
        {kings.map((king, index) => (
          <div key={king.slug} className="relative pl-20">
            {/* Timeline dot */}
            <div className="absolute left-6 top-2 w-5 h-5 rounded-full bg-[var(--accent)] border-4 border-white dark:border-gray-900 shadow-lg" />
            
            {/* Timeline content */}
            <Link 
              href={`/kings/${king.slug}`}
              className="block group"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-all hover:border-[var(--accent)] hover:-translate-y-1">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[var(--accent)] group-hover:underline">
                      {king.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Reign: {king.reign}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-500 font-mono">
                    #{index + 1}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
