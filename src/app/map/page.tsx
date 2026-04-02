'use client';

import dynamic from 'next/dynamic';

const HistoricalSitesView = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <div className="h-[600px] w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl">Loading Map...</div>
});

export default function MapPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-[#2c1810] dark:text-[#d4c5a9] font-serif">Historical Sites Map</h1>
      <div className="h-[600px] w-full shadow-xl rounded-xl border-4 border-[#8b5a2b] dark:border-[#654321]">
        <HistoricalSitesView />
      </div>
      <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
        Showing locations of historical sites. Click &quot;Allow&quot; on location request to see your position.
      </p>
    </div>
  );
}
