import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Car as LocalCar, Category as LocalCategory } from '../../../../types/car';
import { Car, Category } from '../../../../api/types/car.types';
import { Car as CarIcon, Gauge, Palette, Shield, Wrench, MapPin, Check, X, Tag, User, Phone } from 'lucide-react';
import carService from '../../../../api/services/carService';
import CarHeader from './components/CarHeader';
import { namespaces } from '../../../../i18n';

// CSS animations and styles
const fadeInAnimation = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-in {
    animation: fadeIn 0.5s ease-out forwards;
    opacity: 0;
  }
`;

const pulseAnimation = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  .pulse {
    animation: pulse 2s infinite;
  }
`;

const shimmerAnimation = `
  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }
  .shimmer {
    background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%);
    background-size: 1000px 100%;
    animation: shimmer 2s infinite linear;
  }
`;

const cardStyle = "bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:border-green-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg relative overflow-hidden";
const sectionHeadingStyle = "text-xl font-semibold mb-4 text-gray-800 border-b pb-3 border-gray-100 flex items-center relative overflow-hidden shimmer";
const specItemStyle = "flex justify-between py-3 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 rounded-lg px-4 transition-all duration-300 border border-transparent hover:border-green-200 mb-1 spec-item-hover cursor-pointer";
const specGroupStyle = "space-y-2 bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:bg-gradient-to-br hover:from-white hover:to-green-50 border border-gray-100 hover:border-green-200";
const specLabelStyle = "font-medium text-gray-800 flex items-center";
const specValueStyle = "text-gray-600 font-semibold transition-all duration-300 hover:text-green-700";
const iconBaseStyle = "mr-2";

interface CarInfoProps {
  car: Car; // Using the API Car type
}

