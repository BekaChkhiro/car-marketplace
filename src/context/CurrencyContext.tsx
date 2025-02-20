import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'GEL' | 'USD';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from localStorage or default to 'GEL'
  const [currency, setCurrency] = useState<Currency>(() => {
    const savedCurrency = localStorage.getItem('currency');
    return (savedCurrency === 'USD' || savedCurrency === 'GEL') ? savedCurrency : 'GEL';
  });

  // Save to localStorage whenever currency changes
  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};