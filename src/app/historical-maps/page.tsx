import Link from 'next/link';

export const metadata = {
  title: 'Historical Maps | Sri Lanka History',
  description: 'Explore historical regions and ancient kingdom boundaries of Sri Lanka using Old Maps Online.'
};

export default function HistoricalMapsPage() {
  return (
    <main className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">Historical Maps</h1>
      <p className="mb-6 text-gray-700 dark:text-gray-300">
        Explore historical regions and ancient kingdom boundaries of Sri Lanka using the interactive map below (powered by <a href="https://www.oldmapsonline.org/" target="_blank" rel="noopener noreferrer" className="underline">Old Maps Online</a>):
      </p>
      <p className="mb-4 text-yellow-800 dark:text-yellow-300 font-medium">
        Tip: Use the timeline slider below the map to explore different historical periods.
      </p>
      <div className="w-full aspect-video mb-8" style={{minHeight: '500px'}}>
        <iframe
          src="https://www.oldmapsonline.org/en/history/regions#position=6.2609/7.592/81.406&year=483"
          width="100%"
          height="600"
          style={{ border: '1px solid #ccc', width: '100%', height: '100%' }}
          allowFullScreen
          loading="lazy"
          title="Old Maps Online - Sri Lanka Historical Regions"
        ></iframe>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        If the map does not load, please ensure your browser supports WebGL and try refreshing the page or using a different browser.
      </p>
    </main>
  );
}
