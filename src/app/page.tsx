import Link from 'next/link';
import KingdomCard from '@/components/KingdomCard';
import AnimationObserver from '@/components/AnimationObserver';
import FeaturedKings from '@/components/FeaturedKings';
import WorldMapWrapper from '@/components/WorldMapWrapper';
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

// Extract unique countries
const uniqueCountries = Array.from(new Set(kingdomsData.map((k) => k.country).filter(Boolean))) as string[];

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
  description: 'Trace kingdoms, rulers, sites, and power shifts through a structured world history atlas.',
};

export default function Home() {
  // Calculate daily kings at build time using the current date
  const today = new Date();
  const dailyKings = getDailyKings(kings, 6, today);

  return (
    <main className="min-h-screen site-shell">
      {/* Hero Section */}
      <section className="hero-section">
        <span className="hero-orb w-[420px] h-[420px] -top-28 -left-32" />
        <span className="hero-orb w-[360px] h-[360px] -bottom-24 -right-24" style={{ animationDelay: '1.5s' }} />
        <div className="max-w-[1100px] mx-auto px-5 sm:px-6 py-24 md:py-32 fade-in">
          <span className="eyebrow mb-7">📜 Chronicle Lab</span>
          <h1 className="apple-headline mb-7 max-w-4xl">
            World History Archive
          </h1>
          <p className="apple-subheadline mb-10 max-w-3xl fade-in-delay-1">
            Follow the rise, rivalry, and legacy of historic states with a map-first archive built for students,
            researchers, and curious readers. Explore {kings.length} documented rulers across {kingdoms.length} kingdoms.
          </p>
          <div className="flex gap-4 flex-wrap fade-in-delay-1">
            <Link href="/kings" className="btn-primary">
              👑 Explore Kings
            </Link>
            <Link href="/timeline" className="btn-secondary">
              ⏳ View Timeline
            </Link>
            <Link href="/connections" className="btn-secondary">
              🤝 Study Connections
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-14 fade-in-delay-3">
            <div className="card !p-5">
              <p className="text-3xl font-semibold mb-1 text-[var(--accent)]">👑 {kings.length}</p>
              <p className="text-sm">Rulers and dynastic records</p>
            </div>
            <div className="card !p-5">
              <p className="text-3xl font-semibold mb-1 text-[var(--accent)]">🏰 {kingdoms.length}</p>
              <p className="text-sm">Kingdom profiles with context</p>
            </div>
            <div className="card !p-5">
              <p className="text-3xl font-semibold mb-1 text-[var(--accent)]">⌛ 2000+</p>
              <p className="text-sm">Years of connected timelines</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Kings Section */}
      <section className="section-shell section-shell--tinted">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-6">
          <span className="eyebrow mb-5">🎯 Today&apos;s Focus</span>
          <h2 className="section-title">
            Featured Kings
          </h2>
          <p className="section-lead mb-12">
            A rotating spotlight updates daily to surface influential rulers from different regions and eras.
          </p>
          <FeaturedKings initialKings={dailyKings} initialDate={today.toISOString()} />
          <div className="mt-12">
            <Link
              href="/kings"
              className="inline-flex items-center link-accent hover:underline font-semibold"
            >
              Browse all {kings.length} rulers <span className="ml-1">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* World Map Section */}
      <section className="section-shell">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-6">
          <span className="eyebrow mb-5">🌏 Spatial View</span>
          <h2 className="section-title">
            Explore by Country
          </h2>
          <p className="section-lead mb-12">
            Jump directly into regions, then drill into kingdoms, reigns, and connected sites from the same geography.
          </p>
          <div className="h-[420px] md:h-[540px] w-full rounded-3xl border border-[var(--line)]/80 overflow-hidden fade-in-delay-1 shadow-[0_30px_40px_-36px_rgba(28,13,5,0.85)]">
            <WorldMapWrapper countries={uniqueCountries} />
          </div>
          <div className="mt-12">
            <Link
              href="/countries"
              className="inline-flex items-center link-accent hover:underline font-semibold"
            >
              View all countries <span className="ml-1">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Kingdoms Grid */}
      <section className="section-shell section-shell--tinted">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-6">
          <span className="eyebrow mb-5">📖 Dynastic Atlas</span>
          <h2 className="section-title">
            Historical Kingdoms
          </h2>
          <p className="section-lead mb-12">
            Compare how power expanded, fractured, and transformed across major kingdoms and empires.
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
      <section className="section-shell">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-6">
          <span className="eyebrow mb-5">Archive Scope</span>
          <h2 className="section-title">Built For Ongoing Historical Research</h2>
          <p className="section-lead mb-12">
            This is a living archive: data can expand, timelines can be refined, and narratives can be linked with new evidence.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="scroll-animate opacity-0 translate-y-8">
              <div className="text-5xl font-bold text-[var(--accent)] mb-2">
                {kings.length}
              </div>
              <div className="text-[var(--muted-foreground)] font-medium">
                Historical Rulers
              </div>
            </div>
            <div className="scroll-animate opacity-0 translate-y-8" style={{ transitionDelay: '100ms' }}>
              <div className="text-5xl font-bold text-[var(--accent)] mb-2">
                {kingdoms.length}
              </div>
              <div className="text-[var(--muted-foreground)] font-medium">
                Kingdoms
              </div>
            </div>
            <div className="scroll-animate opacity-0 translate-y-8" style={{ transitionDelay: '200ms' }}>
              <div className="text-5xl font-bold text-[var(--accent)] mb-2">
                2000+
              </div>
              <div className="text-[var(--muted-foreground)] font-medium">
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
