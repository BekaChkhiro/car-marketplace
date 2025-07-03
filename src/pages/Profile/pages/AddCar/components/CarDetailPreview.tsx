import React from 'react';
import { 
  Calendar, 
  Gauge, 
  Car, 
  Tag, 
  MapPin,
  DollarSign,
  Bookmark,
  Info
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../../../i18n';
import { NewCarFormData } from '../types';

interface CarDetailPreviewProps {
  formData: NewCarFormData;
}

const CarDetailPreview: React.FC<CarDetailPreviewProps> = ({
  formData
}) => {
  const { t } = useTranslation([namespaces.common]);
  
  // Format price with commas
  const formattedPrice = formData.price ? formData.price.toLocaleString() : '0';
  
  // Currency symbol
  const currencySymbol = formData.currency === 'GEL' ? '₾' : '$';

  // Location display
  const locationDisplay = formData.location?.is_transit 
    ? t('common:inTransit', 'ტრანზიტში')
    : formData.location?.city || formData.location?.country || '';

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border border-green-100">
      {/* Title */}
      <h1 className="text-xl font-bold text-gray-800 mb-3">{formData.title || t('common:carTitle', 'განცხადების სათაური')}</h1>
      
      {/* Main specs grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Brand */}
        <div className="spec-item flex items-center p-2 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
          <div className="spec-item-icon mr-3 text-primary">
            <Car className="w-5 h-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-600">{t('common:brand', 'მარკა')}</span>
            <span className="font-medium text-primary">{formData.brand_id || t('common:notSelected', 'არჩეული არ არის')}</span>
          </div>
        </div>
        
        {/* Model */}
        <div className="spec-item flex items-center p-2 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
          <div className="spec-item-icon mr-3 text-primary">
            <Bookmark className="w-5 h-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-600">{t('common:model', 'მოდელი')}</span>
            <span className="font-medium text-primary">{formData.model || t('common:notSelected', 'არჩეული არ არის')}</span>
          </div>
        </div>
        
        {/* Category */}
        <div className="spec-item flex items-center p-2 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
          <div className="spec-item-icon mr-3 text-primary">
            <Info className="w-5 h-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-600">{t('common:category', 'კატეგორია')}</span>
            <span className="font-medium text-primary">{formData.category_id || t('common:notSelected', 'არჩეული არ არის')}</span>
          </div>
        </div>
        
        {/* Year */}
        <div className="spec-item flex items-center p-2 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
          <div className="spec-item-icon mr-3 text-primary">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-600">{t('common:year', 'წელი')}</span>
            <span className="font-medium text-primary">{formData.year || t('common:notSelected', 'არჩეული არ არის')}</span>
          </div>
        </div>
        
        {/* Price - with special styling */}
        <div className="spec-item flex items-center p-2 bg-primary bg-opacity-10 rounded-lg hover:bg-primary hover:bg-opacity-20 transition-colors">
          <div className="spec-item-icon mr-3 text-primary">
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-600">{t('common:price', 'ფასი')}</span>
            <span className="font-medium text-primary text-lg">{formattedPrice} {currencySymbol}</span>
          </div>
        </div>
        
        {/* Location */}
        <div className="spec-item flex items-center p-2 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
          <div className="spec-item-icon mr-3 text-primary">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-600">{t('common:location', 'მდებარეობა')}</span>
            <span className="font-medium text-primary">{locationDisplay || t('common:notSelected', 'არჩეული არ არის')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailPreview;
