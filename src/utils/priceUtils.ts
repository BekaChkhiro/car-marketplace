import { useCurrency } from '../context/CurrencyContext';

/**
 * Custom hook for price conversion and formatting
 * 
 * @returns Object with utility functions for price handling
 */
export const usePriceUtils = () => {
  const { currency, convertPrice, formatPrice } = useCurrency();
  
  /**
   * Convert a price from one currency to the currently selected currency
   * 
   * @param price - The price amount to convert
   * @param fromCurrency - The source currency code (default: 'GEL')
   * @returns The converted price as a number
   */
  const convert = (price: number, fromCurrency: string = 'GEL'): number => {
    if (!price) return 0;
    return convertPrice(price, fromCurrency);
  };
  
  /**
   * Format a price with the current currency symbol
   * 
   * @param price - The price amount to format
   * @param fromCurrency - The source currency code (default: 'GEL')
   * @param withConversion - Whether to convert the price before formatting (default: true)
   * @returns Formatted price string with currency symbol
   */
  const format = (price: number, fromCurrency: string = 'GEL', withConversion: boolean = true): string => {
    if (!price) return formatPrice(0);
    
    const finalPrice = withConversion ? convert(price, fromCurrency) : price;
    return formatPrice(finalPrice);
  };
  
  /**
   * Format a price range with the current currency symbol
   * 
   * @param minPrice - The minimum price
   * @param maxPrice - The maximum price
   * @param fromCurrency - The source currency code (default: 'GEL')
   * @returns Formatted price range string
   */
  const formatRange = (minPrice: number, maxPrice: number, fromCurrency: string = 'GEL'): string => {
    if (!minPrice && !maxPrice) return formatPrice(0);
    if (!minPrice) return `${formatPrice(0)} - ${format(maxPrice, fromCurrency)}`;
    if (!maxPrice) return `${format(minPrice, fromCurrency)} +`;
    
    return `${format(minPrice, fromCurrency)} - ${format(maxPrice, fromCurrency)}`;
  };
  
  return {
    convert,
    format,
    formatRange,
    currentCurrency: currency
  };
};
