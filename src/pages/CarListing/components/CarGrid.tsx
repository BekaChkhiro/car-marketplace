import React from 'react';
import { Link } from 'react-router-dom';
import { FaGasPump, FaTachometerAlt, FaCog, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';

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

interface CarGridProps {
  cars: Car[];
}

const CarGrid: React.FC<CarGridProps> = ({ cars }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
      {cars.map((car) => (
        <Link 
          key={car.id} 
          to={`/cars/${car.id}`}
          className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-md relative group"
        >
          <div className="relative pt-[66.67%] overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-200 group-hover:scale-[1.02]"
              style={{ backgroundImage: `url(${car.images[0]})` }}
            />
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
              <FaHeart className="text-primary text-lg" />
            </button>
          </div>
          
          <div className="p-4">
            <h3 className="text-lg text-gray-dark font-semibold mb-2">
              {car.year} {car.make} {car.model}
            </h3>
            <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
              <FaMapMarkerAlt className="text-primary" />
              {car.location.city}, {car.location.region}
            </div>
            <div className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              ${car.price.toLocaleString()}
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FaGasPump className="text-primary" />
                {car.specifications.fuelType}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FaTachometerAlt className="text-primary" />
                {car.specifications.mileage}km
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FaCog className="text-primary" />
                {car.specifications.transmission}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CarGrid;