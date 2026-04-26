export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--line)]/80 bg-[var(--surface)]/80 backdrop-blur-md">
      <div className="max-w-[1100px] mx-auto px-5 sm:px-6 py-12">
        <div className="text-center space-y-2">
          <p className="text-[13px] uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
            © {currentYear} World History Archive
          </p>
          <p className="text-[12px] text-[var(--muted-foreground)]">
            A living historical atlas. Data is continuously refined from chronicles, inscriptions, and research references.
          </p>
        </div>
      </div>
    </footer>
  );
}