const CarInfo: React.FC<CarInfoProps> = ({ car }) => {
  const { t } = useTranslation([namespaces.common, namespaces.carDetails]);
  const [category, setCategory] = useState<LocalCategory | null>(null);

  // დებაგ ლოგები - მანქანის ობიექტის სრული სტრუქტურა
  console.log('CarInfo - Full car object:', JSON.stringify(car, null, 2));
  console.log('CarInfo - category_id:', car.category_id, 'type:', typeof car.category_id);
  console.log('CarInfo - category_name:', car.category_name, 'type:', typeof car.category_name);
  
  // თუ არსებობს category_name, პირდაპირ გამოვიყენოთ ის
  useEffect(() => {
    if (car.category_name) {
      setCategory({
        id: String(car.category_id),
        name: car.category_name
      });
      console.log('Using direct category_name:', car.category_name);
    }
  }, [car.category_name, car.category_id]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        console.log('[CarInfo] Fetching category for category_id:', car.category_id, 'Type:', typeof car.category_id);
        
        // If we already have a category name directly from the car object, use it
        if (car.category_name) {
          console.log('[CarInfo] Using direct category_name from car object:', car.category_name);
          setCategory({
            id: String(car.category_id),
            name: car.category_name
          });
          return; // Exit early if we have the category name
        }
        
        // მოკ კატეგორიები - ეს არის იგივე რაც carService.ts-ში
        const mockCategories = [
          { id: 1, name: 'სედანი' },
          { id: 2, name: 'ჯიპი' },
          { id: 3, name: 'კუპე' },
          { id: 4, name: 'კაბრიოლეტი' },
          { id: 5, name: 'უნივერსალი' },
          { id: 6, name: 'ჰეჩბეგი' },
          { id: 7, name: 'პიკაპი' },
          { id: 8, name: 'მინივენი' },
          { id: 9, name: 'მიკროავტობუსი' },
          { id: 10, name: 'სპორტული' }
        ];
        
        if (car.category_id) {
          // ჯერ ვცადოთ API-დან კატეგორიების მიღება
          try {
            console.log('[CarInfo] Fetching categories from API');
            const categories = await carService.getCategories();
            console.log('[CarInfo] API categories received:', categories.length);
            
            // Convert category_id to both string and number for comparison
            const categoryIdString = String(car.category_id);
            const categoryIdNumber = parseInt(categoryIdString, 10);
            
            console.log('[CarInfo] Looking for category with ID:', categoryIdString, 'or', categoryIdNumber);
            
            // Try multiple comparison methods to ensure we find the category
            let foundCategory = categories.find(cat => {
              const catIdString = String(cat.id);
              const catIdNumber = parseInt(catIdString, 10);
              
              const matchesString = catIdString === categoryIdString;
              const matchesNumber = catIdNumber === categoryIdNumber;
              
              if (matchesString || matchesNumber) {
                console.log(`[CarInfo] Found matching category: ${cat.name} (ID: ${cat.id})`);
                return true;
              }
              return false;
            });
            
            if (foundCategory) {
              // Convert API Category type to local Category type
              const localCategory = {
                id: String(foundCategory.id),
                name: foundCategory.name
              };
              console.log('[CarInfo] Setting category from API:', localCategory);
              setCategory(localCategory);
              return; // API-დან კატეგორია ნაპოვნია, გამოვდივართ ფუნქციიდან
            } else {
              console.log('[CarInfo] No matching category found in API results');
            }
          } catch (apiError) {
            console.error('[CarInfo] Error fetching categories from API:', apiError);
            // API შეცდომის შემთხვევაში გადავდივართ მოკ კატეგორიებზე
          }
          
          // თუ API-დან ვერ მივიღეთ კატეგორია, ვიყენებთ მოკ კატეგორიებს
          console.log('[CarInfo] Falling back to mock categories');
          
          // ვეძებთ კატეგორიას მოკ მონაცემებში - ვცდით ორივე ტიპის შედარებას
          const categoryIdString = String(car.category_id);
          const categoryIdNumber = parseInt(categoryIdString, 10);
          
          const foundMockCategory = mockCategories.find(cat => {
            const catIdString = String(cat.id);
            const catIdNumber = parseInt(catIdString, 10);
            return catIdString === categoryIdString || catIdNumber === categoryIdNumber;
          });
          
          if (foundMockCategory) {
            console.log('[CarInfo] Found matching mock category:', foundMockCategory);
            const localCategory = {
              id: String(foundMockCategory.id),
              name: foundMockCategory.name
            };
            setCategory(localCategory);
          } else {
            console.log('[CarInfo] Category not found in mock data for ID:', car.category_id);
            
            // Fallback: If we can't find the category, create a placeholder with the ID
            setCategory({
              id: String(car.category_id),
              name: `კატეგორია ${car.category_id}`
            });
          }
        } else {
          console.log('[CarInfo] No category_id provided in car object');
        }
      } catch (error) {
        console.error('[CarInfo] Error in fetchCategory:', error);
        // Final fallback - create a generic category
        setCategory({
          id: car.category_id ? String(car.category_id) : '0',
          name: 'უცნობი კატეგორია'
        });
      }
    };

    fetchCategory();
  }, [car.category_id, car.category_name]);
  
  // Add animation styles
  useEffect(() => {
    // Create style element
    const styleElement = document.createElement('style');
    styleElement.innerHTML = fadeInAnimation + pulseAnimation + shimmerAnimation;
    document.head.appendChild(styleElement);
    
    // Add animation classes to elements
    const sections = document.querySelectorAll('.car-section');
    sections.forEach((section, index) => {
      setTimeout(() => {
        section.classList.add('fade-in');
      }, index * 150);
    });
    
    // Cleanup function
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Helper function to check if a specification value should be displayed
  const shouldDisplaySpec = (value: any): boolean => {
    if (value === undefined || value === null) return false;
    if (typeof value === 'string' && value.trim() === '') return false;
    return true;
  };

  // Helper function to format boolean values with icons
  const formatBoolean = (value: boolean | undefined) => {
    if (value === undefined) return null;
    return value ? 
      <span className="flex items-center text-green-600"><Check size={16} className="mr-1" /> {t('carDetails:specs.yes')}</span> : 
      <span className="flex items-center text-red-500"><X size={16} className="mr-1" /> {t('carDetails:specs.no')}</span>;
  };

  // Helper function to translate drive type
  const translateDriveType = (driveType: string | undefined) => {
    if (!driveType) return '';
    
    switch(driveType.toLowerCase()) {
      case 'front':
      case 'fwd':
        return t('carDetails:specs.front');
      case 'rear':
      case 'rwd':
        return t('carDetails:specs.rear');
      case '4x4':
      case 'awd':
      case 'all wheel drive':
        return '4x4';
      default:
        return driveType;
    }
  };

  // Helper function to translate steering wheel position
  const translateSteeringWheel = (steeringWheel: string | undefined) => {
    if (!steeringWheel) return '';
    
    switch(steeringWheel.toLowerCase()) {
      case 'left':
        return t('carDetails:specs.left');
      case 'right':
        return t('carDetails:specs.right');
      default:
        return steeringWheel;
    }
  };

  return (
    <div className="space-y-8">
      {/* Car Header with Title and Actions */}
      <CarHeader
        make={car.brand}
        model={car.model}
        year={car.year}
        price={car.price}
        carId={car.id}
      />

      {/* Author Information */}
      <div className={`${cardStyle} car-section`}>
        <h2 className={sectionHeadingStyle}>
          <User size={18} className="mr-2 text-blue-600" />
          {t('carDetails:specs.authorInfo')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center">
            <User size={18} className="mr-3 text-gray-500" />
            <div>
              <span className="text-sm text-gray-500">{t('carDetails:specs.name')}</span>
              <p className="text-lg font-medium text-gray-800">
                {car.author_name}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <Phone size={18} className="mr-3 text-gray-500" />
            <div>
              <span className="text-sm text-gray-500">{t('carDetails:specs.phone')}</span>
              <p className="text-lg font-medium text-gray-800">
                {car.author_phone}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className={`${cardStyle} car-section`}>
        <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-r from-blue-50 to-green-50 rounded-full -mr-12 -mt-12 sm:-mr-16 sm:-mt-16 opacity-30 z-0"></div>
        <h2 className={sectionHeadingStyle}>
          <CarIcon size={18} className="mr-2 text-blue-600" />
          {t('carDetails:specs.generalInfo')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-6">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm text-gray-500">{t('carDetails:specs.brand')}</span>
              <span className="text-base sm:text-xl font-bold text-gray-800">{car.brand}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm text-gray-500">{t('carDetails:specs.model')}</span>
              <span className="text-base sm:text-xl font-bold text-gray-800">{car.model}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm text-gray-500">{t('carDetails:specs.year')}</span>
              <span className="text-base sm:text-xl font-bold text-gray-800">{car.year}</span>
            </div>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm text-gray-500">{t('carDetails:specs.price')}</span>
              <span className="text-base sm:text-xl font-bold text-blue-600">
                {new Intl.NumberFormat('ka-GE', { style: 'currency', currency: car.currency || 'GEL' }).format(car.price)}
              </span>
            </div>
            {category && (
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm text-gray-500">{t('carDetails:specs.category')}</span>
                <span className="text-base sm:text-xl font-bold text-gray-800">{category.name}</span>
              </div>
            )}
            {car.featured && (
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full inline-flex items-center w-fit mt-1 sm:mt-2">
                <Shield size={14} className="mr-1" />
                <span className="text-sm sm:text-base font-semibold">VIP</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div className={`${cardStyle} car-section`} style={{animationDelay: '0.2s'}}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-r from-green-50 to-blue-50 rounded-full -mr-16 -mt-16 opacity-30 z-0"></div>
        <h2 className={sectionHeadingStyle}>
          <Wrench size={20} className="mr-2 text-green-600" />
          {t('carDetails:specs.specifications')}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={specGroupStyle}>
            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
              <Gauge size={18} className="mr-2 text-blue-500" />
              {t('carDetails:specs.technicalSpecs')}
            </h3>
            {shouldDisplaySpec(car.specifications?.fuel_type) && (
              <div className={specItemStyle}>
                <div className={specLabelStyle}>{t('carDetails:specs.fuel')}</div>
                <div className={specValueStyle}>{car.specifications?.fuel_type}</div>
              </div>
            )}
            {shouldDisplaySpec(car.specifications?.transmission) && (
              <div className={specItemStyle}>
                <div className={specLabelStyle}>{t('carDetails:specs.transmission')}</div>
                <div className={specValueStyle}>{car.specifications?.transmission}</div>
              </div>
            )}
            {shouldDisplaySpec(car.specifications?.mileage) && (
              <div className={specItemStyle}>
                <div className={specLabelStyle}>{t('carDetails:specs.mileage')}</div>
                <div className={specValueStyle}>{car.specifications?.mileage?.toLocaleString() || '0'} {t('carDetails:specs.km')}</div>
              </div>
            )}
            {shouldDisplaySpec(car.specifications?.engine_size) && (
              <div className={specItemStyle}>
                <div className={specLabelStyle}>{t('carDetails:specs.engineSize')}</div>
                <div className={specValueStyle}>{car.specifications?.engine_size}L</div>
              </div>
            )}
            {shouldDisplaySpec(car.specifications?.engine_type) && (
              <div className={specItemStyle}>
                <div className={specLabelStyle}>{t('carDetails:specs.engineType')}</div>
                <div className={specValueStyle}>{car.specifications?.engine_type}</div>
              </div>
            )}
            {shouldDisplaySpec(car.specifications?.drive_type) && (
              <div className={specItemStyle}>
                <div className={specLabelStyle}>{t('carDetails:specs.driveType')}</div>
                <div className={specValueStyle}>{translateDriveType(car.specifications?.drive_type)}</div>
              </div>
            )}
            {shouldDisplaySpec(car.specifications?.steering_wheel) && (
              <div className={specItemStyle}>
                <div className={specLabelStyle}>{t('carDetails:specs.steeringWheel')}</div>
                <div className={specValueStyle}>{translateSteeringWheel(car.specifications?.steering_wheel)}</div>
              </div>
            )}
          </div>
          <div className={specGroupStyle}>
            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
              <Palette size={18} className="mr-2 text-purple-500" />
              {t('carDetails:specs.additionalFeatures')}
            </h3>
            {shouldDisplaySpec(car.specifications?.color) && (
              <div className={specItemStyle}>
                <div className={specLabelStyle}>{t('carDetails:specs.color')}</div>
                <div className={specValueStyle}>{car.specifications?.color}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Location Info */}
      {car.location && (
        <div className={`${cardStyle} car-section`} style={{animationDelay: '0.3s'}}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-r from-red-50 to-orange-50 rounded-full -mr-16 -mt-16 opacity-30 z-0"></div>
          <h2 className={sectionHeadingStyle}>
            <MapPin size={20} className="mr-2 text-red-600" />
            {t('carDetails:specs.location')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {car.location.city && (
              <div className="p-3 rounded-lg bg-gradient-to-br from-white to-gray-50 hover:from-red-50 hover:to-orange-50 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md border border-transparent hover:border-red-200">
                <p className="text-gray-500 text-sm mb-1">{t('carDetails:specs.city')}</p>
                <p className="font-semibold text-lg text-gray-800">{car.location.city}</p>
              </div>
            )}
            {car.location.country && (
              <div className="p-3 rounded-lg bg-gradient-to-br from-white to-gray-50 hover:from-red-50 hover:to-orange-50 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md border border-transparent hover:border-red-200">
                <p className="text-gray-500 text-sm mb-1">{t('carDetails:specs.country')}</p>
                <p className="font-semibold text-lg text-gray-800">{car.location.country}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarInfo;