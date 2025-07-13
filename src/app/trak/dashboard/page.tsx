'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import DashboardLayout from './layout';

// Dynamically import map to avoid SSR issues
const Map = dynamic(() => import('../../components/Map'), {
  ssr: !true,
  loading: () => <p>Loading map...</p>,
});

type Location = {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
};

export default function DashboardPage() {
  // Get locations from Redux and API
  const [locations, setLocations] = useState<Location[]>([]);

  React.useEffect(() => {
    async function fetchLocations() {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.user && data.user.locations) {
        setLocations(
          data.user.locations.map(
            (loc: {
              id: string;
              tokenId: string;
              latitude: number;
              longitude: number;
            }) => ({
              id: loc.id,
              label: loc.tokenId,
              latitude: loc.latitude,
              longitude: loc.longitude,
            })
          )
        );
      }
    }
    fetchLocations();
  }, []);

  return (
    <DashboardLayout>
      <section className="card space-y-6">
        <h1 className="text-4xl font-extrabold">Dashboard Map</h1>
        <p className="text-gray-600">
          Here&apos;s a map with some interesting location points overlaid.
        </p>
        <Map
          locations={locations}
          height="500px"
          center={
            locations[0]
              ? [locations[0].latitude, locations[0].longitude]
              : [30.57881, -97.85307]
          }
        />
      </section>
    </DashboardLayout>
  );
}
