import React from 'react';

interface LocationProps {
  city: string;
  state: string;
  country: string;
  onChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

const Location: React.FC<LocationProps> = ({ 
  city,
  state,
  country,
  onChange, 
  errors 
}) => {
  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold text-gray-dark border-b pb-4">
        მდებარეობა
      </h2>
      
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
            placeholder="მაგ: თბილისი"
          />
          {errors?.state && (
            <p className="mt-1 text-sm text-red-600">{errors.state}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
            ქვეყანა
          </label>
          <input
            type="text"
            id="country"
            value={country}
            onChange={(e) => onChange('country', e.target.value)}
            disabled
            className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg text-base bg-gray-50 cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
};

export default Location;