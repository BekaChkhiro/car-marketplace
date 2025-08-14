import React, { useState, useEffect } from 'react';
import { useCurrency } from '../../../../context/CurrencyContext';
import currencyService from '../../../../api/services/currencyService';

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

// Base currencies we support
const currencies = [
  { id: 'GEL', symbol: '₾', name: 'ლარი' },
  { id: 'USD', symbol: '$', name: 'დოლარი' }
];

const CurrencySelector = () => {
  const { currency, setCurrency, lastUpdated, exchangeRates } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [rates, setRates] = useState<{[key: string]: number}>({});

  // Get the current currency info
  const currentCurrency = currencies.find(c => c.id === currency) || currencies[0];
  
  // Update rates when exchange rates change
  useEffect(() => {
    const ratesObj: {[key: string]: number} = {};
    exchangeRates.forEach((rate, code) => {
      if (currencies.some(c => c.id === code)) {
        // Access rate and quantity safely with type checking
        const rateValue = typeof rate.rate === 'number' ? rate.rate : 1;
        const quantity = typeof rate.quantity === 'number' ? rate.quantity : 1;
        ratesObj[code] = rateValue / quantity;
      }
    });
    setRates(ratesObj);
  }, [exchangeRates]);

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
      {/* Desktop: Dropdown */}
      <div className="hidden md:block">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors touch-manipulation py-2"
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
          <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-[60]">
            <div className="px-4 py-1 text-xs text-gray-500 border-b border-gray-100">
              {lastUpdated ? (
                <span>განახლდა: {new Date(lastUpdated).toLocaleString('ka-GE')}</span>
              ) : (
                <span>მიმდინარეობს განახლება...</span>
              )}
            </div>
            {currencies.map((curr) => (
              <button
                key={curr.id}
                onClick={() => handleCurrencyChange(curr.id)}
                className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors touch-manipulation ${
                  currency === curr.id ? 'text-primary font-medium bg-primary/5' : 'text-gray-700'
                }`}
              >
                <span className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <span className="text-base">{curr.symbol}</span>
                    <span className="font-medium">{curr.name}</span>
                  </span>
                  {curr.id !== 'GEL' && rates['GEL'] && rates[curr.id] && (
                    <span className="text-xs text-gray-500">
                      1 {curr.symbol} = {(rates[curr.id] / rates['GEL']).toFixed(2)} ₾
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mobile: Button Toggle */}
      <div className="md:hidden flex items-center bg-gray-100 rounded-lg p-1">
        {currencies.map((curr) => (
          <button
            key={curr.id}
            onClick={() => handleCurrencyChange(curr.id)}
            className={`px-2 py-1 text-xs font-medium rounded transition-all touch-manipulation ${
              currency === curr.id
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {curr.symbol}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CurrencySelector;