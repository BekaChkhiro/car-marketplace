import React from 'react';
import { FaShare, FaHeart } from 'react-icons/fa';

interface CarHeaderProps {
  make: string;
  model: string;
  year: number;
  price: number;
}

const CarHeader: React.FC<CarHeaderProps> = ({ make, model, year, price }) => {
  return (
    <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
      <div className="flex-1 min-w-[280px]">
        <h1 className="text-3xl font-bold mb-2 text-gray-dark leading-tight">
          {year} {make} {model}
        </h1>
        <div className="flex gap-4 mt-4">
          <button className="flex items-center justify-center space-x-2 px-4 py-2.5 
            rounded-xl text-gray-dark hover:text-primary transition-colors
            hover:bg-green-light border border-gray-100">
            <FaHeart className="w-4 h-4" />
            <span className="text-sm font-medium">Save</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-4 py-2.5 
            rounded-xl text-gray-dark hover:text-primary transition-colors
            hover:bg-green-light border border-gray-100">
            <FaShare className="w-4 h-4" />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
      </div>
      <div className="text-right">
        <div className="text-3xl text-primary font-bold leading-none">
          ${price.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default CarHeader;