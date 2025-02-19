import React from 'react';

interface ThumbnailStripProps {
  images: string[];
  currentIndex: number;
  onThumbnailClick: (index: number) => void;
}

const ThumbnailStrip: React.FC<ThumbnailStripProps> = ({ 
  images, 
  currentIndex, 
  onThumbnailClick 
}) => {
  return (
    <div className="relative flex gap-4 p-6 overflow-x-auto scroll-smooth bg-white">
      {images.map((image, index) => (
        <div
          key={index}
          className={`w-[120px] h-[90px] flex-shrink-0 bg-cover bg-center rounded-lg cursor-pointer transition-all
            ${index === currentIndex 
              ? 'ring-2 ring-primary ring-offset-2 opacity-100 scale-105 shadow-md' 
              : 'ring-2 ring-transparent ring-offset-2 opacity-70 hover:opacity-100 hover:scale-105 hover:shadow-md'}`}
          style={{ backgroundImage: `url(${image})` }}
          onClick={() => onThumbnailClick(index)}
        />
      ))}
    </div>
  );
};

export default ThumbnailStrip;