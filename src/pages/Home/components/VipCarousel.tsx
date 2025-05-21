import React, { useEffect, useState } from 'react';
import { Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import vipService, { VipStatus } from '../../../api/services/vipService';
import carService from '../../../api/services/carService';
import CarCard from '../../../components/CarCard';
import { Car, Category } from '../../../api/types/car.types';

interface VipCarouselProps {
  vipType: VipStatus;
  limit?: number;
}

const VipCarousel: React.FC<VipCarouselProps> = ({ vipType, limit = 8 }) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibleItemsCount, setVisibleItemsCount] = useState(4);
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize to adjust visible items count and detect mobile
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      
      // Always show 2 items per row on mobile
      if (mobile) {
        setVisibleItemsCount(2);
      } else if (window.innerWidth < 1024) {
        setVisibleItemsCount(2);
      } else if (window.innerWidth < 1280) {
        setVisibleItemsCount(3);
      } else {
        setVisibleItemsCount(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchVipCars = async () => {
      try {
        setLoading(true);

        // First, get categories for proper display
        const categoriesData = await carService.getCategories();
        setCategories(categoriesData);
        
        // Get VIP car IDs from VIP service
        const response = await vipService.getCarsByVipStatus(vipType, limit);
        const vipCarsData = response.cars;
        
        // If VIP cars already have complete data, use them directly
        if (vipCarsData.length > 0 && 
            vipCarsData[0]?.specifications?.mileage !== undefined && 
            vipCarsData[0]?.specifications?.fuel_type && 
            vipCarsData[0]?.location?.city) {
          console.log(`[VipCarousel] Using VIP cars data directly for ${vipType}`);
          setCars(vipCarsData);
        } else {
          // Otherwise, fetch each car's complete data individually
          console.log(`[VipCarousel] Fetching complete data for ${vipCarsData.length} ${vipType} cars`);
          const carDetailsPromises = vipCarsData.map(async (vipCar: any) => {
            try {
              // Get complete car data by ID
              const carDetailsResponse = await carService.getCar(vipCar.id);
              // Merge VIP status information with complete car data
              return {
                ...carDetailsResponse,
                vip_status: vipCar.vip_status || vipType
              };
            } catch (error) {
              console.error(`Error fetching details for car ${vipCar.id}:`, error);
              return vipCar; // Return original data if fetch fails
            }
          });
          
          const completeCars = await Promise.all(carDetailsPromises);
          setCars(completeCars);
        }
      } catch (err) {
        console.error('Error fetching VIP cars:', err);
        setError('VIP მანქანების ჩატვირთვა ვერ მოხერხდა');
      } finally {
        setLoading(false);
      }
    };

    fetchVipCars();
  }, [vipType, limit]);

  // Auto-advance slides every 4 seconds
  useEffect(() => {
    if (cars.length <= visibleItemsCount) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    
    return () => clearInterval(interval);
  }, [cars.length, currentSlide, visibleItemsCount]);

  const nextSlide = () => {
    if (cars.length <= visibleItemsCount) return;
    setCurrentSlide((prev) => {
      const maxSlide = cars.length - visibleItemsCount;
      return prev >= maxSlide ? 0 : prev + 1;
    });
  };

  const prevSlide = () => {
    if (cars.length <= visibleItemsCount) return;
    setCurrentSlide((prev) => {
      const maxSlide = cars.length - visibleItemsCount;
      return prev <= 0 ? maxSlide : prev - 1;
    });
  };

  const getVipTitle = (vipType: VipStatus) => {
    switch (vipType) {
      case 'vip':
        return 'VIP მანქანები';
      case 'vip_plus':
        return 'VIP+ განცხადებები';
      case 'super_vip':
        return 'SUPER VIP განცხადებები';
      default:
        return '';
    }
  };

  const getVipBadgeStyle = (vipType: VipStatus) => {
    switch (vipType) {
      case 'vip':
        return 'bg-blue-500 text-white';
      case 'vip_plus':
        return 'bg-purple-500 text-white';
      case 'super_vip':
        return 'bg-yellow-500 text-yellow-900';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  if (cars.length === 0 && !loading) {
    return null;
  }

  return (
    <div className="mb-10 bg-white rounded-lg sm:rounded-lg shadow-sm p-3 sm:p-4 w-full">
      <div className="flex items-center justify-between mb-4 pb-3 border-b">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-0">{getVipTitle(vipType)}</h2>
          <div className={`px-2 py-0.5 rounded ${getVipBadgeStyle(vipType)} flex items-center`}>
            <Star size={14} fill="currentColor" className="mr-1" />
            <span className="text-xs font-medium">{vipType === 'vip_plus' ? 'VIP+' : vipType === 'super_vip' ? 'SUPER VIP' : 'VIP'}</span>
          </div>
        </div>
        
        <Link
          to={`/cars?filter=${vipType}`}
          className="hidden sm:flex items-center gap-1 px-3 py-2 text-sm text-primary font-semibold border border-primary/30 rounded-lg hover:bg-primary/10 hover:-translate-y-0.5 transition-all duration-200 group"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          ყველას ნახვა <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-pulse">
          {Array.from({ length: limit }).map((_, index) => (
            <div key={index} className="bg-gray-200 rounded-lg h-64"></div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <div className="relative overflow-hidden">
          <div 
            className="flex gap-4 transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentSlide * (100 / visibleItemsCount)}%)` }}
          >
            {cars.map((car) => (
              <div key={car.id} className={`flex-none ${
                visibleItemsCount === 2 ? 'w-1/2' : 
                visibleItemsCount === 3 ? 'w-1/3' : 
                visibleItemsCount === 4 ? 'w-1/4' : 
                'w-1/2'}`}>
                <div className="h-full">
                  <CarCard car={car} categories={categories} showVipBadge />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Indicator dots for visual guidance */}
      {cars.length > visibleItemsCount && !loading && (
        <div className='flex justify-center items-center'>
          <div className="flex justify-center gap-2 mt-4 bg-white px-3 py-2 rounded-lg">
          {Array.from({ length: cars.length - visibleItemsCount + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-primary' : 'bg-gray-300'}`}
            />
          ))}
          </div>
        </div>
      )}
      
      {/* "View All" button for mobile (shown at bottom for better UX) */}
      {!loading && cars.length > 0 && isMobile && (
        <div className="flex justify-center mt-6">
          <Link
            to={`/cars?filter=${vipType}`}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-primary-dark transition-all duration-200 w-full max-w-xs"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            ყველა {vipType === 'vip_plus' ? 'VIP+' : vipType === 'super_vip' ? 'SUPER VIP' : 'VIP'} მანქანის ნახვა <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default VipCarousel;
