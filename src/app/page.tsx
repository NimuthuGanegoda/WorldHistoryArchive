import Link from 'next/link';
import { getCountries } from '@/lib/data';

export default function Home() {
  const countries = getCountries();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-[#000000]">
      <div className="max-w-4xl w-full text-center fade-in">
        <h1 className="apple-headline mb-4">World History Archive</h1>
        <p className="apple-subheadline mb-12">
          Select a country to explore its history.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 fade-in-delay-1">
          {countries.map((country) => (
            <Link
              key={country.slug}
              href={`/${country.slug}`}
              className="group block p-8 bg-white dark:bg-[#1c1c1e] rounded-[20px] shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-800"
            >
              <h2 className="text-2xl font-semibold mb-2 group-hover:text-[#0071e3] transition-colors">
                {country.name}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                {country.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
