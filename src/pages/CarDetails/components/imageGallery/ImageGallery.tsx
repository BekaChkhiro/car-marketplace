import React, { useState, useEffect } from 'react';
import GalleryControls from './components/GalleryControls';
import ThumbnailStrip from './components/ThumbnailStrip';
import FullScreenModal from './components/FullScreenModal';

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
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] group">
        <div 
          className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-102"
          style={{ backgroundImage: `url(${images[currentIndex]})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/20" />
        
        <GalleryControls
          onPrevious={handlePrevious}
          onNext={handleNext}
          onExpand={() => setIsModalOpen(true)}
        />
      </div>

      <div className="hidden sm:block">
        <ThumbnailStrip
          images={images}
          currentIndex={currentIndex}
          onThumbnailClick={setCurrentIndex}
        />
      </div>
      
      {/* Mobile image counter */}
      <div className="flex sm:hidden justify-center items-center py-3 px-4 gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-primary w-4' : 'bg-gray-300'}`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      <FullScreenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={images}
        initialIndex={currentIndex}
      />
    </div>
  );
};

export default ImageGallery;