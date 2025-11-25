'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

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
          ? 'glass border-b border-gray-200/50 dark:border-white/10'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-[980px] mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-[44px]">
          <Link
            href="/"
            className="text-[21px] font-semibold text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            Sri Lanka History
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className="text-[12px] font-normal text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              Kingdoms
            </Link>
            <Link
              href="/timeline"
              className="text-[12px] font-normal text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              Timeline
            </Link>
            <Link
              href="/sites"
              className="text-[12px] font-normal text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              Sites
            </Link>
            <Link
              href="/political-connections"
              className="text-[12px] font-normal text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              Connections
            </Link>
            <Link
              href="/historical-maps"
              className="text-[12px] font-normal text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              Historical Maps
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
