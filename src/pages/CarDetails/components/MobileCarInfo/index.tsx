import React from 'react';
import { MapPin, Phone, MessageCircle } from 'lucide-react';
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
            
            {/* Location if available */}
            {car.location && (
              <div className="flex items-center mt-1 text-gray-600 text-sm">
                <MapPin className="w-4 h-4 mr-1 text-primary" />
                <span>
                  {car.location.city || ''}
                  {car.location.country && `, ${car.location.country}`}
                </span>
              </div>
            )}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <a href="tel:+995555123456" className="flex items-center justify-center gap-2 bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors">
            <Phone className="w-5 h-5" />
            <span>{t('carDetails:priceCard.callSeller')}</span>
          </a>
          <a href="sms:+995555123456" className="flex items-center justify-center gap-2 bg-green-50 text-primary py-3 px-4 rounded-lg font-medium border border-primary hover:bg-green-100 transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span>{t('carDetails:priceCard.messageSeller')}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default MobileCarInfo;
