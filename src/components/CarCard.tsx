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

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  images: string[];
  specifications: {
    fuelType: string;
    transmission: string;
    mileage: number;
  };
  location: {
    city: string;
    region: string;
  };
  isVip: boolean;
}

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/cars/${car.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length);
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
          {car.images.map((image, index) => (
            <div
              key={index}
              className="min-w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
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

        {/* Image Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {car.images.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                currentImageIndex === index ? 'w-6 bg-primary' : 'w-2 bg-white/70'
              }`}
            />
          ))}
        </div>

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
          {car.location.city}, {car.location.region}
        </div>
        <div className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
          {car.price.toLocaleString()} ₾
        </div>
        
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Fuel className="text-primary w-4 h-4" />
            {car.specifications.fuelType}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Gauge className="text-primary w-4 h-4" />
            {car.specifications.mileage.toLocaleString()} კმ
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Settings className="text-primary w-4 h-4" />
            {car.specifications.transmission}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CarCard;