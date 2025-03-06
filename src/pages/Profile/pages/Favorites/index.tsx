import React from 'react';
import { Car } from '../../../../types/car';
import CarGrid from '../../../CarListing/components/CarGrid';

const Favorites: React.FC = () => {
  // TODO: Implement favorites fetching logic
  const favoritesCars: Car[] = [];

  if (favoritesCars.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            ფავორიტები ცარიელია
          </h3>
          <p className="text-gray-500">
            თქვენ ჯერ არ დაგიმატებიათ არცერთი მანქანა ფავორიტებში
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <CarGrid cars={favoritesCars} />
    </div>
  );
};

export default Favorites;