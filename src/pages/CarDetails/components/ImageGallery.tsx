import React, { useState } from 'react';
import styled from 'styled-components';
import { FaChevronLeft, FaChevronRight, FaExpand } from 'react-icons/fa';

const GalleryContainer = styled.div`
  position: relative;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const MainImage = styled.div<{ imageUrl: string }>`
  width: 100%;
  height: 400px;
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ThumbnailContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  overflow-x: auto;
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.lightGray};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.secondary};
    border-radius: 3px;
  }
`;

const Thumbnail = styled.div<{ imageUrl: string; isActive: boolean }>`
  width: 100px;
  height: 75px;
  flex-shrink: 0;
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  cursor: pointer;
  opacity: ${props => props.isActive ? 1 : 0.6};
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 1;
  }
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
  
  &.prev {
    left: ${({ theme }) => theme.spacing.md};
  }
  
  &.next {
    right: ${({ theme }) => theme.spacing.md};
  }
`;

const FullscreenButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalImage = styled.div<{ imageUrl: string }>`
  width: 90%;
  height: 90%;
  background-image: url(${props => props.imageUrl});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
`;

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

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isModalOpen]);

  return (
    <GalleryContainer>
      <MainImage imageUrl={images[currentIndex]}>
        <NavigationButton className="prev" onClick={handlePrevious}>
          <FaChevronLeft />
        </NavigationButton>
        <NavigationButton className="next" onClick={handleNext}>
          <FaChevronRight />
        </NavigationButton>
        <FullscreenButton onClick={() => setIsModalOpen(true)}>
          <FaExpand />
        </FullscreenButton>
      </MainImage>

      <ThumbnailContainer>
        {images.map((image, index) => (
          <Thumbnail
            key={index}
            imageUrl={image}
            isActive={index === currentIndex}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </ThumbnailContainer>

      {isModalOpen && (
        <Modal onClick={() => setIsModalOpen(false)}>
          <ModalImage imageUrl={images[currentIndex]} />
        </Modal>
      )}
    </GalleryContainer>
  );
};

export default ImageGallery;