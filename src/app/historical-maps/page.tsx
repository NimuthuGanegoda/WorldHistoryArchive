export const metadata = {
  title: 'Historical Maps | World History Archive',
  description: 'Explore historical regions and ancient kingdom boundaries of Sri Lanka.'
};

const oldMapsUrl = 'https://www.oldmapsonline.org/en/history/regions#position=6.2609/7.592/81.406&amp;year=483';

export default function HistoricalMapsPage() {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-2">📜 Historical Maps</h1>
      <p className="mb-8 text-gray-700 dark:text-gray-300">
        Explore the evolution of Sri Lankan kingdoms and regional boundaries using interactive timeline views. Powered by <a href="https://www.oldmapsonline.org/" target="_blank" rel="noopener noreferrer" className="underline text-[#0071e3] hover:text-[#0077ed]">Old Maps Online</a>.
      </p>
      
      <div className="space-y-12">
        {/* Sri Lanka Maps */}
        <section>
          <div className="card !p-0 overflow-hidden border-2 border-[var(--line)]">
            <div className="p-6 bg-[var(--surface)]">
              <h2 className="text-2xl font-semibold mb-1">Sri Lanka Historical Regions</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                View ancient kingdoms and regional boundaries across different historical periods.
              </p>
            </div>
            <div className="w-full aspect-video" style={{ minHeight: '600px' }}>
              <iframe
                src={oldMapsUrl}
                width="100%"
                height="100%"
                style={{ border: 'none', width: '100%', height: '100%' }}
                allowFullScreen
                loading="lazy"
                title="Old Maps Online - Sri Lanka Historical Regions"
              />
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-[var(--line)]">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                💡 Tip: Use the timeline slider at the bottom of the map to explore different historical periods (e.g., 200 BCE, 500 CE, 1500 CE).
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <h3 className="font-semibold mb-3">About These Maps</h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>🗺️ <strong>Real-time history:</strong> Drag the timeline to see how borders changed over centuries</li>
          <li>🔍 <strong>Zoom & explore:</strong> Click and drag to navigate, scroll to zoom in on regions</li>
          <li>🌍 <strong>Global context:</strong> See how different kingdoms and dynasties coexisted</li>
          <li>ℹ️ <strong>Data source:</strong> Historical maps curated by the Old Maps Online project</li>
        </ul>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
        If the maps do not load, please ensure your browser supports WebGL and try refreshing the page or using a different browser.
      </p>
    </div>
  );
}
