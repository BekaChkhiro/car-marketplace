import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaExpand, FaTimes } from 'react-icons/fa';

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (isModalOpen) {
      switch (e.key) {
        case 'Escape':
          setIsModalOpen(false);
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isModalOpen]);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="relative w-full h-[600px] group">
        <div 
          className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-102"
          style={{ backgroundImage: `url(${images[currentIndex]})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/20" />
        
        <button 
          className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 text-primary 
            hover:bg-white hover:scale-110 transition-all flex items-center justify-center backdrop-blur-sm
            opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0"
          onClick={handlePrevious}
        >
          <FaChevronLeft className="text-xl" />
        </button>
        
        <button 
          className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 text-primary 
            hover:bg-white hover:scale-110 transition-all flex items-center justify-center backdrop-blur-sm
            opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0"
          onClick={handleNext}
        >
          <FaChevronRight className="text-xl" />
        </button>
        
        <button 
          className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/90 text-primary 
            hover:bg-white hover:scale-110 transition-all flex items-center justify-center backdrop-blur-sm
            opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0"
          onClick={() => setIsModalOpen(true)}
        >
          <FaExpand className="text-xl" />
        </button>
      </div>

      <div className="relative flex gap-4 p-6 overflow-x-auto scroll-smooth bg-white">
        {images.map((image, index) => (
          <div
            key={index}
            className={`w-[120px] h-[90px] flex-shrink-0 bg-cover bg-center rounded-lg cursor-pointer transition-all
              ${index === currentIndex 
                ? 'ring-2 ring-primary ring-offset-2 opacity-100 scale-105 shadow-md' 
                : 'ring-2 ring-transparent ring-offset-2 opacity-70 hover:opacity-100 hover:scale-105 hover:shadow-md'}`}
            style={{ backgroundImage: `url(${image})` }}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-8 backdrop-blur-lg">
          <div className="relative w-full h-full flex items-center justify-center">
            <div 
              className="w-full h-full bg-contain bg-center bg-no-repeat transition-transform duration-300"
              style={{ backgroundImage: `url(${images[currentIndex]})` }}
            />
            <button 
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-red-500 text-white 
                hover:bg-red-600 hover:scale-110 transition-all flex items-center justify-center z-10"
              onClick={() => setIsModalOpen(false)}
            >
              <FaTimes className="text-xl" />
            </button>
            <button 
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 text-primary 
                hover:bg-white hover:scale-110 transition-all flex items-center justify-center"
              onClick={handlePrevious}
            >
              <FaChevronLeft className="text-xl" />
            </button>
            <button 
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 text-primary 
                hover:bg-white hover:scale-110 transition-all flex items-center justify-center"
              onClick={handleNext}
            >
              <FaChevronRight className="text-xl" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;