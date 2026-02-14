'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { getDailyKings } from '@/lib/utils';
import kingsData from '@/data/kings.json';

interface King {
  slug: string;
  title: string;
  reign: string;
  kingdom: string;
  biography: string;
}

interface FeaturedKingsProps {
  initialKings?: King[];
}

export default function FeaturedKings({ initialKings = [] }: FeaturedKingsProps) {
  const [kings, setKings] = useState<King[]>(initialKings);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Function to check and update daily kings
    const updateDailyKings = () => {
      const allKings = kingsData as King[];
      // Client-side calculation ensures that if the static build is stale (e.g., visited days later),
      // the displayed kings will update to match the current UTC date.
      const daily = getDailyKings(allKings, 6);

      setKings(currentKings => {
        // If we don't have kings yet, use daily
        if (currentKings.length === 0) return daily;

        // Check if the daily list is different from what we have
        const isDifferent = daily.length !== currentKings.length || daily.some((k, i) => k.slug !== currentKings[i].slug);

        // Only update state if different to avoid unnecessary re-renders
        return isDifferent ? daily : currentKings;
      });
    };

    // Calculate on mount
    updateDailyKings();

    // Check every minute for date changes (midnight transition)
    const interval = setInterval(updateDailyKings, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (kings.length === 0 || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = containerRef.current.querySelectorAll('.scroll-animate');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [kings]);

  // Loading state with skeleton or simple loader
  if (kings.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {kings.map((king, idx) => (
        <Link
          key={king.slug}
          href={`/kings/${king.slug}`}
          className="scroll-animate opacity-0 translate-y-8 block card hover:shadow-xl transition-all duration-500 ease-out"
          style={{ transitionDelay: `${idx * 100}ms` }}
        >
          <h3 className="text-xl font-semibold mb-2">
            {king.title}
          </h3>
          <p className="text-sm text-[#0071e3] font-medium mb-3">
            {king.reign}
          </p>
          <p className="text-gray-500 text-[15px] leading-relaxed line-clamp-3 dark:text-gray-400">
            {king.biography ? king.biography.substring(0, 150) + '...' : ''}
          </p>
        </Link>
      ))}
    </div>
  );
}
