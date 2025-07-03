import React from 'react';
import { MapPin, Phone, Calendar, Tag, Car as CarIcon, Package, Heart, User } from 'lucide-react';
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
        {/* Car Title */}
        <div className="p-4 border-b border-green-100">
          <h1 className="text-xl font-bold text-gray-800">
            {car.title || `${car.brand || ''} ${car.model || ''} ${car.year || ''}`}
          </h1>
        </div>
        
        {/* Car Details */}
        <div className="p-5 space-y-6">
          {/* Main Specs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Brand */}
            <div className="flex items-center p-3 bg-green-50/50 rounded-xl transition-all hover:bg-green-50 border border-green-100">
              <div className="bg-primary/10 p-2 rounded-lg mr-3">
                <CarIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span className="text-xs text-gray-500 block">{t('carDetails:specs.brand', 'მარკა')}</span>
                <span className="font-semibold text-gray-900">{car.brand || '-'}</span>
              </div>
            </div>
            
            {/* Model */}
            <div className="flex items-center p-3 bg-green-50/50 rounded-xl transition-all hover:bg-green-50 border border-green-100">
              <div className="bg-primary/10 p-2 rounded-lg mr-3">
                <Tag className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span className="text-xs text-gray-500 block">{t('carDetails:specs.model', 'მოდელი')}</span>
                <span className="font-semibold text-gray-900">{car.model || '-'}</span>
              </div>
            </div>
            
            {/* Category */}
            <div className="flex items-center p-3 bg-green-50/50 rounded-xl transition-all hover:bg-green-50 border border-green-100">
              <div className="bg-primary/10 p-2 rounded-lg mr-3">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span className="text-xs text-gray-500 block">{t('carDetails:specs.category', 'კატეგორია')}</span>
                <span className="font-semibold text-gray-900">{(car as any).category || car.specifications?.body_type || '-'}</span>
              </div>
            </div>
            
            {/* Year */}
            <div className="flex items-center p-3 bg-green-50/50 rounded-xl transition-all hover:bg-green-50 border border-green-100">
              <div className="bg-primary/10 p-2 rounded-lg mr-3">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span className="text-xs text-gray-500 block">{t('carDetails:specs.year', 'გამოშვების წელი')}</span>
                <span className="font-semibold text-gray-900">{car.year || '-'}</span>
              </div>
            </div>
          </div>
          
          {/* Price with enhanced design */}
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">{t('carDetails:specs.price', 'ფასი')}</h2>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-5 rounded-xl border border-green-200 shadow-md">
              <div className="flex justify-center items-center">
                <span className="text-4xl font-bold text-primary">
                  {formatPrice(price)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Location with enhanced design */}
          <div className="flex items-center p-3 bg-green-50/50 rounded-xl border border-green-100 mt-2">
            <div className="bg-primary/10 p-2 rounded-lg mr-3">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="text-xs text-gray-500 block">{t('carDetails:specs.location', 'მდებარეობა')}</span>
              <span className="font-semibold text-gray-900">
                {car.location ? (
                  <>
                    {car.location.city || ''}
                    {car.location.country && `, ${car.location.country}`}
                  </>
                ) : '-'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Seller Info & Contact */}
      <div className="bg-white rounded-xl shadow-md border border-green-100 car-detail-card overflow-hidden">
        {/* Contact Header */}
        <div className="p-4 border-b border-green-100">
          <h3 className="text-lg font-semibold text-gray-800">გამყიდველთან დაკავშირება</h3>
        </div>
        
        <div className="p-5 space-y-4">
          {/* Author Name */}
          <div className="flex items-center p-3 bg-green-50/50 rounded-xl transition-all hover:bg-green-50 border border-green-100">
            <div className="bg-primary/10 p-2 rounded-lg mr-3">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="text-xs text-gray-500 block">ავტორი</span>
              <span className="font-semibold text-gray-900">
                {car.author_name || 'მანქანის მფლობელი'}
              </span>
            </div>
          </div>
          
          {/* Seller Phone */}
          <div className="flex items-center p-3 bg-green-50/50 rounded-xl transition-all hover:bg-green-50 border border-green-100">
            <div className="bg-primary/10 p-2 rounded-lg mr-3">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="text-xs text-gray-500 block">ტელეფონი</span>
              <span className="font-semibold text-primary">
                {car.author_phone || '+995557409798'}
              </span>
            </div>
          </div>
          
          {/* Call Button */}
          <a 
            href={`tel:${car.author_phone || '+995555 55 55 55'}`} 
            className="w-full bg-primary hover:bg-green-600 text-white py-3 px-4 rounded-xl font-medium transition-colors shadow-md flex items-center justify-center gap-2 mt-2"
          >
            <Phone className="w-5 h-5" />
            <span>{car.author_phone || '+995555 55 55 55'}</span>
          </a>
          
          {/* Favorite Button */}
          <button className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-green-200 hover:bg-green-50 transition-colors mt-2">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              <span className="font-medium">{t('carDetails:specs.favorite', 'ფავორიტი')}</span>
            </div>
          </button>
        </div>
      </div>
      

    </div>
  );
};

export default CarPriceCard;
