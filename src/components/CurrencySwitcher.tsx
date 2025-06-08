import React from 'react';

interface CurrencySwitcherProps {
  value: 'GEL' | 'USD';
  onChange: (value: 'GEL' | 'USD') => void;
  className?: string;
}

export const CurrencySwitcher: React.FC<CurrencySwitcherProps> = ({ value, onChange, className = '' }) => {
  return (
    <div className={`inline-flex items-center p-1 bg-gray-100 rounded-lg ${className}`}>
      <button
        type="button"
        className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
          value === 'GEL'
            ? 'bg-white text-primary shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
        }`}
        onClick={() => onChange('GEL')}
      >
        ₾ GEL
      </button>
      <button
        type="button"
        className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
          value === 'USD'
            ? 'bg-white text-primary shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
        }`}
        onClick={() => onChange('USD')}
      >
        $ USD
      </button>
    </div>
  );
};

export default CurrencySwitcher;
