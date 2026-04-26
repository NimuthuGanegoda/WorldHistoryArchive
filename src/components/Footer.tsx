import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--line)]/80 bg-[var(--surface)]/80 backdrop-blur-md">
      <div className="max-w-[1100px] mx-auto px-5 sm:px-6 py-12">
        <div className="text-center space-y-3">
          <p className="text-[13px] uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
            © {currentYear} World History Archive
          </p>
          <div className="flex justify-center space-x-6 text-[12px] text-[var(--muted-foreground)]">
            <Link href="/about" className="hover:text-[var(--accent)] transition-colors">About</Link>
            <Link href="https://github.com/NimuthuGanegoda/Sanctuary-of-Eternity" target="_blank" className="hover:text-[var(--accent)] transition-colors">Sovereign Core</Link>
          </div>
          <p className="text-[12px] text-[var(--muted-foreground)] max-w-lg mx-auto">
            A living historical atlas curated by <strong>Nimuthu Ganegoda</strong>. Data is refined from chronicles, inscriptions, and research references.
          </p>
        </div>
      </div>
    </footer>
  );
}
