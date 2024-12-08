import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import newYorkBoundary from '../assets/newyork-boundary.json'; // GeoJSON for New York's outline

export function NewYorkMap({ className }) {
  const mapRef = useRef(null);

  useEffect(() => {
    // Initialize Leaflet map
    const map = L.map(mapRef.current).setView([40.7128, -74.0060], 12); // Centered on New York

    // Add dark-styled tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">Carto</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Add GeoJSON layer with white outline and no fill
    L.geoJSON(newYorkBoundary, {
      style: {
        color: '#FFFFFF', // White outline
        weight: 3,        // Line thickness
        opacity: 1,       // Fully opaque
        fillOpacity: 2,   // No fill
      },
    }).addTo(map);

    // Cleanup map on component unmount
    return () => {
      map.remove();
    };
  }, []);

  return <div ref={mapRef} className={`map-container ${className}`} />;
}
