'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Link from 'next/link';
import { useEffect } from 'react';
import countriesData from '@/data/countries.json';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Build country coordinates and descriptions from centralized data
const COUNTRY_DATA = countriesData.reduce((acc, country) => {
  acc[country.name] = {
    coords: country.center as [number, number],
    description: country.description,
  };
  return acc;
}, {} as Record<string, { coords: [number, number]; description: string }>);

interface WorldMapProps {
  countries: string[];
}

export default function WorldMap({ countries }: WorldMapProps) {
  return (
    <MapContainer center={[20, 0]} zoom={2} scrollWheelZoom={false} className="h-full w-full rounded-xl z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      {countries.map((country) => {
        const countryInfo = COUNTRY_DATA[country];
        if (!countryInfo) return null;

        const slug = country.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        return (
          <Marker key={country} position={countryInfo.coords}>
            <Popup>
              <div className="text-center p-2">
                <h3 className="font-bold text-lg mb-2">{country}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{countryInfo.description}</p>
                <Link href={`/countries/${slug}`} className="text-[#0071e3] hover:underline text-sm font-medium inline-block">
                  Explore {country} →
                </Link>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
