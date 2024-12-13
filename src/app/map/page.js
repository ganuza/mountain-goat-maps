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

    // Add click event listener to the map
    map.on('click', (e) => {
      console.log('the whole event object:', e)
      console.log('event coordinates:', e.lngLat)
      const { lng, lat } = e.lngLat; // Extract clicked coordinates (longitude, latitude). This is destructuring e.lngLat:
      // const lng = e.lngLat.lng and const lat = e.lngLat.lat

      const customPinDropMarker = document.createElement('div');
      customPinDropMarker.className = 'custom-pin-drop-marker';
      customPinDropMarker.style.backgroundImage = 'url(/assets/pin_drop_32dp_5084C1_FILL1_wght600_GRAD0_opsz40.png)'
      customPinDropMarker.style.backgroundSize = 'cover';
      customPinDropMarker.style.width = '48px';
      customPinDropMarker.style.height = '48px';
      customPinDropMarker.style.borderRadius = '50%';

      // Create a new marker at the clicked location
      new mapboxgl.Marker(customPinDropMarker)
        .setLngLat([lng, lat]) // Set marker's position using the constants you created above in the destructuring
        .addTo(map); // Add the marker to the map

      console.log(`Marker added at Longitude: ${lng}, Latitude: ${lat}`)
    })

    // Custom Home Marker
    const customHomeMarker = document.createElement('div');
    customHomeMarker.className = 'custom-home-marker'
    customHomeMarker.style.backgroundImage = 'url(/assets/home_pin_32dp_A96424_FILL1_wght600_GRAD0_opsz40.png)'
    customHomeMarker.style.backgroundSize = 'cover'
    customHomeMarker.style.width = '48px'
    customHomeMarker.style.height = '48px'
    customHomeMarker.style.borderRadius = '50%'

    // Add a default marker to the map
    new mapboxgl.Marker(customHomeMarker) // Create a new marker instance
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