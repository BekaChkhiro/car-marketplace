import React, { useState, useRef, useEffect } from 'react';
import { Eye, ChevronLeft, ChevronRight, Camera, Maximize, ZoomIn } from 'lucide-react';
import ImageGallery from '../imageGallery/ImageGallery';
import FullScreenModal from '../imageGallery/components/FullScreenModal';
import './styles.css';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../../i18n';

interface CarGalleryProps {
  imageUrls: string[];
  toggleGallery: () => void;
}

const CarGallery: React.FC<CarGalleryProps> = ({ imageUrls, toggleGallery }) => {
  const { t } = useTranslation([namespaces.carDetails, namespaces.common]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  // Handle image loading
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Handle image navigation
  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (imageUrls.length > 0) {
      setIsLoading(true);
      setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (imageUrls.length > 0) {
      setIsLoading(true);
      setCurrentImageIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
    }
  };

  // Handle touch events for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) {
      // Swipe left
      nextImage();
    }

    if (touchStart - touchEnd < -100) {
      // Swipe right
      prevImage();
    }
  };

  // Scroll thumbnails to keep active thumbnail visible
  useEffect(() => {
    if (thumbnailsRef.current && imageUrls.length > 0) {
      const thumbnailWidth = 70; // width + margin
      const scrollPosition = currentImageIndex * thumbnailWidth;
      thumbnailsRef.current.scrollTo({
        left: scrollPosition - thumbnailsRef.current.clientWidth / 2 + thumbnailWidth / 2,
        behavior: 'smooth'
      });
    }
  }, [currentImageIndex, imageUrls.length]);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-green-100 car-detail-card">
      <div className="relative">
        {imageUrls.length > 0 ? (
          <div 
            className="image-gallery-wrapper"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-80 z-10">
                <div className="w-12 h-12 border-4 border-green-200 border-t-primary rounded-full animate-spin"></div>
              </div>
            )}
            <img
              src={imageUrls[currentImageIndex]}
              alt="Car"
              className="w-full h-[250px] sm:h-[350px] md:h-[450px] object-cover transition-all duration-300 cursor-pointer"
              onLoad={handleImageLoad}
              onClick={() => setIsModalOpen(true)}
            />
            
            {/* Image navigation buttons */}
            {imageUrls.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white p-2 sm:p-3 rounded-full text-primary shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white p-2 sm:p-3 rounded-full text-primary shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} />
                </button>
                
                
                {/* Image counter */}
                <div className="absolute bottom-2 left-2 bg-white/70 text-primary px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                  {currentImageIndex + 1} / {imageUrls.length}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="bg-gray-50 h-[250px] sm:h-[350px] md:h-[450px] flex items-center justify-center">
            <div className="text-center p-4 sm:p-6">
              <div className="mx-auto h-16 w-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
                <Camera className="h-8 w-8 text-primary" />
              </div>
              <p className="text-lg font-medium text-gray-700 mb-2">{t('carDetails:gallery.noImages')}</p>
              <p className="text-sm text-gray-500">{t('carDetails:gallery.noImagesDescription')}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Thumbnails */}
      {imageUrls.length > 1 && (
        <div className="p-2 border-t border-green-50">
          <div 
            ref={thumbnailsRef}
            className="flex overflow-x-auto hide-scrollbar space-x-2 py-2"
          >
            {imageUrls.map((url, index) => (
              <div 
                key={index} 
                className={`thumbnail-container ${currentImageIndex === index ? 'active' : ''}`}
                onClick={() => {
                  setIsLoading(true);
                  setCurrentImageIndex(index);
                }}
              >
                <img 
                  src={url} 
                  alt={`Thumbnail ${index + 1}`} 
                  className="w-16 h-12 object-cover rounded-md transition-all duration-200"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      

      {/* Fullscreen Modal */}
      <FullScreenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={imageUrls}
        initialIndex={currentImageIndex}
      />
    </div>
  );
};

export default CarGallery;
