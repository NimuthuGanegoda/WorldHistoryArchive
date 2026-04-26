'use client';

import { useEffect, useState } from 'react';
import dynastiesData from '@/data/china-dynasties.json';

interface Dynasty {
  name: string;
  period: string;
  color: string;
  description: string;
}

export default function ChinaDynastiesView() {
  const [selectedDynasty, setSelectedDynasty] = useState<Dynasty | null>(dynastiesData[0]);

  useEffect(() => {
    if (dynastiesData.length > 0) {
      setSelectedDynasty(dynastiesData[0]);
    }
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 p-4 border-b border-gray-200 dark:border-gray-800">
        {dynastiesData.map((dynasty: Dynasty) => (
          <button
            key={dynasty.name}
            onClick={() => setSelectedDynasty(dynasty)}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
              selectedDynasty?.name === dynasty.name
                ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900'
                : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: selectedDynasty?.name === dynasty.name ? dynasty.color : `${dynasty.color}40`,
              color: selectedDynasty?.name === dynasty.name ? 'white' : 'inherit',
            }}
          >
            {dynasty.name}
          </button>
        ))}
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {selectedDynasty && (
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: selectedDynasty.color }}>
                {selectedDynasty.name}
              </h3>
              <p className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-3">
                {selectedDynasty.period}
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {selectedDynasty.description}
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              <h4 className="font-semibold mb-3">Dynasty Information</h4>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p>📍 Explore this dynasty&apos;s territories on the map above by selecting the corresponding period in the timeline.</p>
                <p>🔗 Related kingdoms and rulers from this era are linked throughout the archive.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
