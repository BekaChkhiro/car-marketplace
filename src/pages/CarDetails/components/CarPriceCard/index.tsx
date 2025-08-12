import React from 'react';
import { MapPin, Calendar, Tag, Car as CarIcon, Package, Eye } from 'lucide-react';
import { Car } from '../../../../api/types/car.types';
import { usePrice } from '../../../../context/usePrice';
import { KeySpec } from '../../hooks/useCarDetails';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../../i18n';
import DealerInfoCard from './DealerInfoCard';
import AutosalonInfoCard from './AutosalonInfoCard';
import RegularUserInfoCard from './RegularUserInfoCard';
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
    // English mappings
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
    // Georgian cities
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
    // Georgian countries
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
    // English mappings
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
    // Check if we have explicit seller_type from backend
    if (car.seller_type === 'dealer' && car.dealer) {
      return <DealerInfoCard dealer={car.dealer} authorPhone={car.author_phone} />;
    }
    
    if (car.seller_type === 'autosalon' && car.autosalon) {
      return <AutosalonInfoCard autosalon={car.autosalon} authorPhone={car.author_phone} />;
    }
    
    // For now, fallback to regular user until backend is updated
    return <RegularUserInfoCard authorName={car.author_name} authorPhone={car.author_phone} />;
  };

  return (
    <div className="sticky top-24 space-y-4">
      {/* Car Price Card */}
      <div className="bg-white rounded-xl shadow-md border border-green-100 car-detail-card overflow-hidden">
        {/* Car Title */}
        <div className="p-4 border-b border-green-100">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-xl font-bold text-gray-800 flex-1">
              {car.title || `${car.brand || ''} ${car.model || ''} ${car.year || ''}`}
            </h1>
            {/* Views count */}
            <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
              <Eye className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">{(car as any).views_count || 0}</span>
            </div>
          </div>
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
                <span className="text-xs text-gray-500 block">{t('carDetails:specs.brand')}</span>
                <span className="font-semibold text-gray-900">{car.brand || '-'}</span>
              </div>
            </div>

            {/* Model */}
            <div className="flex items-center p-3 bg-green-50/50 rounded-xl transition-all hover:bg-green-50 border border-green-100">
              <div className="bg-primary/10 p-2 rounded-lg mr-3">
                <Tag className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span className="text-xs text-gray-500 block">{t('carDetails:specs.model')}</span>
                <span className="font-semibold text-gray-900">{car.model || '-'}</span>
              </div>
            </div>

            {/* Category */}
            <div className="flex items-center p-3 bg-green-50/50 rounded-xl transition-all hover:bg-green-50 border border-green-100">
              <div className="bg-primary/10 p-2 rounded-lg mr-3">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span className="text-xs text-gray-500 block">{t('carDetails:specs.category')}</span>
                <span className="font-semibold text-gray-900">
                  {getCategoryTranslation(car.category_name) || getCategoryTranslation(car.specifications?.body_type)}
                </span>
              </div>
            </div>

            {/* Year */}
            <div className="flex items-center p-3 bg-green-50/50 rounded-xl transition-all hover:bg-green-50 border border-green-100">
              <div className="bg-primary/10 p-2 rounded-lg mr-3">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span className="text-xs text-gray-500 block">{t('carDetails:specs.year')}</span>
                <span className="font-semibold text-gray-900">{car.year || '-'}</span>
              </div>
            </div>
          </div>

          {/* Price with enhanced design */}
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">{t('carDetails:priceCard.price')}</h2>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-5 rounded-xl border border-green-200 shadow-md">
              <div className="flex justify-center items-center">
                <span className="text-4xl font-bold text-primary">
                  {formatPrice(price, car.currency as 'GEL' | 'USD')}
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
              <span className="text-xs text-gray-500 block">{t('carDetails:specs.location')}</span>
              <span className="font-semibold text-gray-900">
                {car.location ? (
                  <>
                    {getLocationTranslation(car.location.city)}
                    {car.location.country && `, ${getLocationTranslation(car.location.country)}`}
                  </>
                ) : '-'}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Seller Info & Contact - Conditional rendering based on seller type */}
      {renderSellerInfo()}


    </div>
  );
};

export default CarPriceCard;
