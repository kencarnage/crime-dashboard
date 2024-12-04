import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import delhiBoundary from '../assets/delhi-boundary.json'; // GeoJSON for Delhi's outline

const delhiPoints = [
  { x: 10, y: 15, intensity: 0.8 },
  { x: 50, y: 30, intensity: 0.5 },
  { x: 80, y: 70, intensity: 0.7 },
  // Add more points representing Delhi here
];

export function DelhiMap({ className }) {
  const mapRef = useRef(null);

  useEffect(() => {
    // Initialize Leaflet map
    const map = L.map(mapRef.current).setView([28.6139, 77.209], 12); // Centered on Delhi

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Add GeoJSON layer for Delhi boundary
    L.geoJSON(delhiBoundary, {
      style: {
        color: '#FF5733', // Outline color
        weight: 2,
      },
    }).addTo(map);

    // Add interactive points
    delhiPoints.forEach(({ x, y, intensity }) => {
      const longitude = 77.209 + (x - 50) / 10; // Convert x to longitude
      const latitude = 28.6139 + (y - 50) / 10; // Convert y to latitude
      L.circleMarker([latitude, longitude], {
        radius: intensity * 10, // Scale radius based on intensity
        color: '#2ECC71',
        fillColor: '#2ECC71',
        fillOpacity: 0.7,
      }).addTo(map);
    });

    // Cleanup map on component unmount
    return () => {
      map.remove();
    };
  }, []);

  return <div ref={mapRef} className={`map-container ${className}`} />;
}
