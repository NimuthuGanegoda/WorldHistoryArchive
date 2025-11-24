import Link from 'next/link';

export const metadata = {
  title: 'King Ashoka (Dharma Asoka) | Sri Lanka History',
  description: 'Biography of Emperor Ashoka (Dharma Asoka), his impact on India and Sri Lanka, and related video resources.'
};

export default function KingAshokaPage() {
  return (
    <main className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">King Ashoka (Dharma Asoka)</h1>
      <p className="mb-6 text-gray-700 dark:text-gray-300">
        Emperor Ashoka, also known as Dharma Asoka, was one of the greatest rulers of the Mauryan Empire in India (reigned c. 268–232 BCE). After witnessing the devastation of the Kalinga War, Ashoka embraced Buddhism and became a model of righteous and compassionate rule. He is renowned for spreading Buddhism across Asia and for his policies of non-violence, tolerance, and welfare for all beings.
      </p>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Ashoka's Impact on Sri Lanka</h2>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
          <li>Sent his son, Arahat Mahinda, to Sri Lanka, leading to the official introduction of Buddhism during the reign of King Devanampiya Tissa.</li>
          <li>Sent his daughter, Sanghamitta, who brought a sapling of the sacred Bodhi Tree from Bodh Gaya, which was planted in Anuradhapura and is still venerated today.</li>
          <li>Established strong diplomatic and religious ties between the Mauryan Empire and the Anuradhapura Kingdom.</li>
          <li>Inspired the construction of monasteries and stupas, and the spread of Buddhist teachings throughout the island.</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Watch: Dharma Asoka Show</h2>
        <div className="w-full aspect-video mb-4" style={{minHeight: '315px'}}>
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
          Playlist courtesy of YouTube. For more about Ashoka&apos;s connection to Sri Lanka, see <Link href="/kings/devanampiya-tissa" className="underline">King Devanampiya Tissa</Link>.
        </p>
      </section>
    </main>
  );
}
