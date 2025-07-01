import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getStoredPreferences, storePreferences } from '../utils/userPreferences';
import currencyService, { CurrencyRate } from '../api/services/currencyService';

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  convertPrice: (amount: number, fromCurrency?: string) => number;
  formatPrice: (amount: number, withSymbol?: boolean) => string;
  exchangeRates: Map<string, CurrencyRate>;
  lastUpdated: Date | null;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'GEL',
  setCurrency: () => {},
  convertPrice: () => 0,
  formatPrice: () => '',
  exchangeRates: new Map(),
  lastUpdated: null,
});

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState(() => getStoredPreferences().currency || 'GEL');
  const [exchangeRates, setExchangeRates] = useState<Map<string, CurrencyRate>>(new Map());
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Initialize exchange rates
  useEffect(() => {
    const initRates = async () => {
      // Ensure rates are loaded
      if (currencyService.getAllRates().size === 0) {
        await currencyService.fetchLatestRates();
      }
      
      setExchangeRates(currencyService.getAllRates());
      setLastUpdated(currencyService.getLastUpdated());
    };
    
    initRates();
    
    // Set up a periodic check for updates
    const intervalId = setInterval(() => {
      setExchangeRates(currencyService.getAllRates());
      setLastUpdated(currencyService.getLastUpdated());
    }, 60 * 60 * 1000); // Check every hour
    
    return () => clearInterval(intervalId);
  }, []);

  // Update stored preferences when currency changes
  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    storePreferences({ currency: newCurrency });
  };

  // Convert price from one currency to another
  const convertPrice = (amount: number, fromCurrency: string = 'GEL'): number => {
    return currencyService.convert(amount, fromCurrency, currency);
  };

  // Format price with currency symbol
  const formatPrice = (amount: number, withSymbol: boolean = true): string => {
    if (withSymbol) {
      return currencyService.formatPrice(amount, currency);
    }
    
    return amount.toFixed(2);
  };

  return (
    <CurrencyContext.Provider 
      value={{ 
        currency, 
        setCurrency: handleCurrencyChange,
        convertPrice,
        formatPrice,
        exchangeRates,
        lastUpdated
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);