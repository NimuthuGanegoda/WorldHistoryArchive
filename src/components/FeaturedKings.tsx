'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { getDailyKings } from '@/lib/utils';
import kingsData from '@/data/kings.json';
import kingdomsData from '@/data/kingdoms.json';

interface King {
  slug: string;
  title: string;
  reign: string;
  kingdom: string;
  country?: string;
  biography: string;
}

// Create a map for fast lookup of kingdom details (like country)
const kingdomsMap = new Map(kingdomsData.map((k) => [k.slug, k]));

interface FeaturedKingsProps {
  initialKings?: King[];
  initialDate?: string;
}

export default function FeaturedKings({ initialKings = [], initialDate }: FeaturedKingsProps) {
  const [kings, setKings] = useState<King[]>(initialKings);
  const [displayDate, setDisplayDate] = useState<string | null>(initialDate || null);
  // Use Sri Lanka timezone for consistency with server build and documentation
  const targetTimeZone = 'Asia/Colombo';
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Function to check and update daily kings
    const updateDailyKings = () => {
      const now = new Date();
      const allKings = kingsData as King[];

      // Calculate daily kings using Sri Lanka timezone
      // This ensures the content updates at Sri Lanka midnight globally
      const daily = getDailyKings(allKings, 6, now, targetTimeZone);

      setKings(currentKings => {
        // If we don't have kings yet, use daily
        if (currentKings.length === 0) return daily;

        // Check if the daily list is different from what we have
        const isDifferent = daily.length !== currentKings.length || daily.some((k, i) => k.slug !== currentKings[i].slug);

        // Only update state if different to avoid unnecessary re-renders
        return isDifferent ? daily : currentKings;
      });

      setDisplayDate(now.toISOString());
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

  // Format the date for display (Sri Lanka Timezone)
  const formattedDate = displayDate
    ? new Date(displayDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: targetTimeZone // Use Sri Lanka timezone
      })
    : '';

  return (
    <div className="space-y-8">
      {formattedDate && (
        <div className="text-center -mt-8 mb-4 text-[#0071e3] font-medium tracking-wide fade-in uppercase text-sm">
          {formattedDate}
        </div>
      )}
      <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kings.map((king, idx) => {
          const kingdom = kingdomsMap.get(king.kingdom);
          const country = king.country || (kingdom as any)?.country;

          return (
            <Link
              key={king.slug}
              href={`/kings/${king.slug}`}
              className="scroll-animate opacity-0 translate-y-8 block card hover:shadow-xl transition-all duration-500 ease-out relative"
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              {country && (
                <span className="absolute top-3 right-3 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-700">
                  {country}
                </span>
              )}
              <h3 className="text-xl font-semibold mb-2 pr-8">
                {king.title}
              </h3>
            <p className="text-sm text-[#0071e3] font-medium mb-3">
              {king.reign}
            </p>
              <p className="text-gray-500 text-[15px] leading-relaxed line-clamp-3 dark:text-gray-400">
                {king.biography ? king.biography.substring(0, 150) + '...' : ''}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
