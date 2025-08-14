import React, { useState, useEffect } from 'react';
import { Container } from '../../components/ui';
import { Calendar, Gauge, Fuel, Shield, ArrowUp, ChevronRight } from 'lucide-react';
import useCarDetails, { KeySpec } from './hooks/useCarDetails';
import LoadingState from './components/LoadingState';
import NotFoundState from './components/NotFoundState';
import CarHeader from './components/CarHeader';
import CarGallery from './components/CarGallery';
import MobileCarInfo from './components/MobileCarInfo';
import MobileCarDescription from './components/MobileCarDescription';
import CarSpecs from './components/CarSpecs';
import CarPriceCard from './components/CarPriceCard';
import SimilarCarsSection from './components/SimilarCarsSection';
import AdvertisementDisplay from '../../components/Advertisement/AdvertisementDisplay';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../i18n';
import { useParams, Link } from 'react-router-dom';
import './styles.css';

const CarDetails: React.FC = () => {
  // State for scroll-to-top button visibility
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const [refreshCarData, setRefreshCarData] = useState(false);
  const { t } = useTranslation([namespaces.carDetails, namespaces.common]);
  const { lang } = useParams<{ lang: string }>();
  
  // Get current language from URL params or use default
  const currentLang = lang || 'ka';
  
  const {
    car,
    loading,
    isFavorite,
    toggleFavorite,
    handleShare,
    toggleGallery
  } = useCarDetails(refreshCarData);
  
  // Handle scroll event to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (!car) {
    return <NotFoundState />;
  }
  
  // Debug car object to check VIN code
  console.log('Car object in CarDetails component:', car);
  console.log('Car has VIN code?', car?.vin_code ? 'YES: ' + car.vin_code : 'NO');

  // Extract image URLs from car images array
  const imageUrls = car.images?.map(image => image.large_url || image.url) || [];
  
  // Extract category ID for similar cars
  const categoryId = car.category_id?.toString() || '';

  // Format year
  const year = car.year ? car.year.toString() : '';
  
  // Get key specifications with enhanced styling
  const keySpecs: KeySpec[] = [
    { 
      icon: <Calendar className="w-5 h-5 text-primary" />, 
      label: t('carDetails:specs.year'), 
      value: year
    },
    { 
      icon: <Gauge className="w-5 h-5 text-primary" />, 
      label: t('carDetails:specs.mileage'), 
      value: car.specifications?.mileage ? `${car.specifications.mileage.toLocaleString()} კმ` : t('common:notAvailable', 'არ არის')
    },
    { 
      icon: <Fuel className="w-5 h-5 text-primary" />, 
      label: t('carDetails:specs.fuel'), 
      value: car.specifications?.fuel_type || 'N/A'
    },
    { 
      icon: <Shield className="w-5 h-5 text-primary" />, 
      label: t('carDetails:specs.transmission'), 
      value: car.specifications?.transmission || 'N/A'
    },
  ];
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Top advertisement banner - at the very beginning of the page without any background */}
      <div className="w-full py-3 flex justify-center">
        <AdvertisementDisplay placement="car_details_top" className="w-[calc(100vw-32px)] max-w-[728px] h-[140px] rounded-md overflow-hidden" />
      </div>
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">

      {/* Top navigation bar */}
      <CarHeader 
        isFavorite={isFavorite} 
        handleShare={handleShare} 
        toggleFavorite={toggleFavorite} 
      />
      
      <Container className="px-3 sm:px-4 md:px-6 lg:px-8 pb-16">
        {/* Breadcrumb navigation */}
        <nav className="py-3 mb-2 flex items-center text-sm text-gray-500 breadcrumb-nav">
          <Link to={`/${currentLang}`} className="hover:text-primary transition-colors">{t('carDetails:breadcrumbs.home')}</Link>
          <span className="mx-2">/</span>
          <Link to={`/${currentLang}/cars`} className="hover:text-primary transition-colors">{t('carDetails:breadcrumbs.cars')}</Link>
          <span className="mx-2">/</span>
          <span className="text-primary font-medium truncate max-w-[150px] sm:max-w-xs">
            {car.title || `${car.brand || ''} ${car.model || ''} ${car.year || ''}`}
          </span>
        </nav>
        
        {/* Main content area */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {/* Left column - Images and details */}
          <div className="md:col-span-7 lg:col-span-8">
            {/* Image Gallery */}
            <CarGallery imageUrls={imageUrls} toggleGallery={toggleGallery} />

            {/* Mobile/Tablet Title, Price, and Key Specs - only shown on mobile and tablet */}
            <MobileCarInfo car={car} keySpecs={keySpecs} />
            
            {/* Mobile Car Description - only shown on mobile */}
            <MobileCarDescription car={car} />
            
            {/* Car Specifications */}
            <CarSpecs car={car} />
          </div>
          
          {/* Right column - Price and contact info (tablet and desktop only) */}
          <div className="hidden md:block md:col-span-5 lg:col-span-4">
            <div className="sticky top-24">
              {/* Only show VIP purchase if user is the owner of the car */}
              <CarPriceCard car={car} keySpecs={keySpecs} />
            </div>
          </div>
        </div>
        
        {/* Bottom advertisement banner */}
        <div className="w-full my-6 md:my-8 flex justify-center">
          <AdvertisementDisplay placement="car_details_bottom" className="w-[calc(100vw-32px)] max-w-[728px] h-[140px] rounded-md overflow-hidden" />
        </div>
        
        {/* Similar Cars Section */}
        <div className="mt-6 md:mt-10 similar-cars-section">
          <SimilarCarsSection carId={car?.id?.toString() || ''} categoryId={categoryId} />
        </div>
        
        {/* Scroll to top button */}
        {showScrollTop && (
          <button 
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 z-50 scroll-top-button"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </Container>
    </div>
    
    {/* Bottom advertisement - outside the background container */}
    <div className="w-full py-6 flex justify-center">
      <AdvertisementDisplay 
        placement="car_details_after_similar" 
        className="w-full md:w-[720px] h-[90px] md:h-[140px] rounded-lg shadow-md max-w-full overflow-hidden transition-all duration-300" 
      />
    </div>
    </>
  );
};

export default CarDetails;
