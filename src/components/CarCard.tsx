import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  Fuel,
  Gauge,
  Tag,
  Calendar,
  Car as CarIcon,
  Star
} from 'lucide-react';
import { CustomSwitch } from './layout/Header/components/CurrencySelector';
import { useCurrency } from '../context/CurrencyContext';
import { usePrice } from '../context/usePrice';
import type { Car, Category } from '../api/types/car.types';
import carService from '../api/services/carService';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import LoginModal from './layout/Header/auth/LoginModal';
import RegisterModal from './layout/Header/auth/RegisterModal';

interface CarCardProps {
  car: Car;
  categories?: Category[];
  isOwner?: boolean;
  onDelete?: () => void;
  showWishlistButton?: boolean;
  showVipBadge?: boolean;
}

const CarCard: React.FC<CarCardProps> = ({ car, categories: propCategories, isOwner, onDelete, showWishlistButton = true, showVipBadge = false }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isInWishlistState, setIsInWishlistState] = useState(false);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [localCategory, setLocalCategory] = useState<Category | null>(null);
  const { currency, setCurrency } = useCurrency();
  const { formatPrice } = usePrice();
  
  const images = car.images?.map(img => img.url) || [];

  // Fetch category for this car
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        console.log('CarCard - Fetching category for category_id:', car.category_id);
        if (car.category_id) {
          // Try to use provided categories first
          let categories = propCategories || [];
          
          // If no categories provided, fetch them
          if (categories.length === 0) {
            console.log('CarCard - No categories provided, fetching from service');
            categories = await carService.getCategories();
          }
          
          console.log('CarCard - Available categories:', categories);
          
          // Compare as strings to handle type differences (number vs string)
          const foundCategory = categories.find(cat => String(cat.id) === String(car.category_id));
          console.log('CarCard - Found category:', foundCategory);
          
          if (foundCategory) {
            setLocalCategory(foundCategory);
          } else {
            console.log('CarCard - Category not found for ID:', car.category_id);
            setLocalCategory(null);
          }
        } else {
          console.log('CarCard - No category_id provided in car object');
          setLocalCategory(null);
        }
      } catch (error) {
        console.error('Error fetching category:', error);
        setLocalCategory(null);
      }
    };

    fetchCategory();
  }, [car.category_id, propCategories]);

  useEffect(() => {
    if (showWishlistButton && isAuthenticated) {
      checkWishlistStatus();
    }
  }, [car.id, showWishlistButton, isAuthenticated]);

  const checkWishlistStatus = async () => {
    try {
      const exists = await isInWishlist(car.id);
      setIsInWishlistState(exists);
    } catch (err) {
      console.error('Error checking wishlist status:', err);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/cars/${car.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setIsLoginOpen(true);
      return;
    }

    if (isLoadingWishlist) return;

    setIsLoadingWishlist(true);
    try {
      if (isInWishlistState) {
        await removeFromWishlist(car.id);
        showToast('მანქანა წაიშალა სასურველებიდან', 'success');
      } else {
        await addToWishlist(car.id);
        showToast('მანქანა დაემატა სასურველებში', 'success');
      }
      setIsInWishlistState(!isInWishlistState);
    } catch (err: any) {
      showToast(err.message || 'Error updating wishlist', 'error');
    } finally {
      setIsLoadingWishlist(false);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="group relative bg-white rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 flex flex-col h-full"
    >
      {/* VIP Badge */}
      {showVipBadge && car.vip_status && car.vip_status !== 'none' && (
        <div className="absolute top-2 right-2 z-10">
          <div className={
            `px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium shadow-sm ${car.vip_status === 'vip' 
              ? 'bg-blue-500 text-white' 
              : car.vip_status === 'vip_plus'
              ? 'bg-purple-500 text-white'
              : 'bg-yellow-500 text-yellow-900'}`
          }>
            <Star size={12} fill="currentColor" /> 
            {car.vip_status === 'vip' ? 'VIP' : car.vip_status === 'vip_plus' ? 'VIP+' : 'SUPER VIP'}
          </div>
        </div>
      )}

      {/* Image carousel */}
      <div className="relative h-32 sm:h-40 md:h-48 lg:h-52 bg-gray-100">
        {images.length > 0 ? (
          <img
            src={images[currentImageIndex]}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <CarIcon size={40} />
          </div>
        )}
        
        {/* Status badge */}
        {(car.status === 'sold' || car.featured) && (
          <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-medium ${
            car.status === 'sold' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-primary/10 text-primary'
          }`}>
            {car.status === 'sold' ? 'გაყიდულია' : 'VIP'}
          </div>
        )}

        {/* Wishlist button */}
        {showWishlistButton && (
          <button
            onClick={handleWishlistClick}
            className={`absolute top-3 right-3 p-2 rounded-full ${  
              isInWishlistState 
                ? 'bg-primary text-white' 
                : 'bg-white/90 text-gray-400 hover:bg-primary hover:text-white'
            } transition-all duration-200 shadow-sm hover:shadow`}
            disabled={isLoadingWishlist}
            title={isInWishlistState ? 'წაშლა ფავორიტებიდან' : 'დამატება ფავორიტებში'}
          >
            <Heart 
              className="h-5 w-5" 
              fill={isInWishlistState ? "currentColor" : "none"} 
              strokeWidth={isInWishlistState ? 0 : 2}
            />
          </button>
        )}

        {/* Image navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-200"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-200"
            >
              <ChevronRight size={18} />
            </button>
            
            {/* Image indicators */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    index === currentImageIndex 
                      ? 'w-3 bg-white' 
                      : 'w-1.5 bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Car details */}
      <div className="p-1.5 sm:p-3 md:p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-0.5">
          <div className="flex-1">
            <h3 className="text-xs sm:text-base md:text-lg font-semibold text-gray-900 mb-0.5 sm:mb-1 line-clamp-1">
              {car.title || `${car.brand} ${car.model}`}
            </h3>
            <div className="flex items-center gap-0.5 sm:gap-2 text-[10px] sm:text-sm text-gray-500">
              <Calendar size={10} className="sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
              <span>{car.year}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-0.5 sm:gap-1">
            <span className="text-xs sm:text-base md:text-lg font-bold text-primary">
              {formatPrice(car.price)}
            </span>
          </div>
        </div>

        {/* Specifications grid - hide less important info on very small screens */}
        <div className="grid grid-cols-2 gap-0.5 sm:gap-2 mt-1 sm:mt-3 mt-auto">
          <div className="flex items-center gap-0.5 sm:gap-2 px-1 sm:px-2.5 py-0.5 sm:py-1.5 rounded-md sm:rounded-lg bg-gray-50 text-[10px] sm:text-sm text-gray-600">
            <Gauge size={10} className="text-gray-400 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
            <span className="truncate">{car.specifications?.mileage ? car.specifications.mileage.toLocaleString() : '0'} {car.specifications?.mileage_unit || 'km'}</span>
          </div>
          <div className="flex items-center gap-0.5 sm:gap-2 px-1 sm:px-2.5 py-0.5 sm:py-1.5 rounded-md sm:rounded-lg bg-gray-50 text-[10px] sm:text-sm text-gray-600">
            <Fuel size={10} className="text-gray-400 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
            <span className="truncate">{car.specifications?.fuel_type}</span>
          </div>
          <div className="hidden sm:flex items-center gap-0.5 sm:gap-2 px-1 sm:px-2.5 py-0.5 sm:py-1.5 rounded-md sm:rounded-lg bg-gray-50 text-[10px] sm:text-sm text-gray-600">
            <Tag size={10} className="text-gray-400 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
            <span className="truncate">{localCategory?.name || (car.category_id ? `კატეგორია ${car.category_id}` : 'არ არის')}</span>
          </div>
          <div className="flex items-center gap-0.5 sm:gap-2 px-1 sm:px-2.5 py-0.5 sm:py-1.5 rounded-md sm:rounded-lg bg-gray-50 text-[10px] sm:text-sm text-gray-600">
            <MapPin size={10} className="text-gray-400 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
            <span className="truncate">{car.location?.city}</span>
          </div>
        </div>

        {/* Owner actions */}
        {isOwner && (
          <div className="mt-2 sm:mt-3 md:mt-4 flex justify-end gap-1 sm:gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/profile/cars/edit/${car.id}`);
              }}
              className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 text-xs sm:text-sm bg-white text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
            >
              რედაქტირება
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onDelete) onDelete();
              }}
              className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 text-xs sm:text-sm bg-white text-red-500 border border-red-500 rounded-lg hover:bg-red-50 transition-colors"
            >
              წაშლა
            </button>
          </div>
        )}
      </div>

      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onShowRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />
      <RegisterModal 
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </div>
  );
};

export default CarCard;