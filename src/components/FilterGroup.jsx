import React from 'react';
import { FilterButton } from './FilterButton';

export function FilterGroup({ title, filters, activeFilter, onFilterChange, onReset }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">{title}:</span>
        <div className="flex gap-2">
          {filters.map((filter) => (
            <FilterButton
              key={filter}
              active={activeFilter === filter}
              onClick={() => onFilterChange(filter)}
            >
              {filter}
            </FilterButton>
          ))}
          <FilterButton variant="reset" onClick={onReset}>
            Reset {title.toLowerCase()}
          </FilterButton>
        </div>
      </div>
    </div>
  );
}