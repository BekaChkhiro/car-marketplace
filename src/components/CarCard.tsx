import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../i18n';
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
  Star,
  Crown
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
  // Explicitly use the car namespace to ensure translations are loaded
  const { t, i18n } = useTranslation([namespaces.car, namespaces.common]);
  const { lang } = useParams<{ lang: string }>();

  // Get current language from URL params or i18n
  const currentLang = lang || i18n.language || 'ka';

  // Force rerender when language changes
  useEffect(() => {
    // This effect will run whenever the language changes
    console.log('Current language in CarCard:', i18n.language);
  }, [i18n.language]);
  const navigate = useNavigate();
  
  // Log initial props when component mounts
  console.log(`[CarCard] Initial render - Car ${car.id} - VIP status:`, car.vip_status, 'Car object:', {
    id: car.id,
    brand: car.brand,
    model: car.model,
    vip_status: car.vip_status,
    color_highlighting_enabled: car.color_highlighting_enabled,
    timestamp: new Date().toISOString()
  });

  // Log when car prop changes
  useEffect(() => {
    console.log(`[CarCard] Car ${car.id} - Props changed - VIP status:`, car.vip_status, 'Car object:', {
      id: car.id,
      brand: car.brand,
      model: car.model,
      vip_status: car.vip_status,
      color_highlighting_enabled: car.color_highlighting_enabled,
      timestamp: new Date().toISOString()
    });
    
    // Log the actual prototype chain to check for getters/setters
    console.log(`[CarCard] Car ${car.id} - Prototype chain:`, {
      hasOwnVipStatus: car.hasOwnProperty('vip_status'),
      prototypeChain: Object.getPrototypeOf(car),
      descriptor: Object.getOwnPropertyDescriptor(car, 'vip_status') || 'No direct property',
      keys: Object.keys(car)
    });
  }, [car]);
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

  const [images, setImages] = useState<string[]>([]);

  // Handle image URLs - both uploaded and local File objects
  useEffect(() => {
    const imageUrls: string[] = [];
    const blobUrls: string[] = [];

    car.images?.forEach(img => {
      // If img has a url property, it's already uploaded
      if (img.url) {
        imageUrls.push(img.url);
      }
      // If img is a File object, create a temporary blob URL
      else if (img instanceof File) {
        const blobUrl = URL.createObjectURL(img);
        imageUrls.push(blobUrl);
        blobUrls.push(blobUrl);
      }
    });

    setImages(imageUrls);

    // Preload first image only for better performance
    if (imageUrls.length > 0) {
      const img = new Image();
      img.src = imageUrls[0];
    }

    // Cleanup blob URLs on unmount or when images change
    return () => {
      blobUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [car.images]);

  // Helper function to translate fuel types
  const translateFuelType = (fuelType?: string) => {
    if (!fuelType) return '';
    const normalizedFuelType = fuelType.toLowerCase().replace(/[_\s]/g, '');
    const fuelTypeMap: Record<string, string> = {
      'petrol': 'petrol',
      'gasoline': 'petrol',
      'benzin': 'petrol',
      'diesel': 'diesel',
      'hybrid': 'hybrid',
      'electric': 'electric',
      'ელექტრო': 'ელექტრო',
      'cng': 'cng',
      'naturalgas': 'naturalGas',
      'lpg': 'lpg',
      'pluginhybrid': 'plug_in_hybrid',
      'hydrogen': 'hydrogen'
    };
    const translationKey = fuelTypeMap[normalizedFuelType] || fuelType;
    return t(`car:${translationKey}`, fuelType);
  };

  // Helper function to translate mileage units
  const translateMileageUnit = (unit?: string) => {
    if (!unit) return t('car:km', 'km');
    const normalizedUnit = unit.toLowerCase();
    if (normalizedUnit === 'km' || normalizedUnit === 'kilometer' || normalizedUnit === 'kilometers') {
      return t('car:km', 'km');
    } else if (normalizedUnit === 'mi' || normalizedUnit === 'mile' || normalizedUnit === 'miles') {
      return t('car:mi', 'mi');
    }
    return t(`car:${unit}`, unit);
  };

  // Helper function to translate category names
  const translateCategory = (categoryName?: string) => {
    if (!categoryName) return t('car:noCategoryInfo');
    // Check if it's a placeholder first
    if (categoryName.includes('#{')) return categoryName;
    // Try to translate the category name
    const normalizedCategory = categoryName.toLowerCase().replace(/[_\s]/g, '');
    return t(`car:${normalizedCategory}`, categoryName);
  };

  // Helper function to translate location/city names
  const translateLocation = (city?: string) => {
    if (!city) return t('car:noLocationInfo');
    // Try to translate the city name, fallback to original if no translation found
    const translationKey = city.toLowerCase();
    return t(`car:${city}`, city);
  };

  // Fetch category for this car
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        // Try to use category_id from car if available
        const categoryId = car.category_id;

        if (categoryId !== undefined && categoryId !== null) {
          // Try to use provided categories first
          let categories = propCategories || [];

          // If no categories provided, fetch them
          if (categories.length === 0) {
            categories = await carService.getCategories();
          }

          console.log(`[CarCard ${car.id}] Comparing category_id: ${categoryId} (${typeof categoryId}) with available categories:`, categories);

          // Compare as strings to handle type differences (number vs string)
          // Force both to be strings for comparison
          const foundCategory = categories.find(cat =>
            String(cat.id) === String(categoryId) ||
            cat.id === Number(categoryId) ||
            Number(cat.id) === Number(categoryId)
          );

          if (foundCategory) {
            console.log(`[CarCard ${car.id}] Found matching category:`, foundCategory);
            setLocalCategory(foundCategory);
          } else {
            // If no matching category was found, create a placeholder
            console.log(`[CarCard ${car.id}] No matching category found, using placeholder`);
            setLocalCategory({
              id: Number(categoryId),
              name: t('car:categoryPlaceholder', { id: categoryId })
            });
          }
        } else {
          // No category information at all
          console.log(`[CarCard ${car.id}] No category_id available`);
          setLocalCategory(null);
        }
      } catch (error) {
        console.error(`[CarCard ${car.id}] Error fetching category:`, error);
        setLocalCategory(null);
      }
    };

    fetchCategory();
  }, [car.category_id, propCategories, car.id, t]);

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
    navigate(`/${currentLang}/cars/${car.id}`);
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
        showToast(t('car:removedFromWishlist'), 'success');
      } else {
        await addToWishlist(car.id);
        showToast(t('car:addedToWishlist'), 'success');
      }
      setIsInWishlistState(!isInWishlistState);
    } catch (err: any) {
      showToast(err.message || 'Error updating wishlist', 'error');
    } finally {
      setIsLoadingWishlist(false);
    }
  };

  // Debug: Log car properties related to VIP and highlighting
  useEffect(() => {
    console.log('=== CAR CARD DEBUG ===');
    console.log(`Car ID: ${car.id}, Title: ${car.title || `${car.brand} ${car.model}`}`);
    console.log(`VIP Status: ${car.vip_status}, Highlighting: ${car.color_highlighting_enabled}`);

    // Log all VIP-related properties
    const vipProps = Object.entries(car).filter(([key]) =>
      key.toLowerCase().includes('vip') ||
      key.toLowerCase().includes('highlight')
    );
    console.log('VIP/Highlighting properties:', Object.fromEntries(vipProps));
  }, [car]);

  // Check expiration dates
  const isVipExpired = car.vip_expiration_date ? new Date(car.vip_expiration_date) <= new Date() : true;
  const isColorHighlightingExpired = car.color_highlighting_expiration_date ? 
    new Date(car.color_highlighting_expiration_date) <= new Date() : true;

  // Check if the car should be highlighted based only on highlighting service
  const hasHighlighting = car.color_highlighting_enabled === true && !isColorHighlightingExpired;

  // Determine if we should show the VIP badge
  const showVipBadgeActual = showVipBadge &&
    car.vip_status &&
    car.vip_status !== 'none' &&
    !isVipExpired;
  
  console.log(`[CarCard] Car ${car.id} - Display check:`, {
    showVipBadge: showVipBadge,
    vip_status: car.vip_status,
    vip_expiration_date: car.vip_expiration_date,
    isVipExpired: isVipExpired,
    showVipBadgeActual: showVipBadgeActual,
    hasHighlighting: hasHighlighting
  });

  return (
    <div onClick={handleClick}
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg relative group cursor-pointer	${hasHighlighting ? 'border-2 border-green-500' : 'border border-gray-200'
        }`}
    >
      {/* VIP Badge */}
      {showVipBadgeActual && (
        <div
          className="absolute top-2 left-2 z-20 py-1 px-2 rounded text-xs font-bold text-white flex items-center gap-1 shadow-lg"
          style={{
            background: car.vip_status === 'super_vip' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' :
              car.vip_status === 'vip_plus' ? 'linear-gradient(135deg, #f59e0b, #f97316)' :
                'linear-gradient(135deg, #10b981, #059669)'
          }}
        >
          <Crown size={14} fill="currentColor" />
          <span>
            {car.vip_status === 'super_vip' ? 'SUPER VIP' :
              car.vip_status === 'vip_plus' ? 'VIP+' : 'VIP'}
          </span>
        </div>
      )}

      {/* Image carousel */}
      <div className="relative h-32 sm:h-40 md:h-48 lg:h-52 bg-gray-100">
        {images.length > 0 ? (
          <img
            src={images[currentImageIndex]}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            width="290"
            height="212"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <CarIcon size={40} />
          </div>
        )}

        {/* Status badge */}
        {(car.status === 'sold' || car.featured) && (
          <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-medium ${car.status === 'sold'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-primary/10 text-primary'
            }`}>
            {car.status === 'sold' ? t('car:sold') : t('car:featured', 'Featured')}
          </div>
        )}

        {/* Wishlist button */}
        {showWishlistButton && (
          <button
            onClick={handleWishlistClick}
            className={`absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 rounded-full ${isInWishlistState
              ? 'bg-primary text-white'
              : 'bg-white/90 text-gray-400 hover:bg-primary hover:text-white'
              } transition-all duration-200 shadow-sm hover:shadow`}
            disabled={isLoadingWishlist}
            title={isInWishlistState ? t('car:removeFromWishlist') : t('car:addToWishlist')}
          >
            <Heart
              className="h-4 w-4 sm:h-5 sm:w-5"
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
              aria-label={t('car:previousImage', { defaultValue: 'Previous image' })}
              title={t('car:previousImage', { defaultValue: 'Previous image' })}
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-200"
              aria-label={t('car:nextImage', { defaultValue: 'Next image' })}
              title={t('car:nextImage', { defaultValue: 'Next image' })}
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>

            {/* Image indicators */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-200 ${index === currentImageIndex
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
              {(() => {
                console.log('CarCard car currency data:', { 
                  id: car.id, 
                  price: car.price, 
                  currency: car.currency, 
                  car: car 
                });
                return formatPrice(car.price, car.currency as 'GEL' | 'USD');
              })()}
            </span>
          </div>
        </div>

        {/* Specifications grid - hide less important info on very small screens */}
        <div className="grid grid-cols-2 gap-0.5 sm:gap-2 mt-1 sm:mt-3 mt-auto">
          <div className="flex items-center gap-0.5 sm:gap-2 px-1 sm:px-2.5 py-0.5 sm:py-1.5 rounded-md sm:rounded-lg bg-gray-50 text-[10px] sm:text-sm text-gray-600">
            <Gauge size={10} className="text-gray-400 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
            <span className="truncate" title={t('car:mileage')}>{car.specifications?.mileage ? car.specifications.mileage.toLocaleString() : '0'} {translateMileageUnit(car.specifications?.mileage_unit)}</span>
          </div>
          <div className="flex items-center gap-0.5 sm:gap-2 px-1 sm:px-2.5 py-0.5 sm:py-1.5 rounded-md sm:rounded-lg bg-gray-50 text-[10px] sm:text-sm text-gray-600">
            <Fuel size={10} className="text-gray-400 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
            <span className="truncate" title={t('car:fuelType')}>{translateFuelType(car.specifications?.fuel_type)}</span>
          </div>
          <div className="hidden sm:flex items-center gap-0.5 sm:gap-2 px-1 sm:px-2.5 py-0.5 sm:py-1.5 rounded-md sm:rounded-lg bg-gray-50 text-[10px] sm:text-sm text-gray-600">
            <Tag size={10} className="text-gray-400 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
            <span className="truncate" title={t('car:category')}>{translateCategory(localCategory?.name || (car.category_id ? `Category ${car.category_id}` : undefined))}</span>
          </div>
          <div className="hidden sm:flex items-center gap-0.5 sm:gap-2 px-1 sm:px-2.5 py-0.5 sm:py-1.5 rounded-md sm:rounded-lg bg-gray-50 text-[10px] sm:text-sm text-gray-600">
            <MapPin size={10} className="text-gray-400 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
            <span className="truncate" title={t('car:location')}>{translateLocation(car.location?.city)}</span>
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
              {t('car:edit')}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onDelete) onDelete();
              }}
              className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 text-xs sm:text-sm bg-white text-red-500 border border-red-500 rounded-lg hover:bg-red-50 transition-colors"
            >
              {t('car:delete')}
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