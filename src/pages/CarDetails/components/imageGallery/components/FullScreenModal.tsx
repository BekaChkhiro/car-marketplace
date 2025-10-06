import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface FullScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex: number;
}

const FullScreenModal: React.FC<FullScreenModalProps> = ({
  isOpen,
  onClose,
  images,
  initialIndex
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset zoom and pan when changing images
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setIsLoading(true);
    }
  }, [isOpen, initialIndex]);

  // Preload adjacent images
  useEffect(() => {
    if (isOpen && images.length > 0) {
      const preloadImage = (index: number) => {
        if (index >= 0 && index < images.length) {
          const img = new Image();
          img.src = images[index];
        }
      };

      // Preload next and previous images
      preloadImage(currentIndex + 1);
      preloadImage(currentIndex - 1);
    }
  }, [currentIndex, images, isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
        case '_':
          handleZoomOut();
          break;
        case '0':
          handleResetZoom();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, currentIndex, zoom]);

  // Handle mouse wheel zoom
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!isOpen || !containerRef.current?.contains(e.target as Node)) return;

      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom(prev => Math.min(Math.max(1, prev + delta), 5));
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [isOpen]);

  const handlePrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setIsLoading(true);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setIsLoading(true);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 5));
  };

  const handleZoomOut = () => {
    setZoom(prev => {
      const newZoom = Math.max(prev - 0.5, 1);
      if (newZoom === 1) {
        setPan({ x: 0, y: 0 });
      }
      return newZoom;
    });
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleThumbnailClick = (index: number) => {
    if (index !== currentIndex) {
      setIsTransitioning(true);
      setIsLoading(true);
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[9999] p-4"
         style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
         onClick={onClose}>
      <div className="relative w-full max-w-6xl max-h-[90vh] flex flex-col bg-white rounded-lg overflow-hidden shadow-2xl"
           onClick={(e) => e.stopPropagation()}>
        {/* Header with close button and controls */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2 text-gray-700 text-sm font-medium">
            <span className="bg-gray-200 px-3 py-1 rounded-full">
              {currentIndex + 1} / {images.length}
            </span>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 1}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Zoom Out (-)"
            >
              <ZoomOut size={18} />
            </button>
            <span className="text-gray-700 text-sm font-medium min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 5}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Zoom In (+)"
            >
              <ZoomIn size={18} />
            </button>
            <button
              onClick={handleResetZoom}
              disabled={zoom === 1}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Reset Zoom (0)"
            >
              <Maximize2 size={18} />
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all hover:scale-110"
            title="Close (Esc)"
          >
            <X size={22} />
          </button>
        </div>

        {/* Main image container */}
        <div
          ref={containerRef}
          className="flex-1 relative flex items-center justify-center p-4 overflow-hidden"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
            </div>
          )}

          <img
            ref={imageRef}
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            className={`max-w-full max-h-full object-contain transition-all duration-300 select-none ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            style={{
              transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
              transformOrigin: 'center center'
            }}
            onLoad={handleImageLoad}
            draggable={false}
          />

          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                disabled={isTransitioning}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white hover:bg-gray-100 text-gray-700 transition-all hover:scale-110 shadow-lg disabled:opacity-50"
                title="Previous (←)"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={handleNext}
                disabled={isTransitioning}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white hover:bg-gray-100 text-gray-700 transition-all hover:scale-110 shadow-lg disabled:opacity-50"
                title="Next (→)"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="p-3 bg-gray-50 border-t border-gray-200">
            <div className="flex gap-2 overflow-x-auto justify-center hide-scrollbar">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden transition-all ${
                    index === currentIndex
                      ? 'ring-3 ring-primary scale-105'
                      : 'ring-2 ring-white/30 hover:ring-white/60 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CSS for hiding scrollbar */}
        <style>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default FullScreenModal;
