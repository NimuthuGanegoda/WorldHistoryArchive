import Link from 'next/link';
import KingdomCard from '@/components/KingdomCard';
import AnimationObserver from '@/components/AnimationObserver';
import FeaturedKings from '@/components/FeaturedKings';
import kingsData from '@/data/kings.json';
import kingdomsData from '@/data/kingdoms.json';
import { parseStartYear, getDailyKings } from '@/lib/utils';

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

// Hoist static data transformations to module scope
// This prevents expensive re-calculation on every render
const kings = kingsData as King[];
const kingdoms = kingdomsData as Kingdom[];

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
      country: kingdom.country,
      // Optimization: Calculate year once for sorting (Schwartzian transform)
      year: parseStartYear(kingdom.reign),
    };
  })
  .sort((a, b) => a.year - b.year);

export const metadata = {
  title: 'World History Archive',
  description: 'Explore the rich history and heritage of kingdoms and rulers from ancient times to the colonial era.',
};

export default function Home() {
  // Calculate daily kings at build time using the current date
  const today = new Date();
  const dailyKings = getDailyKings(kings, 6, today);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="max-w-[980px] mx-auto text-center px-5 py-32 fade-in flex flex-col items-center">
          <h1 className="apple-headline mb-6">
            World History Archive
          </h1>
          <p className="apple-subheadline mb-12 max-w-2xl mx-auto fade-in-delay-1">
            Explore the rich history and heritage of kingdoms and rulers from ancient times to the colonial era.
            Discover {kings.length} rulers across {kingdoms.length} kingdoms from around the world.
          </p>
          <div className="flex gap-4 justify-center flex-wrap fade-in-delay-1">
            <Link 
              href="/kings" 
              className="btn-primary"
            >
              Explore Kings
            </Link>
            <Link 
              href="/timeline" 
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
            Daily Featured Rulers
          </h2>
          <p className="text-center text-gray-500 mb-12 text-lg">
            Discover the legendary rulers who shaped history
          </p>
          <FeaturedKings initialKings={dailyKings} initialDate={today.toISOString()} />
          <div className="text-center mt-12">
            <Link 
              href="/kings"
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
            Explore powerful kingdoms and empires from across the ages
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kingdomCards.map((kingdom, idx) => (
              <div
                key={kingdom.slug}
                className="scroll-animate opacity-0 translate-y-8"
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <KingdomCard
                  slug={kingdom.slug}
                  name={kingdom.name}
                  description={kingdom.description}
                  country={kingdom.country}
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
