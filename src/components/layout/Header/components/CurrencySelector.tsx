import React, { useState, useEffect } from 'react';
import { useCurrency } from '../../../../context/CurrencyContext';

interface CustomSwitchProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  size?: 'small' | 'normal';
}

export const CustomSwitch: React.FC<CustomSwitchProps> = ({ checked, onChange, size = 'normal' }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input 
        type="checkbox" 
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
      />
      <div className={`flex justify-center items-center ${size === 'small' ? 'w-8 h-4' : 'w-11 h-6'} bg-gray-200 rounded-full peer peer-checked:after:translate-x-full 
        after:content-[''] after:absolute ${size === 'small' ? 'after:top-[2px] after:left-[2px] after:h-3 after:w-3' : 'after:top-0.5 after:left-[2px] after:h-5 after:w-5'} after:bg-white 
        after:rounded-full after:transition-all peer-checked:bg-primary`}>
      </div>
      <span className={`ml-1.5 ${size === 'small' ? 'text-xs' : 'text-sm'} font-medium text-gray-700`}>
        {checked ? 'USD' : 'GEL'}
      </span>
    </label>
  );
};

const currencies = [
  { id: 'GEL', symbol: '₾', name: 'ლარი' },
  { id: 'USD', symbol: '$', name: 'დოლარი' },
  { id: 'EUR', symbol: '€', name: 'ევრო' }
];

const CurrencySelector = () => {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  const currentCurrency = currencies.find(c => c.id === currency) || currencies[0];

  const handleCurrencyChange = (currencyId: string) => {
    setCurrency(currencyId);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.currency-selector')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative currency-selector">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
      >
        <span>{currentCurrency.symbol}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 py-2 w-36 bg-white rounded-xl shadow-lg border border-gray-100">
          {currencies.map((curr) => (
            <button
              key={curr.id}
              onClick={() => handleCurrencyChange(curr.id)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                currency === curr.id ? 'text-primary font-medium' : 'text-gray-700'
              }`}
            >
              <span className="flex items-center space-x-2">
                <span>{curr.symbol}</span>
                <span>{curr.name}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;