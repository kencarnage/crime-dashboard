import React from 'react';

export function FilterButton({ active, onClick, children, variant = 'default' }) {
  const baseStyles = "px-3 py-1 rounded-md text-sm font-medium transition-colors";
  const variants = {
    default: active 
      ? "bg-indigo-600 text-white" 
      : "bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30",
    reset: "bg-red-500/20 text-red-200 hover:bg-red-500/30"
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}