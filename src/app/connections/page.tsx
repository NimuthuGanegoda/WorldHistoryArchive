import Breadcrumbs from '@/components/Breadcrumbs';
import Link from 'next/link';
import kingsData from '@/data/kings.json';

interface King {
  title: string;
  slug: string;
  kingdom: string;
  reign: string;
  internationalConnections?: string;
  [key: string]: any;
}

export default function ConnectionsPage() {
  const kingsWithConnections = kingsData.filter((king: any) => king.internationalConnections);

  return (
    <main className="max-w-7xl mx-auto py-6 px-5">
      <Breadcrumbs items={[
        { label: 'Home', href: '/' },
        { label: 'International Connections' }
      ]} />

      <div className="hero-section text-center mb-16">
        <h1 className="apple-headline mb-4">International Connections</h1>
        <p className="apple-subheadline text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Explore the diplomatic, religious, and political relationships between Sri Lankan monarchs and international empires
        </p>
      </div>

      {/* King Ashoka Feature Card */}
      <div className="mb-10">
        <div className="card p-6 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1">
              <Link href="/kings/ashoka" className="hover:text-[var(--accent)] transition-colors">
                Emperor Ashoka (Dharma Asoka)
              </Link>
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Mauryan Emperor of India (c. 268–232 BCE)</p>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              Ashoka was one of the greatest rulers of ancient India. After the Kalinga War, he embraced Buddhism and became a model of righteous rule. He sent his son Mahinda and daughter Sanghamitta to Sri Lanka, introducing Buddhism and the sacred Bodhi tree to the island, forging a lasting spiritual and cultural connection.
            </p>
            <Link href="/kings/ashoka" className="inline-block mt-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors">Read More & Watch Video</Link>
          </div>
          <div className="w-full md:w-96 aspect-video">
            <iframe
              width="100%"
              height="200"
              src="https://www.youtube.com/embed/videoseries?si=i6zUDGVvvdPOwrwu&amp;list=PLKw5aM9BkcbIHjc2udOyzsZ2DA8jLgb6i"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {kingsWithConnections.map((king: King, index: number) => (
          <div 
            key={king.slug}
            className="card p-6 scroll-animate"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  <Link href={`/kings/${king.slug}`} className="hover:text-[var(--accent)] transition-colors">
                    {king.title}
                  </Link>
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {king.reign} • {king.kingdom}
                </p>
              </div>
              <span className="text-4xl">🌏</span>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-gray-700 dark:text-gray-300">{king.internationalConnections}</p>
            </div>
          </div>
        ))}
      </div>

      {kingsWithConnections.length === 0 && (
        <div className="text-center text-gray-600 dark:text-gray-400 py-12">
          <p className="text-xl">International connections data is being compiled and will be added soon.</p>
        </div>
      )}
    </main>
  );
}
