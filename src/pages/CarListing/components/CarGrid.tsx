import React from 'react';
import CarCard from '../../../components/CarCard';

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
};

export default CarGrid;