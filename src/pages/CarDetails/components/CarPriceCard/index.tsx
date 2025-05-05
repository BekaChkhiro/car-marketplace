import React from 'react';
import { MapPin } from 'lucide-react';
import { Car } from '../../../../api/types/car.types';
import { usePrice } from '../../../../context/usePrice';
import { KeySpec } from '../../hooks/useCarDetails';
import SellerInfo from '../sellerInfo/SellerInfo';

interface CarPriceCardProps {
  car: Car;
  keySpecs: KeySpec[];
}

const CarPriceCard: React.FC<CarPriceCardProps> = ({ car, keySpecs }) => {
  const { formatPrice } = usePrice();

  return (
    <div className="sticky top-24 space-y-6">
      {/* Car Title and Price */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          {car.title || `${car.brand || ''} ${car.model || ''} ${car.year || ''}`}
        </h1>
        <div className="text-3xl font-bold text-primary mb-4">
          {formatPrice(car.price || 0)}
        </div>
        
        {/* Key Specs */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          {keySpecs.map((spec, index) => (
            <div key={index} className="flex flex-col">
              <div className="flex items-center text-gray-500 mb-1">
                {spec.icon}
                <span className="text-xs ml-1">{spec.label}</span>
              </div>
              <span className="font-medium">{spec.value}</span>
            </div>
          ))}
        </div>
        
        {/* Location if available */}
        {car.location && (
          <div className="flex items-center mt-6 text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>
              {car.location.city || ''}
              {car.location.country && `, ${car.location.country}`}
            </span>
          </div>
        )}
      </div>
      
      {/* Seller Info */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <SellerInfo 
          seller={{
            name: 'Car Owner',
            phone: '+995 555 123456',
            verified: true,
            rating: 4.5
          }}
          price={car.price || 0}
          carId={car.id?.toString() || ''}
        />
      </div>
    </div>
  );
};

export default CarPriceCard;
