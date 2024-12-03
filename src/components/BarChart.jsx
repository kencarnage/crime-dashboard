import React from 'react';
import { calculateMaxValue } from '../utils/chartHelpers';

export function BarChart({ data, title, className = '' }) {
  const maxValue = calculateMaxValue(data);

  return (
    <div className={`bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-sm font-medium text-gray-300 mb-4">{title}</h3>
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">{item.label}</span>
              <span className="text-gray-200 font-medium">{item.value}</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}