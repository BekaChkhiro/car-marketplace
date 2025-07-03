import React from 'react';
import { MapPin, Phone, Calendar, Shield, Gauge, Fuel, User, Check, Heart } from 'lucide-react';
import { Car } from '../../../../api/types/car.types';
import { usePrice } from '../../../../context/usePrice';
import { KeySpec } from '../../hooks/useCarDetails';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../../i18n';
import './styles.css';

interface CarPriceCardProps {
  car: Car;
  keySpecs: KeySpec[];
}

const CarPriceCard: React.FC<CarPriceCardProps> = ({ car, keySpecs }) => {
  const { formatPrice } = usePrice();
  const { t } = useTranslation([namespaces.carDetails, namespaces.common]);

  // Format price (no discount available in the Car type)
  const price = car.price || 0;

  return (
    <div className="sticky top-24 space-y-4">
      {/* Car Price Card */}
      <div className="bg-white rounded-xl shadow-md border border-green-100 car-detail-card overflow-hidden">
        {/* Price Header */}
        <div className="bg-green-50 p-4 border-b border-green-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{t('carDetails:specs.price')}</h2>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(price)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Car Info */}
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-800 mb-3">
            {car.title || `${car.brand || ''} ${car.model || ''} ${car.year || ''}`}
          </h1>
          
          {/* Key Specs */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {keySpecs.map((spec, index) => (
              <div key={index} className="spec-item flex items-center p-2 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <div className="spec-item-icon mr-3 text-primary">
                  {spec.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-600">{spec.label}</span>
                  <span className="font-medium text-primary">{spec.value}</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Location if available */}
          {car.location && (
            <div className="flex items-center py-2 text-gray-700">
              <MapPin className="w-5 h-5 mr-2 text-primary" />
              <span className="font-medium">
                {car.location.city || ''}
                {car.location.country && `, ${car.location.country}`}
              </span>
            </div>
          )}
          

        </div>
      </div>
      
      {/* Seller Info & Contact */}
      <div className="bg-white rounded-xl shadow-md border border-green-100 car-detail-card overflow-hidden">
        {/* Contact Header */}
        <div className="p-4 border-b border-green-100">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">გამყიდველთან დაკავშირება</h3>
        </div>
        
        <div className="p-4">
          {/* Author Name */}
          <div className="mb-3">
            <h4 className="text-sm text-gray-600 mb-1">ავტორი:</h4>
            <p className="text-base font-medium text-gray-800">
              {car.author_name || 'მანქანის მფლობელი'}
            </p>
          </div>
          
          {/* Seller Phone */}
          <div className="mb-4">
            <h4 className="text-sm text-gray-600 mb-1">ტელეფონი:</h4>
            <p className="text-base font-medium text-primary">
              {car.author_phone || '+995557409798'}
            </p>
          </div>
          
          {/* Call Button */}
          <a 
            href={`tel:${car.author_phone || '+995555 55 55 55'}`} 
            className="w-full bg-primary hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Phone className="w-5 h-5" />
            <span>{car.author_phone || '+995555 55 55 55'}</span>
          </a>
        </div>
        
        {/* Favorite Button */}
        <div className="p-4 pt-0">
          <button className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-green-100 hover:bg-green-50 transition-colors">
            <Heart className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">{t('carDetails:specs.favorite', 'ფავორიტი')}</span>
          </button>
        </div>
      </div>
      

    </div>
  );
};

export default CarPriceCard;
