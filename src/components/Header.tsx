'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import countries from '@/data/countries.json';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const params = useParams();
  const countrySlug = params?.country as string | undefined;

  const country = countrySlug ? countries.find(c => c.slug === countrySlug) : null;
  const title = country ? `${country.name} History` : 'World History Archive';
  const homeLink = countrySlug ? `/${countrySlug}` : '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-[980px] mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-[44px]">
          <Link
            href={homeLink}
            className="text-[21px] font-semibold text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {title}
          </Link>

          <div className="flex items-center space-x-6">
            {countrySlug && (
              <>
                <Link
                  href={`/${countrySlug}/kingdoms`}
                  className="text-[12px] font-normal text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                  Kingdoms
                </Link>
                <Link
                  href={`/${countrySlug}/timeline`}
                  className="text-[12px] font-normal text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                  Timeline
                </Link>
                <Link
                  href={`/${countrySlug}/sites`}
                  className="text-[12px] font-normal text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                  Sites
                </Link>
                <Link
                  href={`/${countrySlug}/map`}
                  className="text-[12px] font-normal text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                  Map
                </Link>
                <Link
                  href={`/${countrySlug}/political-connections`}
                  className="text-[12px] font-normal text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                  Connections
                </Link>
                <Link
                  href={`/${countrySlug}/historical-maps`}
                  className="text-[12px] font-normal text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                  Historical Maps
                </Link>
              </>
            )}
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}
