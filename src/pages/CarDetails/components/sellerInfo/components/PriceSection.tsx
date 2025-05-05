import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { usePrice } from '../../../../../context/usePrice';
import { CustomSwitch } from '../../../../../components/layout/Header/components/CurrencySelector';
import { useCurrency } from '../../../../../context/CurrencyContext';

interface PriceSectionProps {
  price: number;
  carId: string;
}

const PriceSection = ({ price, carId }: PriceSectionProps) => {
  const [copied, setCopied] = useState(false);
  const { formatPrice } = usePrice();
  const { currency, setCurrency } = useCurrency();

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(carId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy ID:', err);
    }
  };

  return (
    <div className='flex flex-col gap-1 sm:gap-2'>
      <div className='flex items-center justify-between'>
        <div className="text-xl sm:text-2xl font-bold text-primary">
          {formatPrice(price)}
        </div>
        <CustomSwitch
          checked={currency === 'USD'}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrency(e.target.checked ? 'USD' : 'GEL')}
        />
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <div className="text-xs sm:text-sm text-gray-500">
          განცხადების ID: {carId}
        </div>
        <button
          onClick={handleCopyId}
          className="p-0.5 sm:p-1 hover:bg-gray-100 rounded-md transition-colors"
          title="ID-ის კოპირება"
        >
          {copied ? (
            <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
          ) : (
            <Copy className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
          )}
        </button>
      </div>
    </div>
  );
};

export default PriceSection;