import React from 'react';

interface PriceDisplayProps {
  totalPrice: number;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ totalPrice }) => {
  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center">
        <span className="text-gray-700">ჯამური ღირებულება:</span>
        <span className="font-bold text-primary text-lg">{totalPrice} ₾</span>
      </div>
    </div>
  );
};

export default PriceDisplay;
