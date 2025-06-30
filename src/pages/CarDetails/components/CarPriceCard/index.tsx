import React, { useState } from 'react';
import { MapPin, Phone, MessageCircle, Calendar, Shield, Gauge, Fuel, User, Award, Check, Heart, Share2, AlertCircle, ChevronDown, ChevronUp, Mail } from 'lucide-react';
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
  const [showContactOptions, setShowContactOptions] = useState(false);
  const [showFinanceInfo, setShowFinanceInfo] = useState(false);
  const { t } = useTranslation([namespaces.carDetails, namespaces.common]);

  // Format price (no discount available in the Car type)
  const price = car.price || 0;
  
  // Calculate estimated monthly payment (example calculation)
  const estimatedMonthlyPayment = (price / 60).toFixed(0); // 5-year loan

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
            
            {car.featured && (
              <div className="bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center shadow-sm">
                <Award className="w-4 h-4 mr-1.5" />
                VIP
              </div>
            )}
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
          
          {/* Finance Info - Collapsible */}
          <div className="mt-4 border-t border-green-50 pt-3">
            <button 
              className="w-full flex justify-between items-center text-left focus:outline-none"
              onClick={() => setShowFinanceInfo(!showFinanceInfo)}
              aria-expanded={showFinanceInfo}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center mr-2">
                  <AlertCircle className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium text-gray-800">{t('carDetails:specs.estimatedLoan', 'სავარაუდო განვადება')}</span>
              </div>
              {showFinanceInfo ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            
            {showFinanceInfo && (
              <div className="mt-3 p-3 bg-green-50 rounded-lg animate-fade-in">
                <div className="mb-2">
                  <div className="text-sm text-gray-600">სავარაუდო თვიური გადახდა</div>
                  <div className="text-lg font-semibold text-primary">{formatPrice(parseInt(estimatedMonthlyPayment))}/თვე</div>
                </div>
                <div className="text-xs text-gray-500">
                  * ეს არის მხოლოდ სავარაუდო გადახდა. ზუსტი გადახდის პირობებისთვის დაგვიკავშირდით.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Seller Info & Contact */}
      <div className="bg-white rounded-xl shadow-md border border-green-100 car-detail-card overflow-hidden">
        {/* Seller Header */}
        <div className="p-4 border-b border-green-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3 shadow-sm">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="font-medium text-gray-800 flex items-center">
                {car.author_name || 'მანქანის მფლობელი'}
                <Check className="w-4 h-4 text-primary ml-1" />
              </div>
              <div className="text-sm text-gray-500 flex items-center">
                <div className="flex">
                  {[1, 2, 3, 4].map((i) => (
                    <Award key={i} className="w-3 h-3 mr-1 text-yellow-500" />
                  ))}
                  <Award className="w-3 h-3 mr-1 text-gray-300" />
                </div>
                <span className="ml-1">4.5</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Primary Contact Button */}
        <div className="p-4">
          <button 
            className="w-full bg-primary hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
            onClick={() => setShowContactOptions(!showContactOptions)}
            aria-expanded={showContactOptions}
          >
            <Phone className="w-5 h-5" />
            <span>{t('carDetails:specs.contact')}</span>
            {showContactOptions ? (
              <ChevronUp className="w-5 h-5 ml-1" />
            ) : (
              <ChevronDown className="w-5 h-5 ml-1" />
            )}
          </button>
          
          {/* Contact Options */}
          {showContactOptions && (
            <div className="mt-3 grid grid-cols-1 gap-3 animate-fade-in">
              <a 
                href={`tel:${car.author_phone || '+995555 55 55 55'}`} 
                className="flex items-center gap-2 bg-green-50 text-primary py-3 px-4 rounded-lg font-medium hover:bg-green-100 transition-colors border border-green-100"
              >
                <Phone className="w-5 h-5" />
                <span>{t('carDetails:specs.call', 'დარეკვა')}: {car.author_phone || '+995557409798'}</span>
              </a>
              
              <a 
                href={`sms:${car.author_phone || '+995557409798'}`} 
                className="flex items-center gap-2 bg-green-50 text-primary py-3 px-4 rounded-lg font-medium hover:bg-green-100 transition-colors border border-green-100"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{t('carDetails:specs.sendMessage', 'მესიჯის გაგზავნა')}</span>
              </a>
              
              <a 
                href="mailto:contact@example.com" 
                className="flex items-center gap-2 bg-green-50 text-primary py-3 px-4 rounded-lg font-medium hover:bg-green-100 transition-colors border border-green-100"
              >
                <Mail className="w-5 h-5" />
                <span>{t('carDetails:specs.sendEmail', 'ელ-ფოსტის გაგზავნა')}</span>
              </a>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="p-4 pt-0 grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-green-100 hover:bg-green-50 transition-colors">
            <Heart className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">{t('carDetails:specs.favorite', 'ფავორიტი')}</span>
          </button>
          
          <button className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-green-100 hover:bg-green-50 transition-colors">
            <Share2 className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">{t('carDetails:specs.shareButton')}</span>
          </button>
        </div>
      </div>
      
      {/* Safety Tips */}
      <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100 text-sm">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <p className="font-medium text-yellow-800 mb-1">{t('carDetails:specs.safetyTips', 'უსაფრთხოების რჩევები')}</p>
            <p className="text-yellow-700">{t('carDetails:specs.safetyTipsText', 'მანქანის ყიდვამდე შეამოწმეთ გამყიდველის რეპუტაცია და დოკუმენტაცია.')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarPriceCard;
