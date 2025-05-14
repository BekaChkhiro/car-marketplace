import React from 'react';
import { Wrench, Settings } from 'lucide-react';
import CustomSelect from '../../../../../components/common/CustomSelect';
import { TRANSMISSION_OPTIONS, FUEL_TYPE_OPTIONS, ENGINE_SIZE_OPTIONS, INTERIOR_MATERIAL_OPTIONS } from '../types';
import CylinderSwitcher from '../../../../../components/CylinderSwitcher';
import DriveTypeSwitcher from '../../../../../components/DriveTypeSwitcher';
import SteeringWheelSwitcher from '../../../../../components/SteeringWheelSwitcher';
import ColorDropdown from '../../../../../components/ColorDropdown';
import InteriorColorDropdown from '../../../../../components/InteriorColorDropdown';
import AirbagSwitcher from '../../../../../components/AirbagSwitcher';

interface TransmissionSwitcherProps {
  value: 'manual' | 'automatic' | undefined;
  onChange: (value: 'manual' | 'automatic') => void;
  className?: string;
}

const TransmissionSwitcher: React.FC<TransmissionSwitcherProps> = ({ value, onChange, className = '' }) => {
  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center  justify-between gap-2 ${className}`}>
      <button
        type="button"
        className={`w-full flex-1 py-2.5 px-4  rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
          value === 'manual'
            ? 'bg-primary text-white shadow-sm font-medium'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        onClick={() => onChange('manual')}
      >
        <Settings size={16} className={value === 'manual' ? 'text-white' : 'text-gray-500'} />
        <span>მექანიკური</span>
      </button>
      <button
        type="button"
        className={` w-full flex-1 py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
          value === 'automatic'
            ? 'bg-primary text-white shadow-sm font-medium'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        onClick={() => onChange('automatic')}
      >
        <Settings size={16} className={value === 'automatic' ? 'text-white' : 'text-gray-500'} />
        <span>ავტომატური</span>
      </button>
    </div>
  );
};


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
    <div className="bg-white rounded-xl p-6 border ">
      <div className="flex items-center gap-3 mb-6 ">
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
            ძრავის მოცულობა (ლიტრი)
            {errors?.engine_size && (
              <span className="text-red-500 ml-1 text-xs">{errors.engine_size}</span>
            )}
          </label>
          <CustomSelect
            value={specifications.engine_size?.toString() || ''}
            onChange={(value) => onChange('engine_size', value)}
            options={ENGINE_SIZE_OPTIONS}
            placeholder="აირჩიეთ ძრავის მოცულობა"
            error={errors?.engine_size}
          />
          <p className="text-xs text-gray-500 mt-1">აირჩიეთ ძრავის მოცულობა ლიტრებში.</p>
        </div>



        {/* ცილინდრები */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-primary transition-colors">
            ცილინდრების რაოდენობა
          </label>
          <div className="relative">
            <input
              type="number"
              value={specifications.cylinders || ''}
              onChange={(e) => onChange('cylinders', Number(e.target.value))}
              className="w-full px-2 py-2.5 text-sm sm:text-md border-2 rounded-lg text-base bg-white hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 pr-24"
              placeholder="მაგ: 4"
              min="1"
              max="16"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <CylinderSwitcher 
                value={specifications.cylinders} 
                onChange={(value) => onChange('cylinders', value)}
                className="border-0 shadow-sm"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">მიუთითეთ ძრავის ცილინდრების რაოდენობა.</p>
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
          <TransmissionSwitcher 
            value={specifications.transmission as 'manual' | 'automatic'} 
            onChange={(value: 'manual' | 'automatic') => onChange('transmission', value)}
            className="w-full"
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



        {/* წამყვანი თვლები */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-primary transition-colors">
            წამყვანი თვლები
            {errors?.drive_type && (
              <span className="text-red-500 ml-1 text-xs">{errors.drive_type}</span>
            )}
          </label>
          <DriveTypeSwitcher
            value={specifications.drive_type}
            onChange={(value) => onChange('drive_type', value)}
            className="w-full"
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
          <SteeringWheelSwitcher
            value={specifications.steering_wheel}
            onChange={(value) => onChange('steering_wheel', value)}
            className="w-full"
          />
        </div>

        {/* ფერი */}
        <div className="group">
          <label className="block text-sm  font-medium text-gray-700 mb-2 group-hover:text-primary transition-colors">
            ფერი
            {errors?.color && (
              <span className="text-red-500 ml-1 text-xs">{errors.color}</span>
            )}
          </label>
          <ColorDropdown
            value={specifications.color || ''}
            onChange={(value) => onChange('color', value)}
            placeholder="აირჩიეთ ფერი"
            error={errors?.color}
          />
        </div>

        {/* სალონის მასალა */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-primary transition-colors">
            სალონის მასალა
            {errors?.interior_material && (
              <span className="text-red-500 ml-1 text-xs">{errors.interior_material}</span>
            )}
          </label>
          <CustomSelect
            options={INTERIOR_MATERIAL_OPTIONS}
            value={specifications.interior_material || ''}
            onChange={(value) => onChange('interior_material', value)}
            placeholder="აირჩიეთ სალონის მასალა"
            error={errors?.interior_material}
          />
        </div>

        {/* სალონის ფერი */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-primary transition-colors">
            სალონის ფერი
            {errors?.interior_color && (
              <span className="text-red-500 ml-1 text-xs">{errors.interior_color}</span>
            )}
          </label>
          <InteriorColorDropdown
            value={specifications.interior_color || ''}
            onChange={(value) => onChange('interior_color', value)}
            placeholder="აირჩიეთ სალონის ფერი"
            error={errors?.interior_color}
          />
        </div>

        {/* უსაფრთხოების ბალიშების რაოდენობა */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-primary transition-colors">
            უსაფრთხოების ბალიშების რაოდენობა
            {errors?.airbags_count && (
              <span className="text-red-500 ml-1 text-xs">{errors.airbags_count}</span>
            )}
          </label>
          <CustomSelect
            options={[
              { value: '0', label: '0' },
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
              { value: '4', label: '4' },
              { value: '5', label: '5' },
              { value: '6', label: '6' },
              { value: '7', label: '7' },
              { value: '8', label: '8' },
              { value: '9', label: '9' },
              { value: '10', label: '10' },
              { value: '11', label: '11' },
              { value: '12', label: '12' }
            ]}
            value={specifications.airbags_count?.toString() || ''}
            onChange={(value) => onChange('airbags_count', Number(value))}
            placeholder="აირჩიეთ აირბეგების რაოდენობა"
            error={errors?.airbags_count}
          />
        </div>
      </div>
    </div>
  );
};

export default TechnicalSpecs;