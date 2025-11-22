'use client';

import { useEffect, useRef } from 'react';
import KingdomCard from '@/components/KingdomCard';

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

  const kingdoms = [
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
            Kingdoms of Sri Lanka
          </h1>
          <p className="apple-subheadline mb-10 max-w-2xl mx-auto fade-in-delay-1">
            Explore the rich history and heritage of Sri Lankan kingdoms from ancient times to the colonial era.
          </p>
        </div>
      </section>

      {/* Kingdoms Grid */}
      <section className="py-20 bg-gray-50/50 dark:bg-[#0a0a0a]">
        <div className="max-w-[980px] mx-auto px-5">
          <h2 className="text-[32px] font-semibold mb-8 text-gray-900 dark:text-white text-center">
            Historical Kingdoms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kingdoms.map((kingdom, idx) => (
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
    </main>
  );
}
