import { notFound } from 'next/navigation';
import Link from 'next/link';
import kingdomsData from '@/data/kingdoms.json';
import kingsData from '@/data/kings.json';
import Breadcrumbs from '@/components/Breadcrumbs';
import KingdomCard from '@/components/KingdomCard';
import { parseStartYear } from '@/lib/utils';

interface King {
  slug: string;
  title: string;
  reign: string;
  kingdom: string;
  biography: string;
}

interface Kingdom {
  slug: string;
  title: string;
  reign: string;
  country?: string;
  biography: string;
  sections: {
    heading: string;
    content: string[];
    infoBoxes: any[];
  }[];
}

const allKingdoms = kingdomsData as Kingdom[];
const allKings = kingsData as King[];

// Pre-compute unique countries and their slugs at module level
const uniqueCountries = Array.from(new Set(allKingdoms.map(k => k.country).filter(Boolean))) as string[];
const countrySlugMap = new Map<string, string>(); // Maps slug -> Original Name
uniqueCountries.forEach(country => {
  const slug = country.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  countrySlugMap.set(slug, country);
});

// Pre-compute maps for efficient lookups
const kingdomMap = new Map(allKingdoms.map(k => [k.slug, k]));

export function generateStaticParams() {
  return Array.from(countrySlugMap.keys()).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { readonly params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const countryName = countrySlugMap.get(slug);

  if (!countryName) {
    return {
      title: 'Country Not Found | World History Archive',
    };
  }

  return {
    title: `${countryName} | World History Archive`,
    description: `Explore the historical kingdoms and rulers of ${countryName}.`,
  };
}

export default async function CountryPage({ params }: { readonly params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const countryName = countrySlugMap.get(slug);

  if (!countryName) {
    notFound();
  }

  // Filter kingdoms for this country
  const countryKingdoms = allKingdoms
    .filter(k => k.country === countryName)
    .sort((a, b) => parseStartYear(a.reign) - parseStartYear(b.reign));

  // Set of kingdom slugs that belong to this country for fast king lookup
  const countryKingdomSlugs = new Set(countryKingdoms.map(k => k.slug));

  // Filter kings whose kingdom belongs to this country
  const countryKings = allKings
    .filter(k => countryKingdomSlugs.has(k.kingdom))
    .sort((a, b) => parseStartYear(a.reign) - parseStartYear(b.reign));

  const kingdomTitles = new Map(allKingdoms.map(k => [k.slug, k.title]));

  return (
    <main className="max-w-5xl mx-auto py-6 px-5 min-h-[60vh]">
      <Breadcrumbs items={[
        { label: 'Home', href: '/' },
        { label: 'Countries', href: '/countries' },
        { label: countryName }
      ]} />

      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{countryName}</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          History and heritage of {countryName}, spanning {countryKingdoms.length} kingdoms and {countryKings.length} rulers.
        </p>
      </header>

      {countryKingdoms.length > 0 && (
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
            Kingdoms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {countryKingdoms.map((kingdom) => {
              const description =
                kingdom.sections?.[0]?.content?.[0] ||
                kingdom.biography ||
                'A historical kingdom.';

              return (
                <KingdomCard
                  key={kingdom.slug}
                  slug={kingdom.slug}
                  name={kingdom.title}
                  description={description}
                />
              );
            })}
          </div>
        </section>
      )}

      {countryKings.length > 0 && (
        <section>
          <h2 className="text-3xl font-semibold mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
            Rulers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {countryKings.map((king) => (
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
          </div>
        </section>
      )}
    </main>
  );
}
