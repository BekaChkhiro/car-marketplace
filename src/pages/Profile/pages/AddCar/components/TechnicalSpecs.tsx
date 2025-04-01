import React from 'react';
import { Wrench } from 'lucide-react';
import CustomSelect from '../../../../../components/common/CustomSelect';
import { TRANSMISSION_OPTIONS, FUEL_TYPE_OPTIONS, DRIVE_TYPE_OPTIONS, STEERING_WHEEL_OPTIONS, BODY_TYPE_OPTIONS } from '../types';

const CYLINDER_OPTIONS = [2, 3, 4, 5, 6, 8, 10, 12];

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
    horsepower?: number;
    color?: string;
    interior_material?: string;
    interior_color?: string;
    airbags_count?: number;
    [key: string]: any;
  };
  onChange: (field: string, value: any) => void;
  errors?: Record<string, string>;
}

const TechnicalSpecs: React.FC<TechnicalSpecsProps> = ({ specifications, onChange, errors = {} }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center transform transition-transform duration-300 group-hover:rotate-180">
          <Wrench size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">ტექნიკური მახასიათებლები</h2>
          <p className="text-sm text-gray-500">მანქანის ტექნიკური დეტალები</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ძრავის მოცულობა */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-primary transition-colors">
            ძრავის მოცულობა (კუბ.სმ)
            <span className="text-xs text-gray-500 ml-1">(მაგ: 2000 კუბ.სმ = 2.0 ლიტრი)</span>
          </label>
          <input
            type="number"
            value={specifications.engine_size || ''}
            onChange={(e) => onChange('engine_size', e.target.value)}
            className="w-full px-4 py-2.5 border-2 rounded-lg text-base bg-white hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            placeholder="მაგ: 2000"
          />
          <p className="text-xs text-gray-500 mt-1">შეიყვანეთ ძრავის მოცულობა კუბურ სანტიმეტრებში (cc).</p>
        </div>

        {/* ცხენის ძალა */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-primary transition-colors">
            ცხენის ძალა
          </label>
          <input
            type="number"
            value={specifications.horsepower || ''}
            onChange={(e) => onChange('horsepower', e.target.value)}
            className="w-full px-4 py-2.5 border-2 rounded-lg text-base bg-white hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            placeholder="მაგ: 150"
          />
        </div>

        {/* ცილინდრები */}
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

        {/* გარბენი */}
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
        </div>
        
        {/* გადაცემათა კოლოფი */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-primary transition-colors">
            გადაცემათა კოლოფი
            {errors?.transmission && (
              <span className="text-red-500 ml-1 text-xs">{errors.transmission}</span>
            )}
          </label>
          <CustomSelect
            value={specifications.transmission || ''}
            onChange={(value) => onChange('transmission', value)}
            options={TRANSMISSION_OPTIONS}
            placeholder="აირჩიეთ გადაცემათა კოლოფი"
            error={errors?.transmission}
          />
        </div>

        {/* საწვავის ტიპი */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-primary transition-colors">
            საწვავის ტიპი
            {errors?.fuel_type && (
              <span className="text-red-500 ml-1 text-xs">{errors.fuel_type}</span>
            )}
          </label>
          <CustomSelect
            value={specifications.fuel_type || ''}
            onChange={(value) => onChange('fuel_type', value)}
            options={FUEL_TYPE_OPTIONS}
            placeholder="აირჩიეთ საწვავის ტიპი"
            error={errors?.fuel_type}
          />
        </div>

        {/* ძარის ტიპი */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-primary transition-colors">
            ძარის ტიპი
            {errors?.body_type && (
              <span className="text-red-500 ml-1 text-xs">{errors.body_type}</span>
            )}
          </label>
          <CustomSelect
            value={specifications.body_type || ''}
            onChange={(value) => onChange('body_type', value)}
            options={BODY_TYPE_OPTIONS}
            placeholder="აირჩიეთ ძარის ტიპი"
            error={errors?.body_type}
          />
        </div>

        {/* წამყვანი თვლები */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-primary transition-colors">
            წამყვანი თვლები
            {errors?.drive_type && (
              <span className="text-red-500 ml-1 text-xs">{errors.drive_type}</span>
            )}
          </label>
          <CustomSelect
            value={specifications.drive_type || ''}
            onChange={(value) => onChange('drive_type', value)}
            options={DRIVE_TYPE_OPTIONS}
            placeholder="აირჩიეთ წამყვანი თვლები"
            error={errors?.drive_type}
          />
        </div>

        {/* საჭე */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-primary transition-colors">
            საჭე
            {errors?.steering_wheel && (
              <span className="text-red-500 ml-1 text-xs">{errors.steering_wheel}</span>
            )}
          </label>
          <CustomSelect
            value={specifications.steering_wheel || ''}
            onChange={(value) => onChange('steering_wheel', value)}
            options={STEERING_WHEEL_OPTIONS}
            placeholder="აირჩიეთ საჭის მდებარეობა"
            error={errors?.steering_wheel}
          />
        </div>

        {/* ფერი */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-primary transition-colors">
            ფერი
          </label>
          <input
            type="text"
            value={specifications.color || ''}
            onChange={(e) => onChange('color', e.target.value)}
            className="w-full px-4 py-2.5 border-2 rounded-lg text-base bg-white hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            placeholder="მაგ: შავი"
          />
        </div>

        {/* სალონის მასალა */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-primary transition-colors">
            სალონის მასალა
          </label>
          <input
            type="text"
            value={specifications.interior_material || ''}
            onChange={(e) => onChange('interior_material', e.target.value)}
            className="w-full px-4 py-2.5 border-2 rounded-lg text-base bg-white hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            placeholder="მაგ: ტყავი"
          />
        </div>

        {/* სალონის ფერი */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-primary transition-colors">
            სალონის ფერი
          </label>
          <input
            type="text"
            value={specifications.interior_color || ''}
            onChange={(e) => onChange('interior_color', e.target.value)}
            className="w-full px-4 py-2.5 border-2 rounded-lg text-base bg-white hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            placeholder="მაგ: შავი"
          />
        </div>

        {/* უსაფრთხოების ბალიშების რაოდენობა */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-primary transition-colors">
            უსაფრთხოების ბალიშების რაოდენობა
          </label>
          <input
            type="number"
            value={specifications.airbags_count || ''}
            onChange={(e) => onChange('airbags_count', Number(e.target.value))}
            className="w-full px-4 py-2.5 border-2 rounded-lg text-base bg-white hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            placeholder="მაგ: 4"
          />
        </div>
      </div>
    </div>
  );
};

export default TechnicalSpecs;