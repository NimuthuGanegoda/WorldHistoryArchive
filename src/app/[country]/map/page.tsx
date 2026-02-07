import MapWrapper from '@/components/MapWrapper';
import { getSites, getCountries } from '@/lib/data';

export async function generateStaticParams() {
  const countries = getCountries();
  return countries.map(c => ({ country: c.slug }));
}

export default async function MapPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  const sites = getSites(country);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-[#2c1810] dark:text-[#d4c5a9] font-serif">Historical Sites Map</h1>
      <div className="h-[600px] w-full shadow-xl rounded-xl border-4 border-[#8b5a2b] dark:border-[#654321]">
        <MapWrapper sites={sites} />
      </div>
      <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
        Showing locations of historical sites. Click &quot;Allow&quot; on location request to see your position.
      </p>
    </div>
  );
}
