import React from 'react';
import { MapPin, Phone, MessageCircle, Eye, Calendar, Tag, Car as CarIcon, Package } from 'lucide-react';
import { Car } from '../../../../api/types/car.types';
import { usePrice } from '../../../../context/usePrice';
import { KeySpec } from '../../hooks/useCarDetails';
import ContactButtons from '../sellerInfo/components/ContactButtons';
import DealerInfoCard from '../CarPriceCard/DealerInfoCard';
import AutosalonInfoCard from '../CarPriceCard/AutosalonInfoCard';
import RegularUserInfoCard from '../CarPriceCard/RegularUserInfoCard';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../../i18n';

interface MobileCarInfoProps {
  car: Car;
  keySpecs: KeySpec[];
}

const MobileCarInfo: React.FC<MobileCarInfoProps> = ({ car, keySpecs }) => {
  const { formatPrice } = usePrice();
  const { t } = useTranslation([namespaces.carDetails, namespaces.common]);

  // Category mapping for translation
  const categoryMapping: { [key: string]: string } = {
    'სედანი': 'sedan',
    'ჯიპი': 'suv',
    'კუპე': 'coupe',
    'ჰეტჩბექი': 'hatchback',
    'უნივერსალი': 'wagon',
    'კაბრიოლეტი': 'convertible',
    'პიკაპი': 'pickup',
    'მინივენი': 'minivan',
    'ლიმუზინი': 'limousine',
    'კროსოვერი': 'crossover',
    'sedan': 'sedan',
    'suv': 'suv',
    'coupe': 'coupe',
    'hatchback': 'hatchback',
    'wagon': 'wagon',
    'convertible': 'convertible',
    'pickup': 'pickup',
    'minivan': 'minivan',
    'limousine': 'limousine',
    'crossover': 'crossover'
  };

  const getCategoryTranslation = (category: string | undefined): string => {
    if (!category) return t('common:notAvailable');
    const mappedCategory = categoryMapping[category.toLowerCase()] || categoryMapping[category];
    return mappedCategory ? t(`carDetails:categories.${mappedCategory}`, category) : category;
  };

  // Location mapping for translation
  const locationMapping: { [key: string]: string } = {
    'თბილისი': 'tbilisi',
    'ბათუმი': 'batumi',
    'ქუთაისი': 'kutaisi',
    'რუსთავი': 'rustavi',
    'გორი': 'gori',
    'ზუგდიდი': 'zugdidi',
    'ფოთი': 'poti',
    'ხაშური': 'khashuri',
    'სამტრედია': 'samtredia',
    'სენაკი': 'senaki',
    'საქართველო': 'georgia',
    'გერმანია': 'germany',
    'აშშ': 'usa',
    'იაპონია': 'japan',
    'დიდი ბრიტანეთი': 'uk',
    'საფრანგეთი': 'france',
    'იტალია': 'italy',
    'ესპანეთი': 'spain',
    'ნიდერლანდები': 'netherlands',
    'ჩინეთი': 'china',
    'კანადა': 'canada',
    'თურქეთი': 'turkey',
    'პოლონეთი': 'poland',
    'სომხეთი': 'armenia',
    'tbilisi': 'tbilisi',
    'batumi': 'batumi',
    'kutaisi': 'kutaisi',
    'rustavi': 'rustavi',
    'gori': 'gori',
    'zugdidi': 'zugdidi',
    'poti': 'poti',
    'khashuri': 'khashuri',
    'samtredia': 'samtredia',
    'senaki': 'senaki',
    'georgia': 'georgia',
    'germany': 'germany',
    'usa': 'usa',
    'japan': 'japan',
    'uk': 'uk',
    'france': 'france',
    'italy': 'italy',
    'spain': 'spain',
    'netherlands': 'netherlands',
    'china': 'china',
    'canada': 'canada',
    'turkey': 'turkey',
    'poland': 'poland',
    'armenia': 'armenia'
  };

  const getLocationTranslation = (location: string | undefined): string => {
    if (!location) return '';
    const mappedLocation = locationMapping[location.toLowerCase()] || locationMapping[location];
    return mappedLocation ? t(`carDetails:locations.${mappedLocation}`, location) : location;
  };

  // Helper function to determine seller type and render appropriate card
  const renderSellerInfo = () => {
    if (car.seller_type === 'dealer' && car.dealer) {
      return <DealerInfoCard dealer={car.dealer} authorPhone={car.author_phone} />;
    }
    
    if (car.seller_type === 'autosalon' && car.autosalon) {
      return <AutosalonInfoCard autosalon={car.autosalon} authorPhone={car.author_phone} />;
    }
    
    return <RegularUserInfoCard authorName={car.author_name} authorPhone={car.author_phone} />;
  };

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
                <span>{car.views_count || 0} {t('common:views')}</span>
              </div>
            </div>
          </div>
          
          <div className="price-badge text-xl sm:text-2xl font-bold text-primary bg-green-50 px-4 py-2 rounded-lg inline-block">
            {formatPrice(car.price || 0, car.currency as 'GEL' | 'USD')}
          </div>
        </div>
      </div>
      
      
      {/* Seller Info & Contact - დესკტოპური ვერსიის ანალოგი */}
      {renderSellerInfo()}
    </div>
  );
};

export default MobileCarInfo;
