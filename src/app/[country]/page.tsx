import Link from 'next/link';
import KingdomCard from '@/components/KingdomCard';
import AnimationObserver from '@/components/AnimationObserver';
import { getKings, getKingdoms, getCountry, getCountries } from '@/lib/data';
import { parseStartYear } from '@/lib/utils';
import { notFound } from 'next/navigation';

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
  biography: string;
  sections: {
    heading: string;
    content: string[];
    infoBoxes: any[];
  }[];
}

export async function generateStaticParams() {
  const countries = getCountries();
  return countries.map((country) => ({
    country: country.slug,
  }));
}

interface Props {
  params: Promise<{ country: string }>;
}

export default async function Home({ params }: Props) {
  const { country: countrySlug } = await params;
  const countryData = getCountry(countrySlug);

  if (!countryData) {
    notFound();
  }

  const kings = getKings(countrySlug) as King[];
  const kingdoms = getKingdoms(countrySlug) as Kingdom[];

  // Get featured kings (first 6)
  const featuredKings = kings.slice(0, 6);

  // Map kingdoms to cards with descriptions and sort chronologically
  const kingdomCards = kingdoms
    .map((kingdom) => {
      const description =
        kingdom.sections?.[0]?.content?.[0] ||
        kingdom.biography ||
        'A historical kingdom.';

      return {
        slug: kingdom.slug,
        name: kingdom.title,
        description,
        reign: kingdom.reign,
        year: parseStartYear(kingdom.reign),
      };
    })
    .sort((a, b) => a.year - b.year);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="max-w-[980px] mx-auto text-center px-5 py-32 fade-in flex flex-col items-center">
          <h1 className="apple-headline mb-6">
            {countryData.name} History
          </h1>
          <p className="apple-subheadline mb-12 max-w-2xl mx-auto fade-in-delay-1">
            {countryData.description}
          </p>
          <div className="flex gap-4 justify-center flex-wrap fade-in-delay-1">
            <Link
              href={`/${countrySlug}/kings`}
              className="btn-primary"
            >
              Explore Kings
            </Link>
            <Link
              href={`/${countrySlug}/timeline`}
              className="btn-secondary"
            >
              View Timeline
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Kings Section */}
      <section className="py-24 bg-gray-50 dark:bg-[#121212]">
        <div className="max-w-[980px] mx-auto px-5">
          <h2 className="text-[32px] md:text-[40px] font-semibold mb-4 text-center tracking-tight">
            Featured Rulers
          </h2>
          <p className="text-center text-gray-500 mb-12 text-lg">
            Discover the legendary kings who shaped history
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredKings.map((king, idx) => (
              <Link
                key={king.slug}
                href={`/${countrySlug}/kings/${king.slug}`}
                className="scroll-animate opacity-0 translate-y-8 block card hover:shadow-xl"
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <h3 className="text-xl font-semibold mb-2">
                  {king.title}
                </h3>
                <p className="text-sm text-[#0071e3] font-medium mb-3">
                  {king.reign}
                </p>
                <p className="text-gray-500 text-[15px] leading-relaxed line-clamp-3">
                  {king.biography.substring(0, 150)}...
                </p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href={`/${countrySlug}/kings`}
              className="inline-flex items-center text-[#0071e3] hover:underline font-medium"
            >
              View all {kings.length} rulers <span className="ml-1">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Kingdoms Grid */}
      <section className="py-24 bg-[var(--background)]">
        <div className="max-w-[980px] mx-auto px-5">
          <h2 className="text-[32px] md:text-[40px] font-semibold mb-4 text-center tracking-tight">
            Historical Kingdoms
          </h2>
          <p className="text-center text-gray-500 mb-12 text-lg">
            From legendary origins to mighty empires
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kingdomCards.map((kingdom, idx) => (
              <div
                key={kingdom.slug}
                className="scroll-animate opacity-0 translate-y-8"
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                {/* KingdomCard needs to know the country for the link, or we wrap it in Link */}
                {/* KingdomCard source says it contains a Link. Let's check KingdomCard again. */}
                <KingdomCard
                  slug={kingdom.slug}
                  name={kingdom.name}
                  description={kingdom.description}
                  countrySlug={countrySlug}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gray-50 dark:bg-[#121212]">
        <div className="max-w-[980px] mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="scroll-animate opacity-0 translate-y-8">
              <div className="text-5xl font-bold text-[#0071e3] mb-2">
                {kings.length}
              </div>
              <div className="text-gray-500 font-medium">
                Historical Rulers
              </div>
            </div>
            <div className="scroll-animate opacity-0 translate-y-8" style={{ transitionDelay: '100ms' }}>
              <div className="text-5xl font-bold text-[#0071e3] mb-2">
                {kingdoms.length}
              </div>
              <div className="text-gray-500 font-medium">
                Kingdoms
              </div>
            </div>
            <div className="scroll-animate opacity-0 translate-y-8" style={{ transitionDelay: '200ms' }}>
              <div className="text-5xl font-bold text-[#0071e3] mb-2">
                2000+
              </div>
              <div className="text-gray-500 font-medium">
                Years of History
              </div>
            </div>
          </div>
        </div>
      </section>

      <AnimationObserver />
    </main>
  );
}
