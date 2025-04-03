import React from 'react';
import CarHeader from './components/CarHeader';
import CarSpecificationCards from './components/CarSpecificationCards';
import CarDescription from './components/CarDescription';
import TechnicalSpecifications from './components/TechnicalSpecifications';
import { Car } from '../../../../api/types/car.types';

interface CarInfoProps {
  car: Car;
}

const CarInfo: React.FC<CarInfoProps> = ({ car }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-4">
        {car.title || `${car.brand} ${car.model} (${car.year})`}
      </h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div>
          <p className="text-gray-500 text-sm">Price</p>
          <p className="font-semibold">${car.price.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Mileage</p>
          <p className="font-semibold">{car.specifications.mileage.toLocaleString()} km</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Fuel Type</p>
          <p className="font-semibold">{car.specifications.fuel_type}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Transmission</p>
          <p className="font-semibold">{car.specifications.transmission}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Engine Size</p>
          <p className="font-semibold">{car.specifications.engine_size}L</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Steering Wheel</p>
          <p className="font-semibold">{car.specifications.steering_wheel}</p>
        </div>
      </div>

      {car.description_ka && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-gray-700 whitespace-pre-line">{car.description_ka}</p>
        </div>
      )}
    </div>
  );
};

export default CarInfo;