import React from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface GalleryControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  onExpand: () => void;
}

const GalleryControls: React.FC<GalleryControlsProps> = ({ onPrevious, onNext, onExpand }) => {
  return (
    <>
      <button 
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-primary 
          hover:bg-white hover:scale-110 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100"
        onClick={onPrevious}
      >
        <ChevronLeft size={20} />
      </button>
      
      <button 
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-primary 
          hover:bg-white hover:scale-110 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100"
        onClick={onNext}
      >
        <ChevronRight size={20} />
      </button>
      
      <button 
        className="absolute right-4 bottom-4 w-10 h-10 rounded-full bg-white/90 text-primary 
          hover:bg-white hover:scale-110 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100"
        onClick={onExpand}
      >
        <Maximize2 size={20} />
      </button>
    </>
  );
};

export default GalleryControls;