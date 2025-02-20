import { useCurrency } from './CurrencyContext';

const USD_RATE = 0.38; // 1 GEL = 0.38 USD

export const usePrice = () => {
  const { currency } = useCurrency();

  const formatPrice = (priceInGEL: number) => {
    const price = currency === 'USD' ? priceInGEL * USD_RATE : priceInGEL;
    return `${price.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${currency === 'USD' ? '$' : '₾'}`;
  };

  return { formatPrice };
};