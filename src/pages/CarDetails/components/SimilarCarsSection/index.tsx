import React from 'react';
import SimilarCars from '../similarCars';

interface SimilarCarsSectionProps {
  carId: string;
  categoryId: string;
}

const SimilarCarsSection: React.FC<SimilarCarsSectionProps> = ({ carId, categoryId }) => {
  return (
    <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">მსგავსი მანქანები, რომლებიც შეიძლება მოგეწონოთ</h2>
      <SimilarCars 
        carId={carId} 
        category={categoryId} 
      />
    </div>
  );
};

export default SimilarCarsSection;
