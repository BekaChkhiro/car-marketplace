import React from 'react';
import { Link } from 'react-router-dom';
import { FaGasPump, FaTachometerAlt, FaCog, FaArrowRight, FaHeart } from 'react-icons/fa';

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
}

interface SimilarCarsProps {
  cars: Car[];
}

const SimilarCars: React.FC<SimilarCarsProps> = ({ cars }) => {
  if (!cars.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <h3 className="text-xl text-gray-800 font-semibold mb-2">მსგავსი მანქანები ვერ მოიძებნა</h3>
        <p className="text-gray-600">
          ამჟამად მსგავსი მანქანები არ არის ხელმისაწვდომი. გთხოვთ სცადოთ მოგვიანებით.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            მსგავსი მანქანები
          </h2>
          <p className="mt-2 text-gray-600">
            აღმოაჩინეთ სხვა მანქანები, რომლებიც შეესაბამება თქვენს მოთხოვნებს
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <Link 
              key={car.id} 
              to={`/cars/${car.id}`}
              className="group relative bg-gray-50 rounded-xl overflow-hidden transition-all duration-300
                hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative aspect-[4/3]">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${car.images[0]})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    // Add favorite functionality here
                  }}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 text-primary 
                    flex items-center justify-center transition-all duration-300
                    hover:scale-110 hover:bg-white hover:shadow-md backdrop-blur-sm
                    opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                >
                  <FaHeart className="text-sm" />
                </button>
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-gray-800 group-hover:text-primary transition-colors">
                    {car.year} {car.make} {car.model}
                  </h3>
                  <div className="text-lg font-bold text-primary">
                    ${car.price.toLocaleString()}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-col items-center gap-1">
                    <FaGasPump className="text-primary" />
                    <span className="text-sm font-medium text-gray-800">{car.specifications.fuelType}</span>
                    <span className="text-xs text-gray-500">საწვავი</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <FaTachometerAlt className="text-primary" />
                    <span className="text-sm font-medium text-gray-800">{car.specifications.mileage.toLocaleString()}km</span>
                    <span className="text-xs text-gray-500">გარბენი</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <FaCog className="text-primary" />
                    <span className="text-sm font-medium text-gray-800">{car.specifications.transmission}</span>
                    <span className="text-xs text-gray-500">გადაცემათა კოლოფი</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimilarCars;