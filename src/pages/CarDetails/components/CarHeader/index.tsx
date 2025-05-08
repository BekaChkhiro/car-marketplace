import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Share2, Heart, Car as CarIcon } from 'lucide-react';
import { Container } from '../../../../components/ui';

interface CarHeaderProps {
  isFavorite: boolean;
  handleShare: () => void;
  toggleFavorite: () => void;
}

const CarHeader: React.FC<CarHeaderProps> = ({ 
  isFavorite, 
  handleShare, 
  toggleFavorite 
}) => {
  return (
    <div className="bg-white shadow-md sticky top-0 z-50 border-b border-green-100">
      <Container>
        <div className="py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/cars" className="flex items-center text-gray-700 hover:text-primary transition-colors mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">უკან დაბრუნება</span>
            </Link>
            
            <div className="hidden md:flex items-center text-primary">
              <CarIcon className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">მანქანის დეტალები</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleShare}
              className="p-2.5 bg-green-50 rounded-full shadow-sm hover:shadow-md transition-all action-button"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4 text-primary" />
            </button>
            <button 
              onClick={toggleFavorite}
              className={`p-2.5 ${isFavorite ? 'bg-red-50' : 'bg-green-50'} rounded-full shadow-sm hover:shadow-md transition-all action-button`}
              aria-label="Add to favorites"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-current' : 'text-primary'}`} />
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CarHeader;
