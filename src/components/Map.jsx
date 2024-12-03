import React from 'react';

export function Map({ points = [], className = '' }) {
  return (
    <div className={`bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-sm font-medium text-gray-300 mb-4">Interactive map of Manhattan</h3>
      <div className="relative aspect-square bg-gray-900 rounded-lg overflow-hidden">
        <div className="absolute inset-0">
          {points.map((point, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 bg-emerald-500 rounded-full"
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                opacity: 0.2 + point.intensity * 0.8,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}