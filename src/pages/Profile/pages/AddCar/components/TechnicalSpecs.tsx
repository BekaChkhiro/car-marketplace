import React from 'react';
import { Settings } from 'lucide-react';
import CustomSelect from '../../../../../components/common/CustomSelect';
import {
  TRANSMISSION_OPTIONS,
  FUEL_TYPE_OPTIONS,
  DRIVE_TYPE_OPTIONS,
  CYLINDER_OPTIONS,
} from '../types';

interface TechnicalSpecsProps {
  specifications: {
    engine_type?: string;
    transmission: string;
    fuel_type: string;
    mileage?: string | number;
    mileage_unit?: "km" | "mi";
    engine_size?: string | number;
    cylinders?: number;
    drive_type?: string;
    [key: string]: any;
  };
  onChange: (field: string, value: any) => void;
  errors?: Record<string, string>;
}

const TechnicalSpecs: React.FC<TechnicalSpecsProps> = ({ specifications, onChange, errors }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center transform transition-transform duration-300 group-hover:rotate-180">
          <Settings size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">ტექნიკური მახასიათებლები</h2>
          <p className="text-sm text-gray-500">მანქანის ტექნიკური დეტალები</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-primary transition-colors">
            ძრავის მოცულობა (cc)
          </label>
          <input
            type="number"
            value={specifications.engine_size || ''}
            onChange={(e) => onChange('engine_size', e.target.value)}
            className="w-full px-4 py-2.5 border-2 rounded-lg text-base bg-white hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            placeholder="მაგ: 2000"
          />
          {errors?.engine_size && (
            <p className="mt-1 text-sm text-red-600">{errors.engine_size}</p>
          )}
        </div>

        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-primary transition-colors">
            ცილინდრების რაოდენობა
          </label>
          <CustomSelect
            value={specifications.cylinders?.toString() || ''}
            onChange={(value) => onChange('cylinders', Number(value))}
            options={CYLINDER_OPTIONS.map(c => ({ value: c.toString(), label: c.toString() }))}
            placeholder="აირჩიეთ ცილინდრების რაოდენობა"
          />
        </div>

        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-primary transition-colors">
            გარბენი (კმ)
          </label>
          <input
            type="number"
            value={specifications.mileage || ''}
            onChange={(e) => onChange('mileage', e.target.value)}
            className="w-full px-4 py-2.5 border-2 rounded-lg text-base bg-white hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            placeholder="მაგ: 100000"
          />
          {errors?.mileage && (
            <p className="mt-1 text-sm text-red-600">{errors.mileage}</p>
          )}
        </div>
        
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-primary transition-colors">
            გადაცემათა კოლოფი
          </label>
          <CustomSelect
            value={specifications.transmission || ''}
            onChange={(value) => onChange('transmission', value)}
            options={TRANSMISSION_OPTIONS}
            placeholder="აირჩიეთ გადაცემათა კოლოფი"
          />
        </div>

        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-primary transition-colors">
            საწვავის ტიპი
          </label>
          <CustomSelect
            value={specifications.fuel_type || ''}
            onChange={(value) => onChange('fuel_type', value)}
            options={FUEL_TYPE_OPTIONS}
            placeholder="აირჩიეთ საწვავის ტიპი"
          />
        </div>

        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-primary transition-colors">
            წამყვანი თვლები
          </label>
          <CustomSelect
            value={specifications.drive_type || ''}
            onChange={(value) => onChange('drive_type', value)}
            options={DRIVE_TYPE_OPTIONS}
            placeholder="აირჩიეთ წამყვანი თვლები"
          />
        </div>
      </div>
    </div>
  );
};

export default TechnicalSpecs;