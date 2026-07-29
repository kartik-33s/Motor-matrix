import React from 'react';
import { Search, X, DollarSign } from 'lucide-react';

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
    <div className="bg-[#1a1a1a] border border-[#3c3c3c] p-6 mb-16">
      
      {/* M Stripe */}
      <div className="h-1 bg-gradient-to-r from-[#0066b1] via-[#1c69d4] to-[#e22718] mb-6"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-[24px] font-bold text-white uppercase">FILTER VEHICLES</h2>
          <p className="text-[12px] text-[#7e7e7e] uppercase tracking-[1.5px] font-bold mt-1">
            SHOWING {totalResults} RESULT{totalResults === 1 ? '' : 'S'}
          </p>
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={onResetFilters}
            className="flex items-center space-x-2 px-6 py-3 bg-[#e22718] text-white text-[14px] font-bold uppercase tracking-[1.5px] hover:bg-[#ffffff] hover:text-[#000000] transition-all"
          >
            <X className="w-4 h-4" />
            <span>CLEAR FILTERS ({activeFiltersCount})</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="w-5 h-5 text-[#7e7e7e] absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={filters.q}
          onChange={(e) => onFilterChange('q', e.target.value)}
          placeholder="SEARCH BY MAKE, MODEL, OR SPECS..."
          className="w-full bg-[#0d0d0d] border border-[#3c3c3c] focus:border-[#ffffff] pl-12 pr-4 py-4 text-[14px] text-white placeholder-[#7e7e7e] outline-none transition-all uppercase font-light tracking-wider"
        />
        {filters.q && (
          <button
            onClick={() => onFilterChange('q', '')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7e7e7e] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Make Filter */}
        <div>
          <label className="block text-[12px] font-bold text-[#7e7e7e] uppercase tracking-[1.5px] mb-2">
            MANUFACTURER
          </label>
          <select
            value={filters.make}
            onChange={(e) => onFilterChange('make', e.target.value)}
            className="w-full bg-[#0d0d0d] border border-[#3c3c3c] text-white text-[14px] px-4 py-3 outline-none focus:border-[#ffffff] transition-colors uppercase font-light"
          >
            {MAKES.map((m) => (
              <option key={m} value={m}>
                {m === 'All' ? 'ALL MAKES' : m}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-[12px] font-bold text-[#7e7e7e] uppercase tracking-[1.5px] mb-2">
            CATEGORY
          </label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="w-full bg-[#0d0d0d] border border-[#3c3c3c] text-white text-[14px] px-4 py-3 outline-none focus:border-[#ffffff] transition-colors uppercase font-light"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? 'ALL CATEGORIES' : c}
              </option>
            ))}
          </select>
        </div>

        {/* Min Price */}
        <div>
          <label className="block text-[12px] font-bold text-[#7e7e7e] uppercase tracking-[1.5px] mb-2">
            MIN PRICE ($)
          </label>
          <div className="relative">
            <DollarSign className="w-4 h-4 text-[#7e7e7e] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => onFilterChange('minPrice', e.target.value)}
              placeholder="0"
              className="w-full bg-[#0d0d0d] border border-[#3c3c3c] text-white text-[14px] pl-10 pr-4 py-3 outline-none focus:border-[#ffffff] transition-colors font-light"
            />
          </div>
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-[12px] font-bold text-[#7e7e7e] uppercase tracking-[1.5px] mb-2">
            MAX PRICE ($)
          </label>
          <div className="relative">
            <DollarSign className="w-4 h-4 text-[#7e7e7e] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange('maxPrice', e.target.value)}
              placeholder="200000"
              className="w-full bg-[#0d0d0d] border border-[#3c3c3c] text-white text-[14px] pl-10 pr-4 py-3 outline-none focus:border-[#ffffff] transition-colors font-light"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilterBar;
