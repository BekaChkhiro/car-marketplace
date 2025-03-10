import React from 'react';
import CarCard from '../../../components/CarCard';
import { Car } from '../../../types/car';

interface CarGridProps {
  cars: Car[] | null;
}

const CarGrid: React.FC<CarGridProps> = ({ cars }) => {
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
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
};

export default CarGrid;