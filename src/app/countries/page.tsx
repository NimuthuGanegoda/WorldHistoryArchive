import Link from 'next/link';
import kingdomsData from '@/data/kingdoms.json';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata = {
  title: 'Countries | World History Archive',
  description: 'Explore historical kingdoms and rulers organized by country.',
};

export default function CountriesIndex() {
  // Extract unique countries
  const countries = Array.from(new Set(kingdomsData.map((k) => k.country).filter(Boolean))) as string[];

  // Sort alphabetically
  countries.sort();

  return (
    <main className="max-w-5xl mx-auto py-6 px-5">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Countries' }]} />

      <header className="mb-6">
        <h1 className="text-4xl font-bold mb-2">Countries</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Browse historical kingdoms and rulers by their modern-day country.
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {countries.map((country) => {
          // Create a simple slug from the country name
          const slug = country.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

          return (
            <Link
              key={slug}
              href={`/countries/${slug}`}
              className="card text-center hover:scale-105 relative group block p-8"
            >
              <div className="text-[56px] mb-4 transition-transform group-hover:scale-110 duration-300">
                🌍
              </div>
              <h2 className="text-[21px] font-semibold text-gray-900 dark:text-white tracking-tight">
                {country}
              </h2>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
