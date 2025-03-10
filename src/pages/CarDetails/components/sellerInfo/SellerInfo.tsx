import React from 'react';
import PriceSection from './components/PriceSection';
import SellerProfile from './components/SellerProfile';
import ContactButtons from './components/ContactButtons';

interface SellerInfoProps {
  seller?: {
    name: string;
    phone: string;
    verified?: boolean;
    rating?: number;
  };
  price: number;
  carId: string;
}

const SellerInfo = ({ seller, price, carId }: SellerInfoProps) => {
  // If no seller data is provided, show a message
  if (!seller) {
    return (
      <div className="bg-white shadow-sm rounded-xl overflow-hidden sticky top-24">
        <div className="p-6 space-y-6">
          <PriceSection price={price} carId={carId} />
          <div className="h-px bg-gray-100" />
          <div className="text-center py-4 text-gray-500">
            გამყიდველის ინფორმაცია არ არის ხელმისაწვდომი
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-xl overflow-hidden sticky top-24">
      <div className="p-6 space-y-6">
        <PriceSection price={price} carId={carId} />
        <div className="h-px bg-gray-100" />
        <SellerProfile seller={seller} />
        <div className="h-px bg-gray-100" />
        <ContactButtons phone={seller.phone} />
      </div>
    </div>
  );
};

export default SellerInfo;