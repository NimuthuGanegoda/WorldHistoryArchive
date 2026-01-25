'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import KingdomCard from '@/components/KingdomCard';
import kingsData from '@/data/kings.json';
import kingdomsData from '@/data/kingdoms.json';

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

export default function Home() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach((el) => {
      if (!el.classList.contains('animate-in')) {
        observerRef.current?.observe(el);
      }
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const kings = kingsData as King[];
  const kingdoms = kingdomsData as Kingdom[];

  // Get featured kings (first 6)
  const featuredKings = kings.slice(0, 6);

  // Map kingdoms to cards with descriptions and sort chronologically
  const kingdomCards = kingdoms
    .map((kingdom) => {
      const description =
        kingdom.sections?.[0]?.content?.[0] ||
        kingdom.biography ||
        'A historical kingdom of Sri Lanka.';

      return {
        slug: kingdom.slug,
        name: kingdom.title,
        description,
        reign: kingdom.reign,
      };
    })
    .sort((a, b) => {
      const getStartYear = (reign: string) => {
        const match = reign.match(/(\d+)/);
        if (!match) return 0;
        let year = parseInt(match[0], 10);
        if (reign.includes('BCE')) {
          year = -year;
        }
        return year;
      };
      return getStartYear(a.reign) - getStartYear(b.reign);
    });

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="max-w-[980px] mx-auto text-center px-5 py-32 fade-in flex flex-col items-center">
          <h1 className="apple-headline mb-6">
            World History Archive
          </h1>
          <p className="apple-subheadline mb-12 max-w-2xl mx-auto fade-in-delay-1">
            Explore the rich history and heritage of Sri Lankan kingdoms and rulers from ancient times to the colonial era. 
            Discover {kings.length} kings across {kingdoms.length} kingdoms.
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
            Featured Rulers
          </h2>
          <p className="text-center text-gray-500 mb-12 text-lg">
            Discover the legendary kings who shaped Sri Lankan history
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredKings.map((king, idx) => (
              <Link
                key={king.slug}
                href={`/kings/${king.slug}`}
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
              href="/kings/vijaya" 
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
            From legendary Tambapanni to the mighty Kandyan Kingdom
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
    </main>
  );
}
