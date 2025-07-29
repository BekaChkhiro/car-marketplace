import React from 'react';
import CarCard from '../../../components/CarCard';
import { Car, Category } from '../../../api/types/car.types';
import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../i18n';

interface CarGridProps {
  cars: Car[];
  categories: Category[];
  inWishlistPage?: boolean;
  onRemoveFromWishlist?: (car: Car) => void;
  className?: string;
}

const CarGrid: React.FC<CarGridProps> = ({ cars, categories, inWishlistPage = false, onRemoveFromWishlist, className = '' }) => {
  const { t } = useTranslation([namespaces.carListing]);
  
  // CarGrid is working correctly!
  if (!cars || cars.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500 text-lg">{t('carListing:noResults')}</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6 ${className}`}>
      {cars.map((car) => (
        <div key={car.id} className="relative">
          {inWishlistPage && onRemoveFromWishlist && (
            <button 
              onClick={() => onRemoveFromWishlist(car)}
              className="absolute top-2 right-2 z-10 bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-full shadow transition-colors duration-200"
              title={t('carListing:removeFromWishlist')}
            >
              <Trash2 size={16} />
            </button>
          )}
          <CarCard car={car} categories={categories} showWishlistButton={!inWishlistPage} showVipBadge={true} />
        </div>
      ))}
    </div>
  );
};

export default CarGrid;