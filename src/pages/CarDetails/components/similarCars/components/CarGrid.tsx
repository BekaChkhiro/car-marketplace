import React from 'react';
import { Car, Category } from '../../../../../api/types/car.types';
import CarCard from '../../../../../components/CarCard';

interface CarGridProps {
  cars: Car[];
  categories?: Category[];
}

const CarGrid: React.FC<CarGridProps> = ({ cars, categories }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} categories={categories} showVipBadge />
      ))}
    </div>
  );
};

export default CarGrid;