import React from 'react';

interface CylinderSwitcherProps {
  value: number | undefined;
  onChange: (value: number) => void;
  className?: string;
}

// Common cylinder options
const CYLINDER_OPTIONS = [1, 2, 3, 4, 5, 6, 8, 10, 12];

const CylinderSwitcher: React.FC<CylinderSwitcherProps> = ({ value, onChange, className = '' }) => {
  return (
    <div className={`inline-flex items-center p-1 bg-gray-100 rounded-lg ${className}`}>
      {CYLINDER_OPTIONS.map((cylNumber) => (
        <button
          key={cylNumber}
          type="button"
          className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
            value === cylNumber
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => onChange(cylNumber)}
        >
          {cylNumber}
        </button>
      ))}
    </div>
  );
};

export default CylinderSwitcher;
