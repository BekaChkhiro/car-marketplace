import React from 'react';
import { CarFilters, Category } from '../../../api/types/car.types';

interface ExtendedCarFilters extends CarFilters {
  priceRange?: string;
  location?: string;
}

interface FiltersProps {
  filters: ExtendedCarFilters;
  onFilterChange: (filters: Partial<ExtendedCarFilters>) => void;
  categories: Category[];
}

const Filters: React.FC<FiltersProps> = ({ filters, onFilterChange, categories }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      
      {/* Category */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => onFilterChange({ category: e.target.value })}
          className="w-full border border-gray-300 rounded-md p-2"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Brand */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Brand
        </label>
        <select
          value={filters.brand}
          onChange={(e) => onFilterChange({ brand: e.target.value })}
          className="w-full border border-gray-300 rounded-md p-2"
        >
          <option value="">All Brands</option>
          {/* Add brand options here */}
        </select>
      </div>

      {/* Model */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Model
        </label>
        <select
          value={filters.model}
          onChange={(e) => onFilterChange({ model: e.target.value })}
          className="w-full border border-gray-300 rounded-md p-2"
          disabled={!filters.brand}
        >
          <option value="">All Models</option>
          {/* Add model options here */}
        </select>
      </div>

      {/* Price Range */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price Range
        </label>
        <select
          value={filters.priceRange}
          onChange={(e) => onFilterChange({ priceRange: e.target.value })}
          className="w-full border border-gray-300 rounded-md p-2"
        >
          <option value="">Any Price</option>
          <option value="0-5000">$0 - $5,000</option>
          <option value="5000-10000">$5,000 - $10,000</option>
          <option value="10000-20000">$10,000 - $20,000</option>
          <option value="20000-30000">$20,000 - $30,000</option>
          <option value="30000-50000">$30,000 - $50,000</option>
          <option value="50000-100000">$50,000 - $100,000</option>
          <option value="100000-">$100,000+</option>
        </select>
      </div>

      {/* Year Range */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Year Range
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="From"
            value={filters.yearFrom || ''}
            onChange={(e) => onFilterChange({ yearFrom: Number(e.target.value) || undefined })}
            className="w-full border border-gray-300 rounded-md p-2"
          />
          <input
            type="number"
            placeholder="To"
            value={filters.yearTo || ''}
            onChange={(e) => onFilterChange({ yearTo: Number(e.target.value) || undefined })}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
      </div>

      {/* Fuel Type */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fuel Type
        </label>
        <select
          value={filters.fuelType}
          onChange={(e) => onFilterChange({ fuelType: e.target.value })}
          className="w-full border border-gray-300 rounded-md p-2"
        >
          <option value="">All Fuel Types</option>
          <option value="petrol">Petrol</option>
          <option value="diesel">Diesel</option>
          <option value="hybrid">Hybrid</option>
          <option value="electric">Electric</option>
        </select>
      </div>

      {/* Transmission */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Transmission
        </label>
        <select
          value={filters.transmission}
          onChange={(e) => onFilterChange({ transmission: e.target.value })}
          className="w-full border border-gray-300 rounded-md p-2"
        >
          <option value="">All Transmissions</option>
          <option value="automatic">Automatic</option>
          <option value="manual">Manual</option>
          <option value="semi-automatic">Semi-Automatic</option>
        </select>
      </div>

      {/* Location */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <select
          value={filters.location}
          onChange={(e) => onFilterChange({ location: e.target.value })}
          className="w-full border border-gray-300 rounded-md p-2"
        >
          <option value="">All Locations</option>
          {/* Add location options here */}
        </select>
      </div>

      {/* Reset Filters */}
      <button
        onClick={() => onFilterChange({
          brand: '',
          model: '',
          category: '',
          priceRange: '',
          yearFrom: undefined,
          yearTo: undefined,
          fuelType: '',
          transmission: '',
          location: ''
        })}
        className="w-full bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded hover:bg-gray-200 transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default Filters;
