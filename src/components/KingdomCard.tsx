import Link from 'next/link';

interface KingdomCardProps {
  readonly slug: string;
  readonly name: string;
  readonly description: string;
  readonly countrySlug: string;
}

export default function KingdomCard({ slug, name, description, countrySlug }: KingdomCardProps) {
  return (
    <Link href={`/${countrySlug}/kingdoms/${slug}`} className="block group">
      <div className="card text-center hover:scale-105">
        <div className="text-[56px] mb-4 transition-transform group-hover:scale-110 duration-300">
          🏛️
        </div>
        <h2 className="text-[21px] font-semibold mb-3 text-gray-900 dark:text-white tracking-tight">
          {name}
        </h2>
        <p className="text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  );
}
