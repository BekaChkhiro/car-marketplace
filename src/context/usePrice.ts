import { useCurrency } from './CurrencyContext';

export const usePrice = () => {
  const { currency, convertPrice, formatPrice: formatCurrencyPrice } = useCurrency();

  const formatPrice = (priceInGEL: number) => {
    // Convert price from GEL to the selected currency using API rates
    const convertedPrice = convertPrice(priceInGEL, 'GEL');
    
    // Format the price with the appropriate currency symbol
    return formatCurrencyPrice(convertedPrice);
  };

  return { formatPrice, currency };
};