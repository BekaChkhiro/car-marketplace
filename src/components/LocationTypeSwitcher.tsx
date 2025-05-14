import React from 'react';
import { MapPin, Truck, Globe } from 'lucide-react';

export type LocationType = 'georgia' | 'transit' | 'international';

interface LocationTypeSwitcherProps {
  value: LocationType;
  onChange: (value: LocationType) => void;
  className?: string;
}

const LocationTypeSwitcher: React.FC<LocationTypeSwitcherProps> = ({ value, onChange, className = '' }) => {
  return (
    <div className={`w-full sm:w-1/2 px-4 inline-flex  flex-col sm:flex-row items-center p-1 bg-gray-100 rounded-lg ${className}`}>
      <button
        type="button"
        className={`w-full px-3 py-1 text-sm font-medium rounded-md transition-all flex items-center gap-1 ${
          value === 'georgia'
            ? 'bg-white text-primary shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
        }`}
        onClick={() => onChange('georgia')}
      >
        <MapPin size={14} />
        <span>საქართველო</span>
      </button>
      <button
        type="button"
        className={`w-full px-3 py-1 text-sm font-medium rounded-md transition-all flex items-center gap-1 ${
          value === 'transit'
            ? 'bg-white text-primary shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
        }`}
        onClick={() => onChange('transit')}
      >
        <Truck size={14} />
        <span>ტრანზიტი</span>
      </button>
      <button
        type="button"
        className={`w-full px-3 py-1 text-sm font-medium rounded-md transition-all flex items-center gap-1 ${
          value === 'international'
            ? 'bg-white text-primary shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
        }`}
        onClick={() => onChange('international')}
      >
        <Globe size={14} />
        <span>საზღვარგარეთ</span>
      </button>
    </div>
  );
};

export default LocationTypeSwitcher;