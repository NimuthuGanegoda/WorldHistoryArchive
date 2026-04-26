import Breadcrumbs from '@/components/Breadcrumbs';
import Link from 'next/link';

export const metadata = {
  title: 'About | World History Archive',
  description: 'Learn about the mission, architecture, and contributors of the World History Archive.',
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-5">
      <Breadcrumbs items={[
        { label: 'Home', href: '/' },
        { label: 'About' }
      ]} />

      <div className="max-w-4xl mx-auto mt-8">
        <h1 className="text-5xl font-bold mb-8 text-[var(--foreground)]">About the Archive</h1>
        
        <section className="prose dark:prose-invert max-w-none space-y-8">
          <div className="bg-[var(--surface)] p-8 rounded-3xl border border-[var(--line)]/50 shadow-sm">
            <h2 className="text-3xl font-bold mb-4">🌟 Our Mission</h2>
            <p className="text-lg text-[var(--muted-foreground)] leading-relaxed">
              Historical information is often fragmented across books, chronicles, and disconnected websites. 
              The <strong>World History Archive</strong> was founded to bring these threads together into 
              structured, searchable records that are easier to compare across places and periods. 
              We aim to provide a comprehensive, map-driven atlas of human civilization, starting with 
              the rich history of Sri Lanka.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="card p-8">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span>🛡️</span> Sovereign Architecture
              </h3>
              <p className="text-[var(--muted-foreground)]">
                The platform is built on a &quot;Hardened Static Architecture.&quot; Data is stored in decoupled 
                JSON layers, ensuring deterministic builds, ultra-fast delivery, and long-term 
                preservation of historical records.
              </p>
            </div>
            <div className="card p-8">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span>🌍</span> Spatial Intelligence
              </h3>
              <p className="text-[var(--muted-foreground)]">
                By integrating geographic visualizations with chronological data, we enable 
                researchers to visualize the rise and fall of empires not just through time, 
                but through the actual territories they controlled.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8 text-center">🏗️ Ecosystem & Credits</h2>
            <p className="text-center text-[var(--muted-foreground)] mb-12">
              The World History Archive is part of a broader architectural vision and is supported by 
              several sister projects within the sanctuary.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="https://github.com/NimuthuGanegoda/Sanctuary-of-Eternity" target="_blank" className="card p-6 text-center hover:border-[var(--accent)] transition-all">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                  🛡️
                </div>
                <h4 className="font-bold mb-1">Sovereign Core</h4>
                <p className="text-xs text-[var(--muted-foreground)]">Security & Policy Foundation</p>
              </Link>

              <Link href="https://github.com/NimuthuGanegoda" target="_blank" className="card p-6 text-center hover:border-[var(--accent)] transition-all">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                  👤
                </div>
                <h4 className="font-bold mb-1">Architect</h4>
                <p className="text-xs text-[var(--muted-foreground)]">Lead Maintenance & Vision</p>
              </Link>

              <Link href="https://github.com/uthsarad/NeOS" target="_blank" className="card p-6 text-center hover:border-[var(--accent)] transition-all">
                <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                  💎
                </div>
                <h4 className="font-bold mb-1">NeOS</h4>
                <p className="text-xs text-[var(--muted-foreground)]">Performance Optimization</p>
              </Link>

              <Link href="https://leafletjs.com/" target="_blank" className="card p-6 text-center hover:border-[var(--accent)] transition-all">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                  🗺️
                </div>
                <h4 className="font-bold mb-1">Leaflet</h4>
                <p className="text-xs text-[var(--muted-foreground)]">Spatial Data Engine</p>
              </Link>
            </div>
          </div>

          <div className="mt-20 pt-12 border-t border-[var(--line)] text-center">
            <p className="text-[var(--muted-foreground)]">
              © 2026 World History Archive. Built with passion for preservation.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
