import React from 'react';

interface DriveTypeSwitcherProps {
  value: string | undefined;
  onChange: (value: string) => void;
  className?: string;
}

// Drive type options based on the existing DRIVE_TYPE_OPTIONS
const DRIVE_TYPE_OPTIONS = [
  { value: 'front', label: 'წინა' },
  { value: 'rear', label: 'უკანა' },
  { value: '4x4', label: '4x4' },
  { value: 'all', label: 'სრული' }
];

const DriveTypeSwitcher: React.FC<DriveTypeSwitcherProps> = ({ value, onChange, className = '' }) => {
  return (
    <div className={`flex items-center p-1 bg-gray-100 rounded-lg ${className}`}>
      {DRIVE_TYPE_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`w-1/4 py-2.5 text-sm font-medium rounded-md transition-all ${
            value === option.value
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default DriveTypeSwitcher;
