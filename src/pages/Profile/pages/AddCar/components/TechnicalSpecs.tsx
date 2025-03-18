import React from 'react';
import {
  TRANSMISSION_OPTIONS,
  FUEL_TYPE_OPTIONS,
  DOORS_OPTIONS,
  MILEAGE_UNIT_OPTIONS,
  STEERING_WHEEL_OPTIONS,
  DRIVE_TYPE_OPTIONS,
  INTERIOR_MATERIAL_OPTIONS,
  MONTHS,
} from '../types';

interface TechnicalSpecsProps {
  specifications: {
    engine_type?: string;
    transmission?: string;
    fuel_type?: string;
    mileage?: string | number;
    mileage_unit?: 'km' | 'mi';
    engine_size?: string | number;
    horsepower?: string | number;
    doors?: number;
    is_turbo?: boolean;
    cylinders?: number;
    manufacture_month?: number;
    body_type?: string;
    steering_wheel?: 'left' | 'right';
    drive_type?: string;
    interior_material?: string;
    interior_color?: string;
    color?: string;
  };
  onChange: (field: string, value: string | number | boolean) => void;
  errors?: Record<string, string>;
}

const TechnicalSpecs: React.FC<TechnicalSpecsProps> = ({ 
  specifications, 
  onChange,
  errors 
}) => {
  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold text-gray-dark border-b pb-4">
        ტექნიკური მახასიათებლები
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Engine Info */}
        <div>
          <label htmlFor="engine_type" className="block text-sm font-medium text-gray-700 mb-2">
            ძრავის ტიპი
          </label>
          <input
            type="text"
            id="engine_type"
            value={specifications.engine_type || ''}
            onChange={(e) => onChange('specifications.engine_type', e.target.value)}
            className={`w-full px-4 py-2 border-2 rounded-lg text-base ${
              errors?.['specifications.engine_type']
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-100 focus:border-primary focus:ring-primary/20'
            } focus:outline-none focus:ring-2 transition-colors`}
            placeholder="მაგ: 2.5L I4"
          />
        </div>

        <div>
          <label htmlFor="transmission" className="block text-sm font-medium text-gray-700 mb-2">
            ტრანსმისია
          </label>
          <select
            id="transmission"
            value={specifications.transmission || ''}
            onChange={(e) => onChange('specifications.transmission', e.target.value)}
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
        </div>

        <div>
          <label htmlFor="fuel_type" className="block text-sm font-medium text-gray-700 mb-2">
            საწვავის ტიპი
          </label>
          <select
            id="fuel_type"
            value={specifications.fuel_type || ''}
            onChange={(e) => onChange('specifications.fuel_type', e.target.value)}
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

        {/* Mileage Section */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label htmlFor="mileage" className="block text-sm font-medium text-gray-700 mb-2">
              გარბენი
            </label>
            <input
              type="number"
              id="mileage"
              min="0"
              value={specifications.mileage || ''}
              onChange={(e) => onChange('specifications.mileage', e.target.value)}
              className={`w-full px-4 py-2 border-2 rounded-lg text-base ${
                errors?.['specifications.mileage']
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-gray-100 focus:border-primary focus:ring-primary/20'
              } focus:outline-none focus:ring-2 transition-colors`}
              placeholder="მაგ: 150000"
            />
          </div>
          <div className="w-24">
            <label htmlFor="mileage_unit" className="block text-sm font-medium text-gray-700 mb-2">
              ერთეული
            </label>
            <select
              id="mileage_unit"
              value={specifications.mileage_unit || 'km'}
              onChange={(e) => onChange('specifications.mileage_unit', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
            >
              {MILEAGE_UNIT_OPTIONS.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
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
            onChange={(e) => onChange('specifications.engine_size', e.target.value)}
            className={`w-full px-4 py-2 border-2 rounded-lg text-base ${
              errors?.['specifications.engine_size']
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-100 focus:border-primary focus:ring-primary/20'
            } focus:outline-none focus:ring-2 transition-colors`}
            placeholder="მაგ: 2.5"
          />
        </div>

        <div>
          <label htmlFor="horsepower" className="block text-sm font-medium text-gray-700 mb-2">
            ცხენის ძალა (HP)
          </label>
          <input
            type="number"
            id="horsepower"
            min="0"
            value={specifications.horsepower || ''}
            onChange={(e) => onChange('specifications.horsepower', e.target.value)}
            className={`w-full px-4 py-2 border-2 rounded-lg text-base ${
              errors?.['specifications.horsepower']
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-100 focus:border-primary focus:ring-primary/20'
            } focus:outline-none focus:ring-2 transition-colors`}
            placeholder="მაგ: 150"
          />
        </div>

        <div>
          <label htmlFor="doors" className="block text-sm font-medium text-gray-700 mb-2">
            კარები
          </label>
          <select
            id="doors"
            value={specifications.doors || ''}
            onChange={(e) => onChange('specifications.doors', Number(e.target.value))}
            className={`w-full px-4 py-2 border-2 rounded-lg text-base ${
              errors?.['specifications.doors']
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-100 focus:border-primary focus:ring-primary/20'
            } focus:outline-none focus:ring-2 transition-colors`}
          >
            <option value="">აირჩიეთ კარების რაოდენობა</option>
            {DOORS_OPTIONS.map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={specifications.is_turbo || false}
              onChange={(e) => onChange('specifications.is_turbo', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
              peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full 
              peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
              after:left-[2px] after:bg-white after:border-gray-300 after:border 
              after:rounded-full after:h-5 after:w-5 after:transition-all 
              peer-checked:bg-primary"
            />
            <span className="ml-3 text-sm text-gray-600">ტურბო ძრავი</span>
          </label>
        </div>

        <div>
          <label htmlFor="cylinders" className="block text-sm font-medium text-gray-700 mb-2">
            ცილინდრები
          </label>
          <input
            type="number"
            id="cylinders"
            min="1"
            max="16"
            value={specifications.cylinders || ''}
            onChange={(e) => onChange('specifications.cylinders', Number(e.target.value))}
            className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
            placeholder="მაგ: 4"
          />
        </div>

        <div>
          <label htmlFor="manufacture_month" className="block text-sm font-medium text-gray-700 mb-2">
            გამოშვების თვე
          </label>
          <select
            id="manufacture_month"
            value={specifications.manufacture_month || ''}
            onChange={(e) => onChange('specifications.manufacture_month', Number(e.target.value))}
            className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
          >
            <option value="">აირჩიეთ თვე</option>
            {MONTHS.map((month, index) => (
              <option key={month} value={index + 1}>{month}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="steering_wheel" className="block text-sm font-medium text-gray-700 mb-2">
            საჭე
          </label>
          <select
            id="steering_wheel"
            value={specifications.steering_wheel || ''}
            onChange={(e) => onChange('specifications.steering_wheel', e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
          >
            <option value="">აირჩიეთ საჭის მდებარეობა</option>
            <option value="left">მარცხენა</option>
            <option value="right">მარჯვენა</option>
          </select>
        </div>

        <div>
          <label htmlFor="drive_type" className="block text-sm font-medium text-gray-700 mb-2">
            წამყვანი თვლები
          </label>
          <select
            id="drive_type"
            value={specifications.drive_type || ''}
            onChange={(e) => onChange('specifications.drive_type', e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
          >
            <option value="">აირჩიეთ წამყვანი თვლები</option>
            {DRIVE_TYPE_OPTIONS.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="interior_material" className="block text-sm font-medium text-gray-700 mb-2">
            სალონის მასალა
          </label>
          <select
            id="interior_material"
            value={specifications.interior_material || ''}
            onChange={(e) => onChange('specifications.interior_material', e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
          >
            <option value="">აირჩიეთ სალონის მასალა</option>
            {INTERIOR_MATERIAL_OPTIONS.map(material => (
              <option key={material} value={material}>{material}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="interior_color" className="block text-sm font-medium text-gray-700 mb-2">
            სალონის ფერი
          </label>
          <input
            type="text"
            id="interior_color"
            value={specifications.interior_color || ''}
            onChange={(e) => onChange('specifications.interior_color', e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
            placeholder="მაგ: შავი"
          />
        </div>

        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
            ფერი
          </label>
          <input
            type="text"
            id="color"
            value={specifications.color || ''}
            onChange={(e) => onChange('specifications.color', e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
            placeholder="მაგ: ვერცხლისფერი"
          />
        </div>
      </div>
    </div>
  );
};

export default TechnicalSpecs;