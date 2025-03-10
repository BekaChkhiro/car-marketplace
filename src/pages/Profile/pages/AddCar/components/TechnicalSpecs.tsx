import React from 'react';
import {
  TRANSMISSION_OPTIONS,
  FUEL_TYPE_OPTIONS,
  BODY_TYPE_OPTIONS,
  COLOR_OPTIONS,
} from '../types';

interface TechnicalSpecsProps {
  specifications?: {
    engine_type?: string;
    transmission?: string;
    fuel_type?: string;
    mileage?: string | number;
    engine_size?: string | number;
    horsepower?: string | number;
    doors?: string | number;
    color?: string;
    body_type?: string;
  };
  onChange: (field: string, value: string | number) => void;
  errors?: Record<string, string>;
}

const TechnicalSpecs: React.FC<TechnicalSpecsProps> = ({ 
  specifications = {}, 
  onChange,
  errors 
}) => {
  const handleChange = (field: string, value: string | number) => {
    // Handle empty values
    if (value === '') {
      onChange(`specifications.${field}`, '');
      return;
    }

    // Handle numeric fields
    if (['mileage', 'engine_size', 'horsepower', 'doors'].includes(field)) {
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        // Round to integers except engine_size
        if (field === 'engine_size') {
          value = Math.round(numValue * 10) / 10; // Round to 1 decimal place
        } else {
          value = Math.round(numValue);
        }
      }
    }

    onChange(`specifications.${field}`, value);
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold text-gray-dark border-b pb-4">
        ტექნიკური მახასიათებლები
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label htmlFor="engine_type" className="block text-sm font-medium text-gray-700 mb-2">
            ძრავის ტიპი
          </label>
          <input
            type="text"
            id="engine_type"
            value={specifications.engine_type || ''}
            onChange={(e) => handleChange('engine_type', e.target.value)}
            className={`w-full px-4 py-2 border-2 rounded-lg text-base ${
              errors?.['specifications.engine_type']
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-100 focus:border-primary focus:ring-primary/20'
            } focus:outline-none focus:ring-2 transition-colors`}
            placeholder="მაგ: 2.5L I4"
          />
          {errors?.['specifications.engine_type'] && (
            <p className="mt-1 text-sm text-red-600">{errors['specifications.engine_type']}</p>
          )}
        </div>

        <div>
          <label htmlFor="transmission" className="block text-sm font-medium text-gray-700 mb-2">
            ტრანსმისია
          </label>
          <select
            id="transmission"
            value={specifications.transmission || ''}
            onChange={(e) => handleChange('transmission', e.target.value)}
            className={`w-full px-4 py-2 border-2 rounded-lg text-base ${
              errors?.['specifications.transmission']
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-100 focus:border-primary focus:ring-primary/20'
            } focus:outline-none focus:ring-2 transition-colors`}
          >
            <option value="">აირჩიეთ ტრანსმისია</option>
            {TRANSMISSION_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors?.['specifications.transmission'] && (
            <p className="mt-1 text-sm text-red-600">{errors['specifications.transmission']}</p>
          )}
        </div>

        <div>
          <label htmlFor="fuel_type" className="block text-sm font-medium text-gray-700 mb-2">
            საწვავის ტიპი
          </label>
          <select
            id="fuel_type"
            value={specifications.fuel_type || ''}
            onChange={(e) => handleChange('fuel_type', e.target.value)}
            className={`w-full px-4 py-2 border-2 rounded-lg text-base ${
              errors?.['specifications.fuel_type']
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-100 focus:border-primary focus:ring-primary/20'
            } focus:outline-none focus:ring-2 transition-colors`}
          >
            <option value="">აირჩიეთ საწვავის ტიპი</option>
            {FUEL_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors?.['specifications.fuel_type'] && (
            <p className="mt-1 text-sm text-red-600">{errors['specifications.fuel_type']}</p>
          )}
        </div>

        <div>
          <label htmlFor="mileage" className="block text-sm font-medium text-gray-700 mb-2">
            გარბენი (კმ)
          </label>
          <input
            type="number"
            id="mileage"
            min="0"
            step="1"
            value={specifications.mileage || ''}
            onChange={(e) => handleChange('mileage', e.target.value)}
            onWheel={(e) => e.currentTarget.blur()}
            className={`w-full px-4 py-2 border-2 rounded-lg text-base ${
              errors?.['specifications.mileage']
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-100 focus:border-primary focus:ring-primary/20'
            } focus:outline-none focus:ring-2 transition-colors`}
            placeholder="მაგ: 150000"
          />
          {errors?.['specifications.mileage'] && (
            <p className="mt-1 text-sm text-red-600">{errors['specifications.mileage']}</p>
          )}
        </div>

        <div>
          <label htmlFor="engine_size" className="block text-sm font-medium text-gray-700 mb-2">
            ძრავის მოცულობა (ლ)
          </label>
          <input
            type="number"
            id="engine_size"
            min="0"
            max="12"
            step="0.1"
            value={specifications.engine_size || ''}
            onChange={(e) => handleChange('engine_size', e.target.value)}
            onWheel={(e) => e.currentTarget.blur()}
            className={`w-full px-4 py-2 border-2 rounded-lg text-base ${
              errors?.['specifications.engine_size']
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-100 focus:border-primary focus:ring-primary/20'
            } focus:outline-none focus:ring-2 transition-colors`}
            placeholder="მაგ: 2.5"
          />
          {errors?.['specifications.engine_size'] && (
            <p className="mt-1 text-sm text-red-600">{errors['specifications.engine_size']}</p>
          )}
        </div>

        <div>
          <label htmlFor="horsepower" className="block text-sm font-medium text-gray-700 mb-2">
            ცხენის ძალა (HP)
          </label>
          <input
            type="number"
            id="horsepower"
            min="0"
            step="1"
            value={specifications.horsepower || ''}
            onChange={(e) => handleChange('horsepower', e.target.value)}
            onWheel={(e) => e.currentTarget.blur()}
            className={`w-full px-4 py-2 border-2 rounded-lg text-base ${
              errors?.['specifications.horsepower']
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-100 focus:border-primary focus:ring-primary/20'
            } focus:outline-none focus:ring-2 transition-colors`}
            placeholder="მაგ: 150"
          />
          {errors?.['specifications.horsepower'] && (
            <p className="mt-1 text-sm text-red-600">{errors['specifications.horsepower']}</p>
          )}
        </div>

        <div>
          <label htmlFor="doors" className="block text-sm font-medium text-gray-700 mb-2">
            კარების რაოდენობა
          </label>
          <select
            id="doors"
            value={specifications.doors || ''}
            onChange={(e) => handleChange('doors', Number(e.target.value))}
            className={`w-full px-4 py-2 border-2 rounded-lg text-base ${
              errors?.['specifications.doors']
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-100 focus:border-primary focus:ring-primary/20'
            } focus:outline-none focus:ring-2 transition-colors`}
          >
            <option value="">აირჩიეთ კარების რაოდენობა</option>
            {[2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          {errors?.['specifications.doors'] && (
            <p className="mt-1 text-sm text-red-600">{errors['specifications.doors']}</p>
          )}
        </div>

        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
            ფერი
          </label>
          <select
            id="color"
            value={specifications.color || ''}
            onChange={(e) => handleChange('color', e.target.value)}
            className={`w-full px-4 py-2 border-2 rounded-lg text-base ${
              errors?.['specifications.color']
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-100 focus:border-primary focus:ring-primary/20'
            } focus:outline-none focus:ring-2 transition-colors`}
          >
            <option value="">აირჩიეთ ფერი</option>
            {COLOR_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors?.['specifications.color'] && (
            <p className="mt-1 text-sm text-red-600">{errors['specifications.color']}</p>
          )}
        </div>

        <div>
          <label htmlFor="body_type" className="block text-sm font-medium text-gray-700 mb-2">
            ძარის ტიპი
          </label>
          <select
            id="body_type"
            value={specifications.body_type || ''}
            onChange={(e) => handleChange('body_type', e.target.value)}
            className={`w-full px-4 py-2 border-2 rounded-lg text-base ${
              errors?.['specifications.body_type']
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-100 focus:border-primary focus:ring-primary/20'
            } focus:outline-none focus:ring-2 transition-colors`}
          >
            <option value="">აირჩიეთ ძარის ტიპი</option>
            {BODY_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors?.['specifications.body_type'] && (
            <p className="mt-1 text-sm text-red-600">{errors['specifications.body_type']}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnicalSpecs;