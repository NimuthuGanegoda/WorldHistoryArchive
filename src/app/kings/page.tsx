import Breadcrumbs from '@/components/Breadcrumbs';
import kingsData from '@/data/kings.json';
import kingdomsData from '@/data/kingdoms.json';
import Link from 'next/link';

interface King {
  slug: string;
  title: string;
  reign: string;
  kingdom: string;
}

export default function KingsIndex() {
  const kings = (kingsData as King[]).slice().sort((a, b) => a.title.localeCompare(b.title));
  const kingdomTitles = new Map((kingdomsData as any[]).map((k) => [k.slug, k.title]));

  return (
    <main className="max-w-5xl mx-auto py-6 px-5">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Kings' }]} />

      <header className="mb-6">
        <h1 className="text-4xl font-bold mb-2">All Kings</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Browse every ruler in the archive. Select any name to open the detailed profile.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {kings.map((king) => (
          <Link
            key={king.slug}
            href={`/kings/${king.slug}`}
            className="card p-5 hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col gap-1">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">{king.title}</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">{king.reign || 'Reign unknown'}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {kingdomTitles.get(king.kingdom) || king.kingdom}
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
