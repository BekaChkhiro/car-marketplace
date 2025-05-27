import React, { useState, useEffect, useRef } from 'react';
import { X, Filter, Trash2 } from 'lucide-react';
import CustomSelect from './common/CustomSelect';
import RangeFilter from './ui/RangeFilter';

interface AdvancedFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: AdvancedFilters) => void;
  currentFilters?: AdvancedFilters;
}

export interface AdvancedFilters {
  yearFrom: string;
  yearTo: string;
  engineSizeFrom: string;
  engineSizeTo: string;
  mileageFrom: string;
  mileageTo: string;
  fuelType: string;
  color: string;
  driveType: string;
  seats: string;
  condition: string;
  steeringWheel: string;
}

const AdvancedFiltersModal: React.FC<AdvancedFiltersModalProps> = ({
  isOpen,
  onClose,
  onApply,
  currentFilters = {
    yearFrom: '',
    yearTo: '',
    engineSizeFrom: '',
    engineSizeTo: '',
    mileageFrom: '',
    mileageTo: '',
    fuelType: '',
    color: '',
    driveType: '',
    seats: '',
    condition: '',
    steeringWheel: ''
  }
}) => {
  const [filters, setFilters] = useState<AdvancedFilters>(currentFilters);
  const [fuelTypes] = useState<string[]>(['ბენზინი', 'დიზელი', 'ჰიბრიდი', 'ელექტრო', 'ბუნებრივი აირი', 'თხევადი აირი']);
  const [colors] = useState<string[]>(['შავი', 'თეთრი', 'ვერცხლისფერი', 'ნაცრისფერი', 'ლურჯი', 'წითელი', 'მწვანე', 'ყავისფერი', 'ყვითელი']);
  const [driveTypes] = useState<string[]>(['წინა', 'უკანა', '4x4']);
  const [conditions] = useState<string[]>(['ახალი', 'მეორადი']);
  const [steeringWheels] = useState<string[]>(['მარჯვენა', 'მარცხენა']);
  const [seats] = useState<string[]>(['2', '3', '4', '5', '6', '7', '8', '9+']);
  const modalRef = useRef<HTMLDivElement>(null);
  
  const years = Array.from({ length: 80 }, (_, i) => (new Date().getFullYear() - i).toString());
  
  // Handle clicking outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // Prevent scrolling on body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleRangeChange = (name: string, values: { from: string; to: string }) => {
    if (name === 'year') {
      setFilters(prev => ({
        ...prev,
        yearFrom: values.from || '',
        yearTo: values.to || ''
      }));
    } else if (name === 'engineSize') {
      setFilters(prev => ({
        ...prev,
        engineSizeFrom: values.from || '',
        engineSizeTo: values.to || ''
      }));
    } else if (name === 'mileage') {
      setFilters(prev => ({
        ...prev,
        mileageFrom: values.from || '',
        mileageTo: values.to || ''
      }));
    }
  };

  const handleChange = (field: keyof AdvancedFilters, value: string | string[]) => {
    const stringValue = Array.isArray(value) ? value[0] : value;
    setFilters(prev => ({ ...prev, [field]: stringValue }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };
  
  const handleClearAll = () => {
    setFilters({
      yearFrom: '',
      yearTo: '',
      engineSizeFrom: '',
      engineSizeTo: '',
      mileageFrom: '',
      mileageTo: '',
      fuelType: '',
      color: '',
      driveType: '',
      seats: '',
      condition: '',
      steeringWheel: ''
    });
  };
  
  // Check if any filters are applied
  const hasActiveFilters = Object.values(filters).some(value => value !== '');
  
  // Count active filters
  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50 flex items-center justify-center p-0 sm:p-4 transition-opacity duration-300">
      <div 
        ref={modalRef} 
        className="bg-white rounded-none sm:rounded-lg shadow-xl w-full sm:max-w-2xl h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto transform transition-transform duration-300 ease-in-out animate-modalIn"
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-primary" />
            <h2 className="text-xl font-semibold text-gray-800">დამატებითი ფილტრები</h2>
            {activeFiltersCount > 0 && (
              <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="დახურვა"
          >
            <X size={22} />
          </button>
        </div>
        
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Year Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              გამოშვების წელი
            </label>
            <div className="grid grid-cols-2 gap-2">
              <CustomSelect
                options={[
                  { value: '', label: 'დან' },
                  ...years.map(year => ({
                    value: year,
                    label: year
                  }))
                ]}
                value={filters.yearFrom}
                onChange={value => handleChange('yearFrom', value)}
                placeholder="დან"
              />
              <CustomSelect
                options={[
                  { value: '', label: 'მდე' },
                  ...years.map(year => ({
                    value: year,
                    label: year
                  }))
                ]}
                value={filters.yearTo}
                onChange={value => handleChange('yearTo', value)}
                placeholder="მდე"
              />
            </div>
          </div>
          
          {/* Engine Size Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ძრავის მოცულობა (ლ)
            </label>
            <RangeFilter
              name="engineSize"
              fromValue={filters.engineSizeFrom}
              toValue={filters.engineSizeTo}
              placeholder={{ from: 'დან', to: 'მდე' }}
              onChange={handleRangeChange}
            />
          </div>
          
          {/* Mileage Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              გარბენი (კმ)
            </label>
            <RangeFilter
              name="mileage"
              fromValue={filters.mileageFrom}
              toValue={filters.mileageTo}
              placeholder={{ from: 'დან', to: 'მდე' }}
              onChange={handleRangeChange}
            />
          </div>
          
          {/* Fuel Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              საწვავის ტიპი
            </label>
            <CustomSelect
              options={[
                { value: '', label: 'ნებისმიერი' },
                ...fuelTypes.map(type => ({
                  value: type,
                  label: type
                }))
              ]}
              value={filters.fuelType}
              onChange={value => handleChange('fuelType', value)}
              placeholder="ნებისმიერი"
            />
          </div>
          
          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ფერი
            </label>
            <CustomSelect
              options={[
                { value: '', label: 'ნებისმიერი' },
                ...colors.map(color => ({
                  value: color,
                  label: color
                }))
              ]}
              value={filters.color}
              onChange={value => handleChange('color', value)}
              placeholder="ნებისმიერი"
            />
          </div>
          
          {/* Drive Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              წამყვანი თვლები
            </label>
            <CustomSelect
              options={[
                { value: '', label: 'ნებისმიერი' },
                ...driveTypes.map(type => ({
                  value: type,
                  label: type
                }))
              ]}
              value={filters.driveType}
              onChange={value => handleChange('driveType', value)}
              placeholder="ნებისმიერი"
            />
          </div>
          
          {/* Seats */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ადგილების რაოდენობა
            </label>
            <CustomSelect
              options={[
                { value: '', label: 'ნებისმიერი' },
                ...seats.map(seat => ({
                  value: seat,
                  label: seat
                }))
              ]}
              value={filters.seats}
              onChange={value => handleChange('seats', value)}
              placeholder="ნებისმიერი"
            />
          </div>
          
          {/* Condition */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              მდგომარეობა
            </label>
            <CustomSelect
              options={[
                { value: '', label: 'ნებისმიერი' },
                ...conditions.map(condition => ({
                  value: condition,
                  label: condition
                }))
              ]}
              value={filters.condition}
              onChange={value => handleChange('condition', value)}
              placeholder="ნებისმიერი"
            />
          </div>
          
          {/* Steering Wheel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              საჭე
            </label>
            <CustomSelect
              options={[
                { value: '', label: 'ნებისმიერი' },
                ...steeringWheels.map(wheel => ({
                  value: wheel,
                  label: wheel
                }))
              ]}
              value={filters.steeringWheel}
              onChange={value => handleChange('steeringWheel', value)}
              placeholder="ნებისმიერი"
            />
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 flex items-center justify-between sticky bottom-0 bg-white">
          <button
            onClick={handleClearAll}
            disabled={!hasActiveFilters}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${hasActiveFilters ? 'text-red-600 hover:bg-red-50' : 'text-gray-400 cursor-not-allowed'}`}
            aria-label="ყველა ფილტრის გასუფთავება"
          >
            <Trash2 size={16} />
            <span>გასუფთავება</span>
            {activeFiltersCount > 0 && (
              <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              გაუქმება
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              გამოყენება
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFiltersModal;
