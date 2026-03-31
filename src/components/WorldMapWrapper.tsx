'use client';

import dynamic from 'next/dynamic';

const WorldMap = dynamic(() => import('@/components/WorldMap'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl">Loading Map...</div>
});

interface WorldMapWrapperProps {
  countries: string[];
}

export default function WorldMapWrapper({ countries }: WorldMapWrapperProps) {
  return <WorldMap countries={countries} />;
}
