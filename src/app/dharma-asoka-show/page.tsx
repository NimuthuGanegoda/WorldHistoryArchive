import Link from 'next/link';

export const metadata = {
  title: 'Dharma Asoka Show | Sri Lanka History',
  description: 'Watch the YouTube playlist about Emperor Ashoka (Dharma Asoka) and his legacy.'
};

export default function DharmaAsokaShowPage() {
  return (
    <main className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">Dharma Asoka Show</h1>
      <p className="mb-6 text-gray-700 dark:text-gray-300">
        Watch this YouTube playlist about Emperor Ashoka (Dharma Asoka) and his impact on history:
      </p>
      <div className="w-full aspect-video mb-8" style={{minHeight: '315px'}}>
        <iframe
          width="100%"
          height="315"
          src="https://www.youtube.com/embed/videoseries?si=i6zUDGVvvdPOwrwu&amp;list=PLKw5aM9BkcbIHjc2udOyzsZ2DA8jLgb6i"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Playlist courtesy of YouTube. For more information about Ashoka, see the <Link href="/kings/ashoka" className="underline">Ashoka biography</Link>.
      </p>
    </main>
  );
}
