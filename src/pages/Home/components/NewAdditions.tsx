import React, { useEffect, useState } from 'react';
import { Car, Category } from '../../../api/types/car.types';
import carService from '../../../api/services/carService';
import vipService from '../../../api/services/vipService';
import CarCard from '../../../components/CarCard';
import { useToast } from '../../../context/ToastContext';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NewAdditions: React.FC = () => {
  const { t } = useTranslation('home');
  const [newCars, setNewCars] = useState<Car[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
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
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch categories first
        const categoriesData = await carService.getCategories();
        console.log('NewAdditions - Fetched categories:', categoriesData);
        
        // Ensure categories have valid IDs (convert string IDs to numbers if needed)
        const normalizedCategories = categoriesData.map(cat => ({
          ...cat,
          id: typeof cat.id === 'string' ? parseInt(cat.id, 10) : cat.id
        }));
        
        setCategories(normalizedCategories);
        console.log('NewAdditions - Normalized categories:', normalizedCategories);
        
        // Get latest 8 cars, including VIP and non-VIP cars
        const allCarsResponse = await carService.getCars({});
        
        // Sort by created_at and take the latest 8 cars for the carousel
        const sortedCars = allCarsResponse.cars
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 8);
        
        console.log('NewAdditions - All cars count:', allCarsResponse.cars.length);
        console.log('NewAdditions - Selected cars count:', sortedCars.length);
        
        // Ensure car category_ids are also normalized
        const normalizedCars = sortedCars.map(car => ({
          ...car,
          category_id: car.category_id !== undefined ? 
            (typeof car.category_id === 'string' ? parseInt(car.category_id, 10) : car.category_id) : 
            null
        }));
        
        setNewCars(normalizedCars);
        
        // Log category IDs for debugging
        if (normalizedCars.length > 0) {
          console.log('NewAdditions - Car category IDs:', normalizedCars.map(car => ({ 
            id: car.id, 
            category_id: car.category_id, 
            type: typeof car.category_id 
          })));
          
          // Log full category matches
          normalizedCars.forEach(car => {
            const matchingCategory = normalizedCategories.find(cat => cat.id === car.category_id);
            console.log(`NewAdditions - Car ${car.id} category match:`, {
              car_category_id: car.category_id,
              matching_category: matchingCategory || 'No match'
            });
          });
        }
      } catch (err) {
        console.error('Error fetching new cars or categories:', err);
        setError('ახალი მანქანების ჩატვირთვა ვერ მოხერხდა');
        showToast('Failed to load new cars', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showToast]);

  // Auto-advance slides every 4 seconds
  useEffect(() => {
    if (newCars.length <= visibleItemsCount) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    
    return () => clearInterval(interval);
  }, [newCars.length, currentSlide, visibleItemsCount]);

  const nextSlide = () => {
    if (newCars.length <= visibleItemsCount) return;
    setCurrentSlide((prev) => {
      const maxSlide = newCars.length - visibleItemsCount;
      return prev >= maxSlide ? 0 : prev + 1;
    });
  };

  const prevSlide = () => {
    if (newCars.length <= visibleItemsCount) return;
    setCurrentSlide((prev) => {
      const maxSlide = newCars.length - visibleItemsCount;
      return prev <= 0 ? maxSlide : prev - 1;
    });
  };

  if (newCars.length === 0 && !loading) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg sm:rounded-lg shadow-sm p-3 sm:p-4 w-full">
      <div className="flex items-center justify-between mb-4 pb-3 border-b">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-0">{t('newAdditions')}</h2>
        </div>
        
        <Link
          to="/cars"
          className="hidden sm:flex items-center gap-1 px-3 py-2 text-sm text-primary font-semibold border border-primary/30 rounded-lg hover:bg-primary/10 hover:-translate-y-0.5 transition-all duration-200 group"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          {t('viewAll')} <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-pulse">
          {Array.from({ length: 8 }).map((_, index) => (
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
            {newCars.map((car) => (
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
      {newCars.length > visibleItemsCount && !loading && (
        <div className='flex justify-center items-center'>
          <div className="flex justify-center gap-2 mt-4 bg-white px-3 py-2 rounded-lg" role="tablist" aria-label={t('carouselNavigation', { defaultValue: 'Carousel navigation' })}>
          {Array.from({ length: newCars.length - visibleItemsCount + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-primary' : 'bg-gray-300'}`}
              aria-label={t('goToSlide', { number: index + 1, defaultValue: `Go to slide ${index + 1}` })}
              aria-current={currentSlide === index ? 'true' : 'false'}
              role="tab"
              title={t('goToSlide', { number: index + 1, defaultValue: `Go to slide ${index + 1}` })}
            />
          ))}
          </div>
        </div>
      )}
      
      {/* "View All" button for mobile (shown at bottom for better UX) */}
      {!loading && newCars.length > 0 && isMobile && (
        <div className="flex justify-center mt-6">
          <Link
            to="/cars"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-primary-dark transition-all duration-200 w-full max-w-xs"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            {t('viewAllCars')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default NewAdditions;