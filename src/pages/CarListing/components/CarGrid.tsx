import React from 'react';
import CarCard from '../../../components/CarCard';
import { Car, Category } from '../../../api/types/car.types';
import { Trash2 } from 'lucide-react';

interface CarGridProps {
  cars: Car[];
  categories: Category[];
  inWishlistPage?: boolean;
  onRemoveFromWishlist?: (car: Car) => void;
}

const CarGrid: React.FC<CarGridProps> = ({ cars, categories, inWishlistPage = false, onRemoveFromWishlist }) => {
  if (!cars || cars.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500 text-lg">მანქანები ვერ მოიძებნა</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      {cars.map((car) => (
        <div key={car.id} className="relative">
          {inWishlistPage && onRemoveFromWishlist && (
            <button 
              onClick={() => onRemoveFromWishlist(car)}
              className="absolute top-2 right-2 z-10 bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-full shadow transition-colors duration-200"
              title="წაშლა ფავორიტებიდან"
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