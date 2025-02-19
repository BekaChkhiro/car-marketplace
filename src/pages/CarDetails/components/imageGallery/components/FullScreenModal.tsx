import React from 'react';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

interface FullScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImage: string;
  onPrevious: () => void;
  onNext: () => void;
}

const FullScreenModal: React.FC<FullScreenModalProps> = ({
  isOpen,
  onClose,
  currentImage,
  onPrevious,
  onNext
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-8 backdrop-blur-lg">
      <div className="relative w-full h-full flex items-center justify-center">
        <div 
          className="w-full h-full bg-contain bg-center bg-no-repeat transition-transform duration-300"
          style={{ backgroundImage: `url(${currentImage})` }}
        />
        <button 
          className="absolute top-6 right-6 w-12 h-12 rounded-full bg-red-500 text-white 
            hover:bg-red-600 hover:scale-110 transition-all flex items-center justify-center z-10"
          onClick={onClose}
        >
          <FaTimes className="text-xl" />
        </button>
        <button 
          className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 text-primary 
            hover:bg-white hover:scale-110 transition-all flex items-center justify-center"
          onClick={onPrevious}
        >
          <FaChevronLeft className="text-xl" />
        </button>
        <button 
          className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 text-primary 
            hover:bg-white hover:scale-110 transition-all flex items-center justify-center"
          onClick={onNext}
        >
          <FaChevronRight className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default FullScreenModal;