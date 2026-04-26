'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

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
          ? 'glass'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="max-w-[1100px] mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-[62px]">
          <Link
            href="/"
            className="text-[20px] md:text-[23px] tracking-tight font-semibold text-[var(--foreground)] hover:opacity-80 transition-opacity flex-shrink-0"
          >
            <span className="hidden sm:inline">World History Archive</span>
            <span className="sm:hidden text-[var(--accent)]">🏛️ Archive</span>
          </Link>

          <div className="flex items-center space-x-3 md:space-x-5">
            <div className="flex items-center space-x-3 md:space-x-5 overflow-x-auto no-scrollbar py-2">
              <Link
                href="/kingdoms"
                className="text-[11px] md:text-[12px] uppercase tracking-[0.08em] font-semibold text-[var(--muted-foreground)] hover:text-[var(--accent)] transition-colors duration-200"
              >
                🏰 Kingdoms
              </Link>
              <Link
                href="/timeline"
                className="text-[11px] md:text-[12px] uppercase tracking-[0.08em] font-semibold text-[var(--muted-foreground)] hover:text-[var(--accent)] transition-colors duration-200"
              >
                ⌛ Timeline
              </Link>
              <Link
                href="/sites"
                className="text-[11px] md:text-[12px] uppercase tracking-[0.08em] font-semibold text-[var(--muted-foreground)] hover:text-[var(--accent)] transition-colors duration-200"
              >
                📍 Sites
              </Link>
              <Link
                href="/map"
                className="text-[11px] md:text-[12px] uppercase tracking-[0.08em] font-semibold text-[var(--muted-foreground)] hover:text-[var(--accent)] transition-colors duration-200"
              >
                🗺️ Maps
              </Link>
              <Link
                href="/political-connections"
                className="text-[11px] md:text-[12px] uppercase tracking-[0.08em] font-semibold text-[var(--muted-foreground)] hover:text-[var(--accent)] transition-colors duration-200"
              >
                🤝 Connections
              </Link>
              <Link
                href="/about"
                className="text-[11px] md:text-[12px] uppercase tracking-[0.08em] font-semibold text-[var(--muted-foreground)] hover:text-[var(--accent)] transition-colors duration-200"
              >
                ℹ️ About
              </Link>
            </div>
            <div className="flex-shrink-0 pl-2 border-l border-[var(--line)]/50 ml-1">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
