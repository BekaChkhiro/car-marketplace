import React from 'react';
import { LOCATION_TYPE_OPTIONS } from '../types';

interface LocationProps {
  city: string;
  state: string;
  country: string;
  location_type: 'transit' | 'georgia' | 'international';
  onChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

const Location: React.FC<LocationProps> = ({ 
  city,
  state,
  country,
  location_type,
  onChange, 
  errors 
}) => {
  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold text-gray-dark border-b pb-4">
        მდებარეობა
      </h2>
      
      <div>
        <label htmlFor="location_type" className="block text-sm font-medium text-gray-700 mb-2">
          მდებარეობის ტიპი *
        </label>
        <select
          id="location_type"
          value={location_type}
          onChange={(e) => onChange('location_type', e.target.value)}
          className={`w-full px-4 py-2 border-2 rounded-lg text-base ${
            errors?.location_type
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-100 focus:border-primary focus:ring-primary/20'
          } focus:outline-none focus:ring-2 transition-colors`}
        >
          <option value="georgia">საქართველო</option>
          <option value="transit">ტრანზიტში</option>
          <option value="international">საზღვარგარეთ</option>
        </select>
        {errors?.location_type && (
          <p className="mt-1 text-sm text-red-600">{errors.location_type}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
            ქალაქი *
          </label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => onChange('city', e.target.value)}
            className={`w-full px-4 py-2 border-2 rounded-lg text-base ${
              errors?.city
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-100 focus:border-primary focus:ring-primary/20'
            } focus:outline-none focus:ring-2 transition-colors`}
            placeholder="მაგ: თბილისი"
          />
          {errors?.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city}</p>
          )}
        </div>

        {location_type !== 'georgia' && (
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
              რეგიონი *
            </label>
            <input
              type="text"
              id="state"
              value={state}
              onChange={(e) => onChange('state', e.target.value)}
              className={`w-full px-4 py-2 border-2 rounded-lg text-base ${
                errors?.state
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-gray-100 focus:border-primary focus:ring-primary/20'
              } focus:outline-none focus:ring-2 transition-colors`}
              placeholder="მაგ: ჰესენი"
            />
            {errors?.state && (
              <p className="mt-1 text-sm text-red-600">{errors.state}</p>
            )}
          </div>
        )}

        {location_type === 'international' && (
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
              ქვეყანა *
            </label>
            <input
              type="text"
              id="country"
              value={country}
              onChange={(e) => onChange('country', e.target.value)}
              className={`w-full px-4 py-2 border-2 rounded-lg text-base ${
                errors?.country
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-gray-100 focus:border-primary focus:ring-primary/20'
              } focus:outline-none focus:ring-2 transition-colors`}
              placeholder="მაგ: გერმანია"
            />
            {errors?.country && (
              <p className="mt-1 text-sm text-red-600">{errors.country}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Location;