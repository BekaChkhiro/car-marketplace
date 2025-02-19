import React from 'react';
import { FaChevronLeft, FaChevronRight, FaExpand } from 'react-icons/fa';

interface GalleryControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  onExpand: () => void;
}

const GalleryControls: React.FC<GalleryControlsProps> = ({ onPrevious, onNext, onExpand }) => {
  return (
    <>
      <button 
        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 text-primary 
          hover:bg-white hover:scale-110 transition-all flex items-center justify-center backdrop-blur-sm
          opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0"
        onClick={onPrevious}
      >
        <FaChevronLeft className="text-xl" />
      </button>
      
      <button 
        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 text-primary 
          hover:bg-white hover:scale-110 transition-all flex items-center justify-center backdrop-blur-sm
          opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0"
        onClick={onNext}
      >
        <FaChevronRight className="text-xl" />
      </button>
      
      <button 
        className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/90 text-primary 
          hover:bg-white hover:scale-110 transition-all flex items-center justify-center backdrop-blur-sm
          opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0"
        onClick={onExpand}
      >
        <FaExpand className="text-xl" />
      </button>
    </>
  );
};

export default GalleryControls;