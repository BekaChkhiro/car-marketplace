import React, { useState, useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
}

const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Disable scrolling when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 200);
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }

    // Cleanup function to ensure scroll is re-enabled when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-200 p-4 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-[4px] transition-opacity duration-200"
        onClick={onClose}
      />
      <div 
        className={`bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md relative shadow-xl z-10 transform transition-all duration-200 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">{title}</h2>
        
        {children}
      </div>
    </div>
  );
};

export default Modal;