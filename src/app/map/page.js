'use client';

import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

export default function MapPage() {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current, // Map container reference
      style: 'mapbox://styles/mapbox/streets-v11', // Map style URL
      center: [-104.9903, 39.7392], // Coordinates for Denver, CO
      zoom: 10, // Initial zoom level
    })

    return () => map.remove(); // Cleanup map instance on unmount
  }, []);

  return(
    <div className="h-screen">
      <div ref={mapContainerRef} className="h-full" />
    </div>
  )
}