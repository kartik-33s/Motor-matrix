import React from 'react';
import { Search, Filter, X, DollarSign, CarTag } from 'lucide-react';

const MAKES = ['All', 'Tesla', 'Porsche', 'BMW', 'Mercedes-Benz', 'Ford', 'Audi', 'Toyota', 'Range Rover', 'Lucid', 'Chevrolet'];
const CATEGORIES = ['All', 'Electric', 'Sports', 'Sedan', 'SUV', 'Truck'];

const SearchFilterBar = ({ filters, onFilterChange, onResetFilters, totalResults }) => {
  const activeFiltersCount =
    (filters.q ? 1 : 0) +
    (filters.make !== 'All' ? 1 : 0) +
    (filters.category !== 'All' ? 1 : 0) +
    (filters.minPrice ? 1 : 0) +
    (filters.maxPrice ? 1 : 0);

  return (
    <div className="bg-[#111827]/90 backdrop-blur-xl border border-gray-800 rounded-2xl p-5 shadow-xl mb-8">
      {/* Top Search Input & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-800">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.q}
            onChange={(e) => onFilterChange('q', e.target.value)}
            placeholder="Search by make, model, category, or specs (e.g. Plaid, GT3, Twin-turbo)..."
            className="w-full bg-gray-900/90 border border-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all"
          />
          {filters.q && (
            <button
              onClick={() => onFilterChange('q', '')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between md:justify-end space-x-3 text-xs">
          <span className="text-gray-400 font-medium">
            Showing <strong className="text-white font-bold">{totalResults}</strong> vehicle{totalResults === 1 ? '' : 's'}
          </span>
          {activeFiltersCount > 0 && (
            <button
              onClick={onResetFilters}
              className="flex items-center space-x-1 bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg font-semibold hover:bg-red-500/20 transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filters ({activeFiltersCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Combinable Filters Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Make Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
            Manufacturer / Make
          </label>
          <select
            value={filters.make}
            onChange={(e) => onFilterChange('make', e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 text-gray-200 text-sm rounded-xl px-3 py-2.5 outline-none focus:border-blue-500 transition-colors"
          >
            {MAKES.map((m) => (
              <option key={m} value={m}>
                {m === 'All' ? 'All Makes' : m}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
            Body Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 text-gray-200 text-sm rounded-xl px-3 py-2.5 outline-none focus:border-blue-500 transition-colors"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? 'All Categories' : c}
              </option>
            ))}
          </select>
        </div>

        {/* Min Price */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
            Min Price ($)
          </label>
          <div className="relative">
            <DollarSign className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => onFilterChange('minPrice', e.target.value)}
              placeholder="0"
              className="w-full bg-gray-900 border border-gray-800 text-gray-200 text-sm rounded-xl pl-8 pr-3 py-2.5 outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
            Max Price ($)
          </label>
          <div className="relative">
            <DollarSign className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange('maxPrice', e.target.value)}
              placeholder="200000"
              className="w-full bg-gray-900 border border-gray-800 text-gray-200 text-sm rounded-xl pl-8 pr-3 py-2.5 outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilterBar;
