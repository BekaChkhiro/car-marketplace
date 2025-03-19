import React from 'react';
import {
  TRANSMISSION_OPTIONS,
  FUEL_TYPE_OPTIONS,
  BODY_TYPE_OPTIONS,
  DOORS_OPTIONS,
  STEERING_WHEEL_OPTIONS,
  DRIVE_TYPE_OPTIONS
} from '../types';

interface TechnicalSpecsProps {
  specifications: {
    engine_type?: string;
    transmission?: string;
    fuel_type?: string;
    mileage?: string | number;
    engine_size?: string | number;
    horsepower?: string | number;
    doors?: number;
    cylinders?: number;
    manufacture_month?: number;
    body_type?: string;
    steering_wheel?: 'left' | 'right';
    drive_type?: string;
    is_turbo?: boolean;
    color?: string;
  };
  onChange: (field: string, value: any) => void;
  errors?: Record<string, string>;
}

const TechnicalSpecs: React.FC<TechnicalSpecsProps> = ({
  specifications,
  onChange,
  errors
}) => {
  const handleChange = (field: string, value: any) => {
    onChange(`specifications.${field}`, value);
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold text-gray-dark border-b pb-4">
        ტექნიკური მახასიათებლები
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            გადაცემათა კოლოფი *
          </label>
          <select
            value={specifications.transmission || ''}
            onChange={(e) => handleChange('transmission', e.target.value)}
            className={`w-full px-4 py-2 border-2 rounded-lg text-base ${
              errors?.['specifications.transmission']
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-100 focus:border-primary focus:ring-primary/20'
            } focus:outline-none focus:ring-2 transition-colors`}
          >
            <option value="">აირჩიეთ გადაცემათა კოლოფი</option>
            {TRANSMISSION_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            საწვავის ტიპი *
          </label>
          <select
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
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ძრავის მოცულობა (ლიტრი)
          </label>
          <input
            type="number"
            value={specifications.engine_size || ''}
            onChange={(e) => handleChange('engine_size', e.target.value)}
            placeholder="მაგ: 2.0"
            step="0.1"
            min="0"
            max="10"
            className={`w-full px-4 py-2 border-2 rounded-lg text-base ${
              errors?.['specifications.engine_size']
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-100 focus:border-primary focus:ring-primary/20'
            } focus:outline-none focus:ring-2 transition-colors`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ცხენის ძალა (HP)
          </label>
          <input
            type="number"
            value={specifications.horsepower || ''}
            onChange={(e) => handleChange('horsepower', e.target.value)}
            placeholder="მაგ: 150"
            min="0"
            max="2000"
            className={`w-full px-4 py-2 border-2 rounded-lg text-base ${
              errors?.['specifications.horsepower']
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-100 focus:border-primary focus:ring-primary/20'
            } focus:outline-none focus:ring-2 transition-colors`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            გარბენი (კმ)
          </label>
          <input
            type="number"
            value={specifications.mileage || ''}
            onChange={(e) => handleChange('mileage', e.target.value)}
            placeholder="მაგ: 100000"
            min="0"
            className={`w-full px-4 py-2 border-2 rounded-lg text-base ${
              errors?.['specifications.mileage']
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-100 focus:border-primary focus:ring-primary/20'
            } focus:outline-none focus:ring-2 transition-colors`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            კარების რაოდენობა
          </label>
          <select
            value={specifications.doors || ''}
            onChange={(e) => handleChange('doors', Number(e.target.value))}
            className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
          >
            <option value="">აირჩიეთ კარების რაოდენობა</option>
            {DOORS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ძრავის ტიპი
          </label>
          <select
            value={specifications.body_type || ''}
            onChange={(e) => handleChange('body_type', e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
          >
            <option value="">აირჩიეთ ძრავის ტიპი</option>
            {BODY_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            საჭე
          </label>
          <select
            value={specifications.steering_wheel || ''}
            onChange={(e) => handleChange('steering_wheel', e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
          >
            <option value="">აირჩიეთ საჭის მდებარეობა</option>
            {STEERING_WHEEL_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option === 'left' ? 'მარცხენა' : 'მარჯვენა'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            წამყვანი თვლები
          </label>
          <select
            value={specifications.drive_type || ''}
            onChange={(e) => handleChange('drive_type', e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
          >
            <option value="">აირჩიეთ წამყვანი თვლები</option>
            {DRIVE_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option === 'front' ? 'წინა' : option === 'rear' ? 'უკანა' : '4x4'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ფერი
          </label>
          <input
            type="text"
            value={specifications.color || ''}
            onChange={(e) => handleChange('color', e.target.value)}
            placeholder="მაგ: შავი"
            className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_turbo"
            checked={specifications.is_turbo || false}
            onChange={(e) => handleChange('is_turbo', e.target.checked)}
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <label htmlFor="is_turbo" className="text-sm font-medium text-gray-700">
            ტურბო
          </label>
        </div>
      </div>
    </div>
  );
};

export default TechnicalSpecs;