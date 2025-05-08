import React from 'react';
import { Car, ArrowRight } from 'lucide-react';
import SimilarCars from '../similarCars';

interface SimilarCarsSectionProps {
  carId: string;
  categoryId: string;
}

const SimilarCarsSection: React.FC<SimilarCarsSectionProps> = ({ carId, categoryId }) => {
  return (
    <div className="mt-8 bg-white rounded-xl shadow-md p-4 sm:p-6 border border-green-100 car-detail-card">
      <div className="flex justify-between items-center mb-4 sm:mb-6 pb-2 sm:pb-3 border-b border-green-100">
        <div className="flex items-center">
          <Car className="w-5 h-5 sm:w-6 sm:h-6 text-primary mr-2 sm:mr-3 flex-shrink-0" />
          <h2 className="text-base sm:text-xl font-bold text-gray-800 truncate mr-2">მსგავსი მანქანები</h2>
        </div>
        <a href="/cars" className="text-primary hover:text-green-700 transition-colors flex items-center text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0">
          ყველა
          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-0.5 sm:ml-1" />
        </a>
      </div>
      
      <div className="animate-fade-in">
        <SimilarCars 
          carId={carId} 
          category={categoryId} 
        />
      </div>
    </div>
  );
};

export default SimilarCarsSection;
