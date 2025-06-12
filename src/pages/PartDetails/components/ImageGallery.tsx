import React, { useState } from 'react';
import { PartImage } from '../../../api/services/partService';

interface ImageGalleryProps {
  images: PartImage[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Find primary image or use first image if no primary is set
  const primaryImageIndex = images.findIndex(img => img.is_primary);
  const initialImageIndex = primaryImageIndex !== -1 ? primaryImageIndex : 0;

  // If there are no images provided, use a placeholder
  const hasImages = images && images.length > 0;

  const handleThumbnailClick = (index: number) => {
    setActiveIndex(index);
  };

  const handleMainImageClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const navigateImage = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setActiveIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    } else {
      setActiveIndex((prevIndex) => 
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    }
  };

  // If there are no images
  if (!hasImages) {
    return (
      <div className="flex justify-center items-center h-[400px] bg-gray-100 rounded-lg">
        <span className="text-gray-500">No images available</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div 
        className="relative overflow-hidden rounded-lg bg-gray-100 cursor-pointer h-[400px]"
        onClick={handleMainImageClick}
      >
        <img
          src={images[activeIndex]?.large_url || images[activeIndex]?.url}
          alt="Part"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <div
              key={image.id}
              onClick={() => handleThumbnailClick(index)}
              className={`cursor-pointer rounded-md overflow-hidden border-2 ${
                index === activeIndex ? 'border-primary' : 'border-transparent'
              } h-20 w-20 flex-shrink-0`}
            >
              <img
                src={image.thumbnail_url || image.url}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal for fullscreen view */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex justify-center items-center">
          <div className="relative w-full max-w-5xl h-full flex justify-center items-center">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white bg-gray-800 bg-opacity-60 rounded-full p-2 hover:bg-opacity-100 transition-opacity"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Previous button */}
            <button
              onClick={() => navigateImage('prev')}
              className="absolute left-4 text-white bg-gray-800 bg-opacity-60 rounded-full p-2 hover:bg-opacity-100 transition-opacity"
              aria-label="Previous"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Full-size image */}
            <img
              src={images[activeIndex]?.large_url || images[activeIndex]?.url}
              alt="Part"
              className="max-h-full max-w-full object-contain"
            />

            {/* Next button */}
            <button
              onClick={() => navigateImage('next')}
              className="absolute right-4 text-white bg-gray-800 bg-opacity-60 rounded-full p-2 hover:bg-opacity-100 transition-opacity"
              aria-label="Next"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
