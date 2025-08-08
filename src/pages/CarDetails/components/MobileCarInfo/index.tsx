import React from 'react';
import { MapPin, Phone, MessageCircle, Eye } from 'lucide-react';
import { Car } from '../../../../api/types/car.types';
import { usePrice } from '../../../../context/usePrice';
import { KeySpec } from '../../hooks/useCarDetails';
import ContactButtons from '../sellerInfo/components/ContactButtons';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../../i18n';

interface MobileCarInfoProps {
  car: Car;
  keySpecs: KeySpec[];
}

const MobileCarInfo: React.FC<MobileCarInfoProps> = ({ car, keySpecs }) => {
  const { formatPrice } = usePrice();
  const { t } = useTranslation([namespaces.carDetails, namespaces.common]);

  return (
    <div className="block md:hidden mt-4 space-y-4">
      {/* Title and Price */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 border border-green-100 car-detail-card">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
          <div className="mb-3 sm:mb-0">
            <h1 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
              {car.title || `${car.brand || ''} ${car.model || ''} ${car.year || ''}`}
            </h1>
            
            {/* Location and views */}
            <div className="flex items-center gap-4 mt-1 text-gray-600 text-sm">
              {car.location && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-primary" />
                  <span>
                    {car.location.city || ''}
                    {car.location.country && `, ${car.location.country}`}
                  </span>
                </div>
              )}
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1 text-primary" />
                <span>{(car as any).views_count || 0} {t('common:views')}</span>
              </div>
            </div>
          </div>
          
          <div className="price-badge text-xl sm:text-2xl font-bold text-primary bg-green-50 px-4 py-2 rounded-lg inline-block">
            {formatPrice(car.price || 0)}
          </div>
        </div>
      </div>
      
      {/* Key Specs */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 border border-green-100 car-detail-card">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 border-b border-green-100 pb-2">
          {t('common:mainSpecifications')}
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {keySpecs.map((spec, index) => (
            <div key={index} className="spec-item flex items-center p-2 sm:p-3 bg-green-50 rounded-lg">
              <div className="spec-item-icon mr-3">
                {spec.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-600">{spec.label}</span>
                <span className="font-medium text-primary text-sm sm:text-base">{spec.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Mobile Contact Buttons */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 border border-green-100 car-detail-card">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 border-b border-green-100 pb-2">
          {t('carDetails:priceCard.contactSeller')}
        </h3>
        
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
            {car.author_phone || '+995555123456'}
          </p>
        </div>
        
        {/* Call Button */}
        <a 
          href={`tel:${car.author_phone || '+995555123456'}`}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
        >
          <Phone className="w-5 h-5" />
          <span>{car.author_phone || '+995555123456'}</span>
        </a>
      </div>
    </div>
  );
};

export default MobileCarInfo;
