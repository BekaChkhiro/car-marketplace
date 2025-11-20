import React, { useState, useEffect, useRef } from 'react';
import { X, Filter, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CustomSelect from './common/CustomSelect';
import RangeFilter from './ui/RangeFilter';
import { namespaces } from '../i18n';

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
  location: string;
  transmission: string;
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
    steeringWheel: '',
    location: '',
    transmission: ''
  }
}) => {
  const { t } = useTranslation([namespaces.common, namespaces.filter]);
  const [filters, setFilters] = useState<AdvancedFilters>(currentFilters);
  
  // Get translated values from i18n
  const [fuelTypes] = useState<string[]>([
    t('filter:fuel.petrol'),
    t('filter:fuel.diesel'),
    t('filter:fuel.hybrid'),
    t('filter:fuel.electric'),
    t('filter:fuel.naturalGas'),
    t('filter:fuel.lpg')
  ]);
  
  const [colors] = useState<string[]>([
    t('filter:colors.black'),
    t('filter:colors.white'),
    t('filter:colors.silver'),
    t('filter:colors.gray'),
    t('filter:colors.blue'),
    t('filter:colors.red'),
    t('filter:colors.green'),
    t('filter:colors.brown'),
    t('filter:colors.yellow')
  ]);
  
  const [driveTypes] = useState<string[]>([
    t('filter:driveTypes.front'),
    t('filter:driveTypes.rear'),
    t('filter:driveTypes.allWheel')
  ]);
  
  const [conditions] = useState<string[]>([
    t('filter:conditions.new'),
    t('filter:conditions.used')
  ]);
  
  const [steeringWheels] = useState<string[]>([
    t('filter:steeringWheels.right'),
    t('filter:steeringWheels.left')
  ]);

  const [locations] = useState<string[]>([
    t('filter:locations.tbilisi'),
    t('filter:locations.batumi'),
    t('filter:locations.kutaisi'),
    t('filter:locations.rustavi'),
    t('filter:locations.gori'),
    t('filter:locations.zugdidi'),
    t('filter:locations.poti'),
    t('filter:locations.telavi'),
    t('filter:locations.other')
  ]);

  const [transmissions] = useState<string[]>([
    t('filter:transmissions.automatic'),
    t('filter:transmissions.manual'),
    t('filter:transmissions.variator'),
    t('filter:transmissions.semiAutomatic')
  ]);

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
      steeringWheel: '',
      location: '',
      transmission: ''
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
            <h2 className="text-xl font-semibold text-gray-800">{t('filter:advancedFilters')}</h2>
            {activeFiltersCount > 0 && (
              <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
            aria-label={t('common:close')}
          >
            <X size={22} />
          </button>
        </div>
        
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('filter:location')}
            </label>
            <CustomSelect
              options={[
                { value: '', label: t('filter:anyOption') },
                ...locations.map(location => ({
                  value: location,
                  label: location
                }))
              ]}
              value={filters.location}
              onChange={value => handleChange('location', value)}
              placeholder={t('filter:anyOption')}
            />
          </div>

          {/* Transmission */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('filter:transmission')}
            </label>
            <CustomSelect
              options={[
                { value: '', label: t('filter:anyOption') },
                ...transmissions.map(transmission => ({
                  value: transmission,
                  label: transmission
                }))
              ]}
              value={filters.transmission}
              onChange={value => handleChange('transmission', value)}
              placeholder={t('filter:anyOption')}
            />
          </div>

          {/* Year Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('filter:year')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <CustomSelect
                options={[
                  { value: '', label: t('filter:yearFrom') },
                  ...years.map(year => ({
                    value: year,
                    label: year
                  }))
                ]}
                value={filters.yearFrom}
                onChange={value => handleChange('yearFrom', value)}
                placeholder={t('filter:yearFrom')}
              />
              <CustomSelect
                options={[
                  { value: '', label: t('filter:yearTo') },
                  ...years.map(year => ({
                    value: year,
                    label: year
                  }))
                ]}
                value={filters.yearTo}
                onChange={value => handleChange('yearTo', value)}
                placeholder={t('filter:yearTo')}
              />
            </div>
          </div>
          
          {/* Engine Size Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('filter:engineSize')}
            </label>
            <RangeFilter
              name="engineSize"
              fromValue={filters.engineSizeFrom}
              toValue={filters.engineSizeTo}
              placeholder={{ from: t('filter:engineSizeFrom'), to: t('filter:engineSizeTo') }}
              onChange={handleRangeChange}
            />
          </div>
          
          {/* Mileage Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('filter:mileage')}
            </label>
            <RangeFilter
              name="mileage"
              fromValue={filters.mileageFrom}
              toValue={filters.mileageTo}
              placeholder={{ from: t('filter:mileageFrom'), to: t('filter:mileageTo') }}
              onChange={handleRangeChange}
            />
          </div>
          
          {/* Fuel Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('filter:fuelType')}
            </label>
            <CustomSelect
              options={[
                { value: '', label: t('filter:anyOption') },
                ...fuelTypes.map(type => ({
                  value: type,
                  label: type
                }))
              ]}
              value={filters.fuelType}
              onChange={value => handleChange('fuelType', value)}
              placeholder={t('filter:anyOption')}
            />
          </div>
          
          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('filter:color')}
            </label>
            <CustomSelect
              options={[
                { value: '', label: t('filter:anyOption') },
                ...colors.map(color => ({
                  value: color,
                  label: color
                }))
              ]}
              value={filters.color}
              onChange={value => handleChange('color', value)}
              placeholder={t('filter:anyOption')}
            />
          </div>
          
          {/* Drive Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('filter:driveType')}
            </label>
            <CustomSelect
              options={[
                { value: '', label: t('filter:anyOption') },
                ...driveTypes.map(type => ({
                  value: type,
                  label: type
                }))
              ]}
              value={filters.driveType}
              onChange={value => handleChange('driveType', value)}
              placeholder={t('filter:anyOption')}
            />
          </div>
          
          {/* Seats */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('filter:numberOfSeats')}
            </label>
            <CustomSelect
              options={[
                { value: '', label: t('filter:anyOption') },
                ...seats.map(seat => ({
                  value: seat,
                  label: seat
                }))
              ]}
              value={filters.seats}
              onChange={value => handleChange('seats', value)}
              placeholder={t('filter:anyOption')}
            />
          </div>
          
          {/* Condition */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('filter:condition')}
            </label>
            <CustomSelect
              options={[
                { value: '', label: t('filter:anyOption') },
                ...conditions.map(condition => ({
                  value: condition,
                  label: condition
                }))
              ]}
              value={filters.condition}
              onChange={value => handleChange('condition', value)}
              placeholder={t('filter:anyOption')}
            />
          </div>
          
          {/* Steering Wheel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('filter:steeringWheel')}
            </label>
            <CustomSelect
              options={[
                { value: '', label: t('filter:anyOption') },
                ...steeringWheels.map(wheel => ({
                  value: wheel,
                  label: wheel
                }))
              ]}
              value={filters.steeringWheel}
              onChange={value => handleChange('steeringWheel', value)}
              placeholder={t('filter:anyOption')}
            />
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 flex items-center justify-between sticky bottom-0 bg-white">
          <button
            onClick={handleClearAll}
            disabled={!hasActiveFilters}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${hasActiveFilters ? 'text-red-600 hover:bg-red-50' : 'text-gray-400 cursor-not-allowed'}`}
            aria-label={t('filter:clearAll')}
          >
            <Trash2 size={16} />
            <span>{t('filter:clearAll')}</span>
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
              {t('filter:cancel')}
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              {t('filter:apply')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFiltersModal;
