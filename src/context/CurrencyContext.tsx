import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getStoredPreferences, storePreferences } from '../utils/userPreferences';

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'GEL',
  setCurrency: () => {},
});

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState(() => getStoredPreferences().currency);

  // Update stored preferences when currency changes
  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    storePreferences({ currency: newCurrency });
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: handleCurrencyChange }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);