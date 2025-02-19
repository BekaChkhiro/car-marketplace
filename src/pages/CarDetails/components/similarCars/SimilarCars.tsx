import React from 'react';
import EmptyState from './components/EmptyState';
import SectionHeader from './components/SectionHeader';
import CarGrid from './components/CarGrid';
import { Car } from './types';

interface SimilarCarsProps {
  cars: Car[];
}

const SimilarCars: React.FC<SimilarCarsProps> = ({ cars }) => {
  if (!cars.length) {
    return <EmptyState />;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-8">
        <SectionHeader />
        <CarGrid cars={cars} />
      </div>
    </div>
  );
};

export default SimilarCars;