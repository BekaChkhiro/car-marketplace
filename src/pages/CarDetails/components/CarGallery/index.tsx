import React from 'react';
import { Eye } from 'lucide-react';
import ImageGallery from '../imageGallery/ImageGallery';

interface CarGalleryProps {
  imageUrls: string[];
  toggleGallery: () => void;
}

const CarGallery: React.FC<CarGalleryProps> = ({ imageUrls, toggleGallery }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {imageUrls.length > 0 ? (
        <ImageGallery images={imageUrls} />
      ) : (
        <div className="bg-gray-100 h-[250px] sm:h-[350px] md:h-[500px] flex items-center justify-center">
          <div className="text-center p-4 sm:p-6">
            <svg className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="mt-2 text-sm sm:text-base text-gray-500">ამ მანქანისთვის სურათები არ არის ხელმისაწვდომი</p>
          </div>
        </div>
      )}
      
      {imageUrls.length > 0 && (
        <div className="p-3 flex justify-end">
          <button 
            onClick={toggleGallery}
            className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>ყველა სურათის ნახვა</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CarGallery;
