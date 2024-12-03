import React from 'react';

export function StatCard({ title, value, className = '' }) {
  return (
    <div className={`bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-sm font-medium text-gray-300">{title}</h3>
      <p className="text-3xl font-bold text-white mt-2">{value}</p>
    </div>
  );
}