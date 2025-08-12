import { useCurrency } from './CurrencyContext';

export const usePrice = () => {
  const { currency, convertPrice, formatPrice: formatCurrencyPrice } = useCurrency();

  const formatPrice = (price: number, sourceCurrency: 'GEL' | 'USD' = 'USD') => {
    // Convert price from source currency to the selected currency using API rates
    const convertedPrice = convertPrice(price, sourceCurrency);
    
    // Format the price with the appropriate currency symbol
    return formatCurrencyPrice(convertedPrice);
  };

  return { formatPrice, currency };
};