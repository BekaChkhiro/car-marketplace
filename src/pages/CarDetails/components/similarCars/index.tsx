import React, { useEffect, useState, useRef, TouchEvent } from 'react';
import carService from '../../../../api/services/carService';
import { Car, Category } from '../../../../api/types/car.types';
import { useToast } from '../../../../context/ToastContext';
import CarCard from '../../../../components/CarCard';
import { ChevronLeft, ChevronRight, Car as CarIcon } from 'lucide-react';
import './styles.css';

interface SimilarCarsProps {
  carId: string;
  category: string;
}

const SimilarCars: React.FC<SimilarCarsProps> = ({ carId, category }) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Log the category ID we're using
        console.log('[SimilarCars] Fetching similar cars with category ID:', category);
        console.log('[SimilarCars] Current car ID to exclude:', carId);
        
        // First fetch categories to ensure they're loaded
        const categoriesResponse = await carService.getCategories();
        setCategories(categoriesResponse);
        
        // Get the current car ID in both string and number format for reliable comparison
        const currentCarIdStr = carId?.toString() || '';
        const currentCarIdNum = parseInt(currentCarIdStr, 10);
        
        console.log('[SimilarCars] Current car ID (string):', currentCarIdStr);
        console.log('[SimilarCars] Current car ID (number):', currentCarIdNum);
        
        // Fetch more cars than needed to ensure we have enough after filtering
        const filters: any = {
          limit: 20
          // Not using excludeId in API call since it doesn't seem to work properly
        };
        
        // Only add category filter if it's a valid non-empty string
        if (category && category.trim() !== '') {
          filters.category = category;
        }
        
        const carsResponse = await carService.getCars(filters);
        console.log('[SimilarCars] Total cars fetched before filtering:', carsResponse.cars.length);
        
        // Manual filtering to remove the current car
        // This is a belt-and-suspenders approach that checks multiple ID formats
        const filteredCars = carsResponse.cars.filter(car => {
          // Get car ID in multiple formats for comparison
          const carIdStr = car.id?.toString() || '';
          const carIdNum = car.id ? Number(car.id) : 0;
          
          // Log any potential matches for debugging
          if (carIdStr === currentCarIdStr || carIdNum === currentCarIdNum) {
            console.log('[SimilarCars] Found current car in results, removing:', car);
            return false;
          }
          
          return true;
        });
        
        console.log('[SimilarCars] Cars after filtering:', filteredCars.length);
        
        // Limit to 8 cars for display
        const limitedCars = filteredCars.slice(0, 8);
        setCars(limitedCars);
      } catch (error) {
        console.error('Error fetching data:', error);
        showToast('Failed to load similar cars', 'error');
        // Set empty arrays to prevent undefined errors
        setCars([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [carId, category, showToast]);

  // Touch handling for swipe gestures
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  // Handle touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isSwiping) {
      setTouchEnd(e.targetTouches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    if (isSwiping) {
      if (touchStart - touchEnd > 75) {
        // Swipe left - go to next
        scrollToNext();
      }
      if (touchStart - touchEnd < -75) {
        // Swipe right - go to previous
        scrollToPrev();
      }
      setIsSwiping(false);
    }
  };

  // Calculate visible items based on screen width
  const getVisibleItems = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1; // Mobile: 1 item
      if (window.innerWidth < 1024) return 2; // Tablet: 2 items
      return 3; // Desktop: 3 items
    }
    return 2; // Default
  };

  const visibleItems = getVisibleItems();

  const scrollToNext = () => {
    if (carouselRef.current && cars.length > 0) {
      const itemWidth = carouselRef.current.clientWidth / visibleItems;
      carouselRef.current.scrollBy({ left: itemWidth * visibleItems, behavior: 'smooth' });
      setCurrentIndex(Math.min(currentIndex + visibleItems, cars.length - 1));
    }
  };

  const scrollToPrev = () => {
    if (carouselRef.current && cars.length > 0) {
      const itemWidth = carouselRef.current.clientWidth / visibleItems;
      carouselRef.current.scrollBy({ left: -itemWidth * visibleItems, behavior: 'smooth' });
      setCurrentIndex(Math.max(currentIndex - visibleItems, 0));
    }
  };

  // Scroll to specific index
  const scrollToIndex = (index: number) => {
    if (carouselRef.current && cars.length > 0) {
      const targetIndex = index * visibleItems;
      const itemWidth = carouselRef.current.clientWidth / visibleItems;
      const scrollPosition = targetIndex * (itemWidth / visibleItems);
      
      carouselRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
      setCurrentIndex(Math.min(targetIndex, cars.length - 1));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-green-200 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="bg-green-50 rounded-lg p-4 text-center">
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
            <CarIcon className="w-6 h-6 text-primary" />
          </div>
        </div>
        <p className="text-gray-700">მსგავსი მანქანები არ მოიძებნა</p>
      </div>
    );
  }

  // Calculate number of pages
  const totalPages = Math.ceil(cars.length / visibleItems);
  const currentPage = Math.floor(currentIndex / visibleItems);
  
  // Calculate card width based on screen size
  const getCardWidth = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 'calc(100% - 16px)'; // Full width on mobile
      if (window.innerWidth < 768) return 'calc(50% - 16px)'; // Half width on small tablets
      if (window.innerWidth < 1024) return 'calc(33.333% - 16px)'; // Third width on tablets
      return 'calc(25% - 16px)'; // Quarter width on desktop
    }
    return 'calc(100% - 16px)'; // Default
  };

  return (
    <div className="relative px-2 sm:px-4">
      {/* Navigation buttons - hidden on mobile, shown on tablet and up */}
      <div className="hidden sm:block absolute -left-2 md:-left-4 top-1/2 transform -translate-y-1/2 z-10">
        <button 
          onClick={scrollToPrev} 
          disabled={currentIndex === 0}
          className={`carousel-nav-button w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-md flex items-center justify-center ${currentIndex === 0 ? 'text-gray-300 cursor-not-allowed opacity-70' : 'text-primary hover:bg-green-50'}`}
          aria-label="Previous cars"
        >
          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>
      </div>
      
      <div className="hidden sm:block absolute -right-2 md:-right-4 top-1/2 transform -translate-y-1/2 z-10">
        <button 
          onClick={scrollToNext} 
          disabled={currentIndex >= cars.length - visibleItems}
          className={`carousel-nav-button w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-md flex items-center justify-center ${currentIndex >= cars.length - visibleItems ? 'text-gray-300 cursor-not-allowed opacity-70' : 'text-primary hover:bg-green-50'}`}
          aria-label="Next cars"
        >
          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>
      </div>
      
      {/* Carousel container with touch events */}
      <div 
        ref={carouselRef} 
        className="flex overflow-x-auto pb-4 pt-2 hide-scrollbar snap-x snap-mandatory touch-pan-x"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {cars.map((car) => (
          <div 
            key={car.id} 
            className="carousel-item snap-start px-2"
            style={{ minWidth: getCardWidth(), width: getCardWidth() }}
          >
            <div className="h-full">
              <CarCard car={car} categories={categories} />
            </div>
          </div>
        ))}
      </div>
      
      {/* Mobile-friendly pagination dots */}
      <div className="flex justify-center mt-4 mb-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`pagination-dot ${currentPage === index ? 'active' : ''}`}
            aria-label={`Go to page ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SimilarCars;