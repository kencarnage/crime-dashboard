import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';  // Import fullscreen CSS
import 'leaflet-fullscreen';  // Import the fullscreen plugin
import newYorkBoundary from '../assets/newyork-boundary.json';
import './NewYorkMap.css';

export function NewYorkMap({ className, mapPoints }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const heatLayerRef = useRef(null);
  const redPointLayerRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(14);

  useEffect(() => {
    const map = L.map(mapRef.current, {
      attributionControl: false,
    }).setView([40.7128, -74.0060], 14);

    mapInstanceRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Add New York boundary
    L.geoJSON(newYorkBoundary, {
      style: {
        color: '#FFFFFF',
        weight: 3,
        opacity: 1,
        fillOpacity: 0,
      },
    }).addTo(map);

    // Add New York label
    const nyLabel = L.control({ position: 'topright' });
    nyLabel.onAdd = function () {
      const div = L.DomUtil.create('div', 'custom-map-label');
      div.innerHTML = '<span>New York Map</span>';
      return div;
    };
    nyLabel.addTo(map);

    // Add fullscreen control
    L.control.fullscreen({
      position: 'topright', // You can place it wherever you like
      title: 'Toggle Fullscreen',
      titleCancel: 'Exit Fullscreen',
      content: '🗖', // You can replace this with any icon you prefer
    }).addTo(map);

    // Listen for the fullscreen change event to handle resize
    map.on('fullscreenchange', () => {
      map.invalidateSize();  // Force map resize after fullscreen toggle
    });

    // Zoom level change listener
    map.on('zoomend', () => {
      setZoomLevel(map.getZoom());
      map.invalidateSize();  // Force map resize after zoom
    });

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapPoints || !mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    const updateHeatmap = () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
      }

      const bounds = map.getBounds();
      const visiblePoints = mapPoints.filter((point) =>
        bounds.contains([point.y, point.x])
      );

      const heatData = visiblePoints.map((point) => [point.y, point.x, 0.2]);

      const heatLayer = L.heatLayer(heatData, {
        radius: 8,
        blur: 20,
        maxZoom: 17,
        minOpacity: 0.2,
        gradient: {
          0.0: 'rgba(255, 0, 0, 0.1)', 
          0.5: 'rgba(255, 0, 0, 0.5)', 
          1.0: 'rgba(255, 0, 0, 1.0)', 
        },
      });

      heatLayer.addTo(map);
      heatLayerRef.current = heatLayer;
    };

    const updateRedPoints = () => {
      if (redPointLayerRef.current) {
        map.removeLayer(redPointLayerRef.current);
      }

      const bounds = map.getBounds();
      const visiblePoints = mapPoints.filter((point) =>
        bounds.contains([point.y, point.x])
      );

      const canvasLayer = L.canvas({ padding: 0.5 });
      map.addLayer(canvasLayer);

      const pointChunks = chunkArray(visiblePoints, 25000);
      const renderChunk = (chunkIndex = 0) => {
        if (chunkIndex >= pointChunks.length) return;

        pointChunks[chunkIndex].forEach((point) => {
          L.circleMarker([point.y, point.x], {
            radius: 0.005,
            color: 'red',
            fillColor: 'red',
            fillOpacity: 1,
            renderer: canvasLayer,
          }).addTo(map);
        });

        setTimeout(() => renderChunk(chunkIndex + 1), 50);
      };

      renderChunk();
      redPointLayerRef.current = canvasLayer;
    };

    const updateLayers = () => {
      if (zoomLevel < 16) {
        updateHeatmap();
      } else {
        updateRedPoints();
      }
    };

    const debouncedUpdate = debounce(updateLayers, 100);

    map.on('moveend', debouncedUpdate);
    map.on('zoomend', debouncedUpdate);

    updateLayers();

    return () => {
      if (heatLayerRef.current) heatLayerRef.current.remove();
      if (redPointLayerRef.current) redPointLayerRef.current.remove();

      map.off('moveend', debouncedUpdate);
      map.off('zoomend', debouncedUpdate);
    };
  }, [mapPoints, zoomLevel]);

  return <div ref={mapRef} className={`map-container ${className}`} />;
}

// Debounce utility
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}
