'use client';

import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <div className="h-[600px] w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl">Loading Map...</div>
});

interface MapWrapperProps {
  sites: any[];
}

export default function MapWrapper({ sites }: MapWrapperProps) {
  return <Map sites={sites} />;
}
