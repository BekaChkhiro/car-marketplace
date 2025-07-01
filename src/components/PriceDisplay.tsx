import React from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { Part } from '../api/services/partService';

interface PriceDisplayProps {
  part: Part;
  showOriginalCurrency?: boolean;
  className?: string;
}

/**
 * Component for displaying prices with automatic currency conversion
 */
export const PriceDisplay: React.FC<PriceDisplayProps> = ({ 
  part, 
  showOriginalCurrency = false,
  className = ''
}) => {
  const { convertPrice, formatPrice, currency } = useCurrency();
  
  if (!part || typeof part.price !== 'number') {
    return <span className={className}>N/A</span>;
  }
  
  // Get the part's original currency or default to GEL
  const originalCurrency = part.currency || 'GEL';
  
  // Convert the price to the user's selected currency
  const convertedPrice = convertPrice(part.price, originalCurrency);
  
  // Format the price with the appropriate currency symbol
  const formattedPrice = formatPrice(convertedPrice);
  
  return (
    <div className={`price-display ${className}`}>
      <span className="converted-price">{formattedPrice}</span>
      
      {showOriginalCurrency && originalCurrency !== currency && (
        <span className="original-price text-xs text-gray-500 ml-1">
          ({part.price.toLocaleString()} {originalCurrency})
        </span>
      )}
    </div>
  );
};

export default PriceDisplay;
