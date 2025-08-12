import React from 'react';
import { FileText } from 'lucide-react';
import { Car } from '../../../../api/types/car.types';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../../i18n';

interface MobileCarDescriptionProps {
  car: Car;
}

const MobileCarDescription: React.FC<MobileCarDescriptionProps> = ({ car }) => {
  const { t, i18n } = useTranslation([namespaces.carDetails, namespaces.common]);

  // Get the appropriate description based on current language
  const currentLang = i18n.language;
  let description = '';
  
  if (currentLang === 'ka') {
    description = car.description_ka || '';
  } else if (currentLang === 'en') {
    description = car.description_en || car.description_ka || '';
  } else if (currentLang === 'ru') {
    description = car.description_ru || car.description_ka || '';
  } else {
    description = car.description_ka || '';
  }

  // Don't render if no description
  if (!description || description.trim() === '') {
    return null;
  }

  return (
    <div className="block md:hidden mt-4 bg-white rounded-xl shadow-md p-4 sm:p-5 border border-green-100 car-detail-card">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 border-b border-green-100 pb-2 flex items-center">
        <FileText className="w-5 h-5 mr-2 text-primary" />
        {t('carDetails:specs.description')}
      </h3>
      
      <div className="bg-green-50/30 rounded-lg p-4 border border-green-100/50">
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
          {description}
        </p>
      </div>
    </div>
  );
};

export default MobileCarDescription;