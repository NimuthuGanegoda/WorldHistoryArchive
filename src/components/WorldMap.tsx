'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Link from 'next/link';
import { useEffect } from 'react';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const COUNTRY_COORDINATES: Record<string, [number, number]> = {
  'Sri Lanka': [7.8731, 80.7718],
  'Italy': [41.8719, 12.5674],
  'Egypt': [26.8206, 30.8025],
  'India': [20.5937, 78.9629],
  'China': [35.8617, 104.1954],
};

interface WorldMapProps {
  countries: string[];
}

export default function WorldMap({ countries }: WorldMapProps) {
  return (
    <MapContainer center={[20, 0]} zoom={2} scrollWheelZoom={false} className="h-full w-full rounded-xl z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {countries.map((country) => {
        const coords = COUNTRY_COORDINATES[country];
        if (!coords) return null;

        const slug = country.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        return (
          <Marker key={country} position={coords}>
            <Popup>
              <div className="text-center p-2">
                <h3 className="font-bold text-lg mb-2">{country}</h3>
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
