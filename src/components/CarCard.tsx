import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  Fuel,
  Gauge,
  Settings
} from 'lucide-react';
import { CustomSwitch } from './layout/Header/components/CurrencySelector';
import { useCurrency } from '../context/CurrencyContext';
import { usePrice } from '../context/usePrice';
import { Car } from '../api/types/car.types';

interface CarCardProps {
  car: Car;
  isOwner?: boolean;
  onDelete?: () => void;
}

const CarCard: React.FC<CarCardProps> = ({ car, isOwner, onDelete }) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { currency, setCurrency } = useCurrency();
  const { formatPrice } = usePrice();
  
  const images = car.images?.map(img => img.url) || [];

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

  return (
    <div 
      onClick={handleClick}
      className="relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
    >
      {/* Image carousel */}
      <div className="relative h-48 bg-gray-200">
        {images.length > 0 ? (
          <img
            src={images[currentImageIndex]}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-1 rounded-full text-white hover:bg-black/70"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-1 rounded-full text-white hover:bg-black/70"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Car details */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {car.title || `${car.brand} ${car.model}`}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              {formatPrice(car.price)}
            </span>
            <CustomSwitch
              checked={currency === 'USD'}
              onChange={(e) => setCurrency(e.target.checked ? 'USD' : 'GEL')}
            />
          </div>
        </div>

        {/* Specifications */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Gauge size={16} />
            <span>{car.specifications.mileage ? car.specifications.mileage.toLocaleString() : '0'} {car.specifications.mileage_unit || 'km'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Fuel size={16} />
            <span>{car.specifications.fuel_type}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Settings size={16} />
            <span>{car.specifications.transmission}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={16} />
            <span>{car.specifications.steering_wheel}</span>
          </div>
        </div>

        {/* Owner actions */}
        {isOwner && (
          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/profile/cars/edit/${car.id}`);
              }}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onDelete) onDelete();
              }}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarCard;