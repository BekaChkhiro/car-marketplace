import React from 'react';
import CarCard from '../../../../../components/CarCard';
import { Car } from '../types';

interface CarGridProps {
  cars: Car[];
}

const CarGrid: React.FC<CarGridProps> = ({ cars }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
};

export default CarGrid;