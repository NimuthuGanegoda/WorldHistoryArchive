import Link from 'next/link';

interface KingdomCardProps {
  readonly slug: string;
  readonly name: string;
  readonly description: string;
  readonly country?: string;
}

export default function KingdomCard({ slug, name, description, country }: KingdomCardProps) {
  return (
    <Link href={`/kingdoms/${slug}`} className="block group">
      <div className="card text-center hover:scale-105 relative">
        {country && (
          <span className="absolute top-3 right-3 text-xs font-medium bg-[var(--surface)] text-[var(--muted-foreground)] px-2.5 py-1 rounded-full border border-[var(--line)]">
            {country}
          </span>
        )}
        <div className="text-[56px] mb-4 transition-transform group-hover:scale-110 duration-300">
          🏛️
        </div>
        <h2 className="text-[21px] font-semibold mb-3 text-[var(--foreground)] tracking-tight">
          {name}
        </h2>
        <p className="text-[15px] text-[var(--muted-foreground)] leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  );
}
