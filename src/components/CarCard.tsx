import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { Car } from '../types/car';

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { currency, setCurrency } = useCurrency();
  const { formatPrice } = usePrice();
  
  // Ensure images is always an array
  const images = car.images || [];

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
    <Link 
      to={`/cars/${car.id}`}
      onClick={handleClick}
      className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-md relative group"
    >
      <div className="relative pt-[66.67%] overflow-hidden">
        <div className="absolute inset-0 flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        >
          {images.length > 0 ? (
            images.map((image, index) => (
              <div
                key={index}
                className="min-w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${image})` }}
              />
            ))
          ) : (
            <div
              className="min-w-full h-full bg-cover bg-center bg-gray-100 flex items-center justify-center"
            >
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>

        {/* Navigation Buttons - Only show if there are multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
            >
              <ChevronLeft className="text-primary w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
            >
              <ChevronRight className="text-primary w-5 h-5" />
            </button>
          </>
        )}

        {/* Image Indicators - Only show if there are multiple images */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  currentImageIndex === index ? 'w-6 bg-primary' : 'w-2 bg-white/70'
                }`}
              />
            ))}
          </div>
        )}

        {car.isVip && (
          <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-lg text-sm font-medium shadow-sm backdrop-blur-sm">
            VIP
          </div>
        )}
        <button 
          onClick={(e) => {
            e.preventDefault();
            // Add favorite functionality here
          }}
          className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center transition-all duration-200 hover:scale-105 hover:bg-white"
        >
          <Heart className="text-primary w-5 h-5" />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg text-gray-dark font-semibold mb-2">
          {car.year} {car.make} {car.model}
        </h3>
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
          <MapPin className="text-primary w-4 h-4" />
          {car.location?.city || ''}, {car.location?.region || ''}
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {formatPrice(car.price)}
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <CustomSwitch
              checked={currency === 'USD'}
              onChange={(e) => setCurrency(e.target.checked ? 'USD' : 'GEL')}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Fuel className="text-primary w-4 h-4" />
            {car.specifications?.fuelType || 'N/A'}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Gauge className="text-primary w-4 h-4" />
            {car.specifications?.mileage ? car.specifications.mileage.toLocaleString() : '0'} კმ
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Settings className="text-primary w-4 h-4" />
            {car.specifications?.transmission || 'N/A'}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CarCard;