import React from 'react';
import { calculateMaxValue, generateHourLabels } from '../utils/chartHelpers';

export function AreaChart({ data, title, className = '' }) {
  const maxValue = calculateMaxValue(data);
  const points = data.map((item, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (item.value / maxValue) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className={`bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-sm font-medium text-gray-300 mb-4">{title}</h3>
      <div className="relative h-64">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(79, 70, 229)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="rgb(79, 70, 229)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={`M0,100 L0,${100 - (data[0].value / maxValue) * 100} ${points} L100,100 Z`}
            fill="url(#gradient)"
          />
          <polyline
            points={points}
            fill="none"
            stroke="rgb(79, 70, 229)"
            strokeWidth="0.5"
          />
        </svg>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400">
          {generateHourLabels().map((hour) => (
            <span key={hour}>{hour}:00</span>
          ))}
        </div>
      </div>
    </div>
  );
}