import React, { useEffect, useState } from 'react';
import { Container } from '../../components/ui';
import { Calendar, Gauge, Fuel, Shield } from 'lucide-react';
import useCarDetails, { KeySpec } from './hooks/useCarDetails';
import LoadingState from './components/LoadingState';
import NotFoundState from './components/NotFoundState';
import CarHeader from './components/CarHeader';
import CarGallery from './components/CarGallery';
import MobileCarInfo from './components/MobileCarInfo';
import CarInfo from './components/carInfo/CarInfo';
import CarSpecs from './components/CarSpecs';
import CarPriceCard from './components/CarPriceCard';
import SimilarCarsSection from './components/SimilarCarsSection';
import AdvertisementSection from './components/AdvertisementSection';

const CarDetails: React.FC = () => {
  const {
    car,
    loading,
    isFavorite,
    toggleFavorite,
    handleShare,
    toggleGallery
  } = useCarDetails();

  if (loading) {
    return <LoadingState />;
  }

  if (!car) {
    return <NotFoundState />;
  }

  // Extract image URLs from car images array
  const imageUrls = car.images?.map(image => image.large_url || image.url) || [];
  
  // Extract category ID for similar cars
  const categoryId = car.category_id?.toString() || '';

  // Format year
  const year = car.year ? car.year.toString() : '';
  
  // Get key specifications with enhanced styling
  const keySpecs: KeySpec[] = [
    { 
      icon: <Calendar className="w-5 h-5 text-blue-500" />, 
      label: 'წელი', 
      value: year,
      color: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    { 
      icon: <Gauge className="w-5 h-5 text-green-500" />, 
      label: 'გარბენი', 
      value: car.specifications?.mileage ? `${car.specifications.mileage.toLocaleString()} კმ` : 'N/A',
      color: 'bg-green-50',
      textColor: 'text-green-700'
    },
    { 
      icon: <Fuel className="w-5 h-5 text-orange-500" />, 
      label: 'საწვავი', 
      value: car.specifications?.fuel_type || 'N/A',
      color: 'bg-orange-50',
      textColor: 'text-orange-700'
    },
    { 
      icon: <Shield className="w-5 h-5 text-purple-500" />, 
      label: 'სათავსო', 
      value: car.specifications?.transmission || 'N/A',
      color: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Top navigation bar with premium styling */}
      <CarHeader 
        isFavorite={isFavorite} 
        handleShare={handleShare} 
        toggleFavorite={toggleFavorite} 
      />
      
      <Container>
        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column - Images and details */}
          <div className="lg:col-span-8">
            {/* Image Gallery */}
            <CarGallery imageUrls={imageUrls} toggleGallery={toggleGallery} />

            {/* Mobile Title, Price, and Key Specs */}
            <MobileCarInfo car={car} keySpecs={keySpecs} />

            {/* Car Details */}
            <div className="mt-4 bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">მანქანის დეტალები</h2>
              <CarInfo car={car} />
            </div>
            
            {/* Car Specifications */}
            <CarSpecs car={car} />
          </div>
          
          {/* Right column - Price and contact info (desktop only) */}
          <div className="hidden lg:block lg:col-span-4">
            <CarPriceCard car={car} keySpecs={keySpecs} />
          </div>
        </div>
        
        {/* Similar Cars Section */}
        <SimilarCarsSection carId={car?.id?.toString() || ''} categoryId={categoryId} />
        
        {/* Bottom Advertisement - responsive */}
        <AdvertisementSection />
      </Container>
    </div>
  );
};

export default CarDetails;
