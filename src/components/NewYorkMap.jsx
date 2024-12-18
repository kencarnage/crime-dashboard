import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import newYorkBoundary from '../assets/newyork-boundary.json'; // GeoJSON for New York's boundary

export function NewYorkMap({ className, mapPoints }) {
  const mapRef = useRef(null);
  const markerLayerRef = useRef(null);

  useEffect(() => {
    // Initialize Leaflet map
    const map = L.map(mapRef.current).setView([40.7128, -74.0060], 12); // Centered on New York

    // Add dark tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">Carto</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Add GeoJSON layer for boundary
    L.geoJSON(newYorkBoundary, {
      style: {
        color: '#FFFFFF', // White outline
        weight: 3,
        opacity: 1,
        fillOpacity: 0, // No fill
      },
    }).addTo(map);

    // Layer to hold markers
    markerLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapPoints || !markerLayerRef.current) return;

    // Clear existing markers
    markerLayerRef.current.clearLayers();

    // Add new crime points as red circle markers
    mapPoints.forEach((point) => {
      const { x, y } = point; // x = longitude, y = latitude
      L.circleMarker([y, x], {
        radius: 5,
        color: 'red',
        fillColor: 'red',
        fillOpacity: 0.7,
      }).addTo(markerLayerRef.current);
    });
  }, [mapPoints]);

  return <div ref={mapRef} className={`map-container ${className}`} />;
}
