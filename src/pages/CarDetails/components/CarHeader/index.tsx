import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Share2, Heart } from 'lucide-react';
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
    <div className="bg-white shadow-sm sticky top-0 z-50">
      <Container>
        <div className="py-4 flex justify-between items-center">
          <Link to="/cars" className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">უკან დაბრუნება</span>
          </Link>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleShare}
              className="p-2.5 bg-blue-50 rounded-full shadow-sm hover:shadow-md transition-all action-button"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4 text-blue-600" />
            </button>
            <button 
              onClick={toggleFavorite}
              className={`p-2.5 ${isFavorite ? 'bg-red-50' : 'bg-blue-50'} rounded-full shadow-sm hover:shadow-md transition-all action-button`}
              aria-label="Add to favorites"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-current' : 'text-blue-600'}`} />
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CarHeader;
