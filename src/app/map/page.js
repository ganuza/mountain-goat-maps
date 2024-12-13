'use client'; // Required in Next.js for components that use client-side features

import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

// Set the Mapbox API access token from environment variables
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

export default function MapPage() {
  // Create a reference to the map container DOM element
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current, // Map container reference to the <div> where the map will be rendered
      style: 'mapbox://styles/mapbox/streets-v11', // Map style URL (streets view provided by Mapbox)
      center: [-104.9903, 39.7392], // Coordinates for Denver, CO
      zoom: 10, // Initial zoom level
    })

    // Add a default marker to the map
    new mapboxgl.Marker() // Create a new marker instance
      .setLngLat([-104.9903, 39.7392]) // Set marker's longitude and latitude
      .addTo(map); // Add the marker to the map

    // Cleanup function to remove the map instance when the component is unmounted
    return () => map.remove(); // Cleanup map instance on unmount
  }, []);

  return(
    <div className="h-screen">
      <div ref={mapContainerRef} className="h-full" />
    </div>
  )
}