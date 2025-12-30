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

  // Map kingdoms to cards with descriptions
  const kingdomCards = [
    {
      slug: 'tambapanni',
      name: 'Tambapanni',
      description: 'The legendary first kingdom founded by Prince Vijaya.'
    },
    {
      slug: 'upatissa-nuwara',
      name: 'Upatissa Nuwara',
      description: 'Early kingdom preceding Anuradhapura.'
    },
    {
      slug: 'anuradhapura',
      name: 'Anuradhapura',
      description: 'Ancient capital; cradle of early Sinhalese civilization.'
    },
    {
      slug: 'ruhuna',
      name: 'Ruhuna',
      description: 'Southern kingdom; base of resistance movements.'
    },
    {
      slug: 'sigiriya',
      name: 'Sigiriya',
      description: 'Fortress kingdom of Kashyapa I, known for its rock palace.'
    },
    {
      slug: 'polonnaruwa',
      name: 'Polonnaruwa',
      description: 'Medieval capital noted for irrigation and architecture.'
    },
    {
      slug: 'dambadeniya',
      name: 'Dambadeniya',
      description: 'Kingdom that arose after Polonnaruwa.'
    },
    {
      slug: 'yapahuwa',
      name: 'Yapahuwa',
      description: 'Brief capital known for its ornate palace.'
    },
    {
      slug: 'kurunegala',
      name: 'Kurunegala',
      description: 'Transitional kingdom in the medieval period.'
    },
    {
      slug: 'gampola',
      name: 'Gampola',
      description: 'Kingdom in the central hills.'
    },
    {
      slug: 'kotte',
      name: 'Kotte',
      description: 'Late medieval kingdom; rise of trade and literature.'
    },
    {
      slug: 'sitawaka',
      name: 'Sitawaka',
      description: 'Rival kingdom to Kotte, known for military prowess.'
    },
    {
      slug: 'kandyan',
      name: 'Kandyan',
      description: 'Last independent kingdom until 1815; rich cultural heritage.'
    },
    {
      slug: 'jaffna',
      name: 'Jaffna',
      description: 'Tamil kingdom in the northern peninsula.'
    }
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="max-w-[980px] mx-auto text-center px-5 py-32 fade-in">
          <h1 className="apple-headline mb-5">
            World History Archive
          </h1>
          <p className="apple-subheadline mb-10 max-w-2xl mx-auto fade-in-delay-1">
            Explore the rich history and heritage of Sri Lankan kingdoms and rulers from ancient times to the colonial era. 
            Discover {kings.length} kings across {kingdoms.length} kingdoms.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link 
              href="/kings" 
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Explore Kings
            </Link>
            <Link 
              href="/timeline" 
              className="inline-block px-6 py-3 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors"
            >
              View Timeline
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Kings Section */}
      <section className="py-20 bg-white dark:bg-[#0a0a0a]">
        <div className="max-w-[980px] mx-auto px-5">
          <h2 className="text-[32px] font-semibold mb-4 text-gray-900 dark:text-white text-center">
            Featured Rulers
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Discover the legendary kings who shaped Sri Lankan history
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredKings.map((king, idx) => (
              <Link
                key={king.slug}
                href={`/kings/${king.slug}`}
                className="scroll-animate opacity-0 translate-y-8 block p-6 bg-gray-50 dark:bg-[#1a1a1a] rounded-xl hover:shadow-lg transition-all hover:scale-105"
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {king.title}
                </h3>
                <p className="text-sm text-blue-600 dark:text-blue-400 mb-3">
                  {king.reign}
                </p>
                <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
                  {king.biography.substring(0, 150)}...
                </p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link 
              href="/kings/vijaya" 
              className="inline-block text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all {kings.length} rulers →
            </Link>
          </div>
        </div>
      </section>

      {/* Kingdoms Grid */}
      <section className="py-20 bg-gray-50/50 dark:bg-[#0a0a0a]">
        <div className="max-w-[980px] mx-auto px-5">
          <h2 className="text-[32px] font-semibold mb-4 text-gray-900 dark:text-white text-center">
            Historical Kingdoms
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
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
      <section className="py-20 bg-white dark:bg-[#1a1a1a]">
        <div className="max-w-[980px] mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="scroll-animate opacity-0 translate-y-8">
              <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {kings.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Historical Rulers
              </div>
            </div>
            <div className="scroll-animate opacity-0 translate-y-8" style={{ transitionDelay: '100ms' }}>
              <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {kingdoms.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Kingdoms
              </div>
            </div>
            <div className="scroll-animate opacity-0 translate-y-8" style={{ transitionDelay: '200ms' }}>
              <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                2000+
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Years of History
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
