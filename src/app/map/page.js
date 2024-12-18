'use client'; // Required in Next.js for components that use client-side features

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

// Set the Mapbox API access token from environment variables
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

export default function MapPage() {
  // Create a reference to the map container DOM element
  const mapContainerRef = useRef(null); // Reference for the map container
  const mapRef = useRef(null); // Reference to the map instance
  const userMarkerRef = useRef(null); // Reference for the user's location marker
  const userHeadingRef = useRef(null); // Reference for custom heading indicator
  const [markers, setMarkers] = useState([]); // State to keep track of all markers

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current, // Map container reference to the <div> where the map will be rendered
      style: 'mapbox://styles/mapbox/streets-v11', // Map style URL (streets view provided by Mapbox)
      center: [-104.9903, 39.7392], // Coordinates for Denver, CO
      zoom: 10, // Initial zoom level
    })

    mapRef.current = map; // Save the map instance

    // Add click event listener to the map
    map.on('click', (e) => {
      console.log('the whole event object:', e)
      console.log('event coordinates:', e.lngLat)
      const { lng, lat } = e.lngLat; // Extract clicked coordinates (longitude, latitude). This is destructuring e.lngLat:
      // const lng = e.lngLat.lng and const lat = e.lngLat.lat

      const customPinDropMarker = document.createElement('div');
      customPinDropMarker.className = 'custom-pin-drop-marker';
      customPinDropMarker.style.pointerEvents = 'auto';
      customPinDropMarker.style.cursor = 'pointer'; // ensures a clickable cursor
      customPinDropMarker.style.backgroundImage = 'url(/assets/pin_drop_32dp_5084C1_FILL1_wght600_GRAD0_opsz40.png)'
      customPinDropMarker.style.backgroundSize = 'cover';
      customPinDropMarker.style.width = '48px';
      customPinDropMarker.style.height = '48px';
      customPinDropMarker.style.borderRadius = '50%';

      // Create a new marker at the clicked location and make it removable
      const userMarker = new mapboxgl.Marker(customPinDropMarker)
        .setLngLat([lng, lat]) // Set marker's position using the constants you created above in the destructuring
        .addTo(map); // Add the marker to the map

      console.log(`Marker added at Longitude: ${lng}, Latitude: ${lat}`)

      // Add click event to remove the marker
      customPinDropMarker.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevents the marker's click event from interfering with the map click event
        userMarker.remove(); // Remove the marker from the map
        setMarkers((prev) => prev.filter((m) => m !== userMarker))
      })

      // Update the markers state using the callback form of setState
      setMarkers((prev) => {
        const updatedMarkers = [...prev, userMarker];
        console.log('Updated Markers Array: ', updatedMarkers);
        return updatedMarkers
      })
    })

    // This commented out code was the initial Home Marker based on the Denver coordinates before using the geolocateControl for the lng, lat
    // // Custom Home Marker
    // const customHomeMarker = document.createElement('div');
    // customHomeMarker.className = 'custom-home-marker'
    // customHomeMarker.style.backgroundImage = 'url(/assets/home_pin_32dp_A96424_FILL1_wght600_GRAD0_opsz40.png)'
    // customHomeMarker.style.backgroundSize = 'cover'
    // customHomeMarker.style.width = '48px'
    // customHomeMarker.style.height = '48px'
    // customHomeMarker.style.borderRadius = '50%'

    // // Add a default marker to the map
    // new mapboxgl.Marker(customHomeMarker) // Create a new marker instance
    //   .setLngLat([-104.9903, 39.7392]) // Set marker's longitude and latitude
    //   .addTo(map); // Add the marker to the map

    // Add a GeolocateControl to the map
    const geolocateControl = new mapboxgl.GeolocateControl ({
      positionOptions: {
        enableHighAccuracy: true, // Request high-accuracy geolocation
      },
      trackUserLocation: true, // Continuously track the user's location
      showUserHeading: true, // Show the user's direction
      showUserLocation: false, // Hide the default blue user location marker
    });

    map.addControl(geolocateControl, 'top-right'); // Add the contol to the map

    // Automatically trigger the location tracking
    geolocateControl.on('geolocate', (e) => {
      const { longitude, latitude, heading } = e.coords;
      console.log(`User located at longitude: ${longitude}, Latitude: ${latitude}`);

      // If the marker already exists, update its position
      if (userMarkerRef.current) {
        userMarkerRef.current.setLngLat([longitude, latitude]);
      } else {
        // Create a custom marker for the first time
        const customHomeMarker = document.createElement('div');
        customHomeMarker.className = 'custom-home-marker'
        customHomeMarker.style.backgroundImage = 'url(/assets/home_pin_32dp_A96424_FILL1_wght600_GRAD0_opsz40.png)'
        customHomeMarker.style.backgroundSize = 'cover'
        customHomeMarker.style.width = '24px'
        customHomeMarker.style.height = '24px'
        customHomeMarker.style.borderRadius = '50%'

        userMarkerRef.current = new mapboxgl.Marker(customHomeMarker)
          .setLngLat([longitude, latitude])
          .addTo(map)
      }

      // Add or update the heading indicator (direction arrow)
      if (!userHeadingRef.current) {
        const headingArrow = document.createElement('div');
        headingArrow.className = 'user-heading-arrow';
        headingArrow.style.width = '40px';
        headingArrow.style.height = '40px';
        headingArrow.style.backgroundImage = 'url(/icons8-north-direction-40.png)';
        headingArrow.style.backgroundSize = 'cover';
        headingArrow.style.transformOrigin = 'center';

        userHeadingRef.current = new mapboxgl.Marker(headingArrow)
          .setLngLat([longitude, latitude])
          .addTo(map);
      }

      // Update heading arrow rotation if heading exists
      if (userHeadingRef.current && heading !== null) {
        userHeadingRef.current.setLngLat([longitude, latitude]);
        userHeadingRef.current.getElement().style.transform = `rotate(${heading}deg)`;
      }
    });

    // Cleanup function to remove the map instance when the component is unmounted
    return () => map.remove(); // Cleanup map instance on unmount
  }, []);

  // Function to remove all markers
  const clearAllMarkers = () => {
    markers.forEach((marker) => marker.remove())
    setMarkers([]); // Reset the markers state
  }

  return(
    <div className="h-screen relative ">
      <div ref={mapContainerRef} className="h-full" />
      {/* Reset Markers Button */}
      <button
        onClick={clearAllMarkers}
        className='absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600'
      >
        Reset Markers
      </button>
    </div>
  )
}