import React from 'react';
import { Map } from './Map';

const manhattanPoints = [
  { x: 20, y: 25, intensity: 0.6 },
  { x: 40, y: 50, intensity: 0.4 },
  { x: 70, y: 80, intensity: 0.9 },
  // Add more points representing Manhattan here
];

export function ManhattanMap({ className }) {
  return <Map title="Interactive Map of Manhattan" points={manhattanPoints} className={className} />;
}
