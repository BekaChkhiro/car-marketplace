import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface PriceSectionProps {
  price: number;
  carId: string;
}

const PriceSection = ({ price, carId }: PriceSectionProps) => {
  const [copied, setCopied] = useState(false);

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
    <div className="flex items-center justify-between">
      <div className="text-2xl font-bold text-primary">
        {price.toLocaleString()} ₾
      </div>
      <div className="flex items-center gap-2">
        <div className="text-sm text-gray-500">
          განცხადების ID: {carId}
        </div>
        <button
          onClick={handleCopyId}
          className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          title="ID-ის კოპირება"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </div>
    </div>
  );
};

export default PriceSection;