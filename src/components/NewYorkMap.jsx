import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat'; // Import Leaflet heatmap plugin
import newYorkBoundary from '../assets/newyork-boundary.json'; // GeoJSON for New York's boundary

export function NewYorkMap({ className, mapPoints }) {
  const mapRef = useRef(null);
  const heatLayerRef = useRef(null);

  useEffect(() => {
    // Initialize Leaflet map
    const map = L.map(mapRef.current, {
      attributionControl: false, // Removes attribution like "Leaflet | © Carto"
    }).setView([40.7128, -74.0060], 12); // Centered on New York

    // Add dark tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Add GeoJSON layer for New York boundary
    L.geoJSON(newYorkBoundary, {
      style: {
        color: '#FFFFFF', // White outline
        weight: 3,
        opacity: 1,
        fillOpacity: 0, // No fill
      },
    }).addTo(map);

    // Initialize heatmap layer with minimal blur and small radius
    const heatLayer = L.heatLayer([], {
      radius: 3, // Very small radius for sharp dots
      blur: 1,   // No blur for sharp points
      maxZoom: 17,
      gradient: { 1: 'red' }, // Solid blue for sharp dots
    }).addTo(map);

    heatLayerRef.current = heatLayer;

    return () => {
      map.remove(); // Cleanup map on component unmount
    };
  }, []);

  useEffect(() => {
    if (!mapPoints || !heatLayerRef.current) return;

    // Prepare heatmap data: [latitude, longitude, intensity]
    const heatmapData = mapPoints.map((point) => [point.y, point.x, point.intensity || 0.5]);

    // Update heatmap layer
    heatLayerRef.current.setLatLngs(heatmapData);
  }, [mapPoints]);

  return <div ref={mapRef} className={`map-container ${className}`} />;
}
