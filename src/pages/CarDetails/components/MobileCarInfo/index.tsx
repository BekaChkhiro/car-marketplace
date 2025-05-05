import React from 'react';
import { MapPin } from 'lucide-react';
import { Car } from '../../../../api/types/car.types';
import { usePrice } from '../../../../context/usePrice';
import { KeySpec } from '../../hooks/useCarDetails';
import ContactButtons from '../sellerInfo/components/ContactButtons';

interface MobileCarInfoProps {
  car: Car;
  keySpecs: KeySpec[];
}

const MobileCarInfo: React.FC<MobileCarInfoProps> = ({ car, keySpecs }) => {
  const { formatPrice } = usePrice();

  return (
    <div className="block lg:hidden mt-4 space-y-4">
      {/* Title and Price */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h1 className="text-xl font-bold text-gray-800 mb-2">
          {car.title || `${car.brand || ''} ${car.model || ''} ${car.year || ''}`}
        </h1>
        <div className="text-2xl font-bold text-primary">
          {formatPrice(car.price || 0)}
        </div>
        
        {/* Location if available */}
        {car.location && (
          <div className="flex items-center mt-3 text-gray-600 text-sm">
            <MapPin className="w-3 h-3 mr-1" />
            <span>
              {car.location.city || ''}
              {car.location.country && `, ${car.location.country}`}
            </span>
          </div>
        )}
      </div>
      
      {/* Key Specs */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="grid grid-cols-2 gap-4">
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
      </div>
      
      {/* Mobile Contact Buttons */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <ContactButtons phone="+995 555 123456" />
      </div>
    </div>
  );
};

export default MobileCarInfo;
