import React, { useState } from 'react';
import styled from 'styled-components';
import { FaChevronLeft, FaChevronRight, FaExpand, FaTimes } from 'react-icons/fa';

const GalleryContainer = styled.div`
  position: relative;
  margin-bottom: ${({ theme }) => theme.spacing.section};
`;

const MainImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 600px;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.large};
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 80%, rgba(0, 0, 0, 0.2));
  }
`;

const MainImage = styled.div<{ imageUrl: string }>`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
  transition: transform 0.5s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const ThumbnailContainer = styled.div`
  position: relative;
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.md};
  overflow-x: auto;
  scroll-behavior: smooth;
  
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.lightGray};
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary};
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }
`;

const Thumbnail = styled.div<{ imageUrl: string; isActive: boolean }>`
  width: 120px;
  height: 90px;
  flex-shrink: 0;
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.default};
  border: 3px solid ${props => props.isActive ? props.theme.colors.primary : 'transparent'};
  opacity: ${props => props.isActive ? 1 : 0.7};
  transform: ${props => props.isActive ? 'scale(1.05)' : 'scale(1)'};
  box-shadow: ${props => props.isActive ? props.theme.shadows.medium : 'none'};
  
  &:hover {
    opacity: 1;
    transform: scale(1.05);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const NavigationButton = styled.button<{ theme: any }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: ${({ theme }) => `${theme.colors.background}CC`};
  color: ${({ theme }) => theme.colors.primary};
  border: none;
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.default};
  backdrop-filter: blur(8px);
  
  &:hover {
    background: ${({ theme }) => theme.colors.background};
    transform: translateY(-50%) scale(1.1);
  }
  
  &.prev {
    left: ${({ theme }) => theme.spacing.lg};
  }
  
  &.next {
    right: ${({ theme }) => theme.spacing.lg};
  }

  svg {
    font-size: ${({ theme }) => theme.fontSizes.large};
  }
`;

const FullscreenButton = styled.button<{ theme: any }>`
  position: absolute;
  top: ${({ theme }) => theme.spacing.lg};
  right: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => `${theme.colors.background}CC`};
  color: ${({ theme }) => theme.colors.primary};
  border: none;
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.default};
  backdrop-filter: blur(8px);
  z-index: 1;
  
  &:hover {
    background: ${({ theme }) => theme.colors.background};
    transform: scale(1.1);
  }

  svg {
    font-size: ${({ theme }) => theme.fontSizes.large};
  }
`;

const Modal = styled.div<{ theme: any }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => `${theme.colors.background}F5`};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(10px);
  padding: ${({ theme }) => theme.spacing.xl};
`;

const ModalContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalImage = styled.div<{ imageUrl: string }>`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.imageUrl});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  transition: transform 0.3s ease;
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing.lg};
  right: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.error};
  color: white;
  border: none;
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.default};
  z-index: 1;
  
  &:hover {
    transform: scale(1.1);
    background: ${({ theme }) => theme.colors.error};
  }

  svg {
    font-size: ${({ theme }) => theme.fontSizes.large};
  }
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
      <MainImageWrapper>
        <MainImage imageUrl={images[currentIndex]} />
        <NavigationButton className="prev" onClick={handlePrevious}>
          <FaChevronLeft />
        </NavigationButton>
        <NavigationButton className="next" onClick={handleNext}>
          <FaChevronRight />
        </NavigationButton>
        <FullscreenButton onClick={() => setIsModalOpen(true)}>
          <FaExpand />
        </FullscreenButton>
      </MainImageWrapper>

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
        <Modal>
          <ModalContent>
            <ModalImage imageUrl={images[currentIndex]} />
            <CloseButton onClick={() => setIsModalOpen(false)}>
              <FaTimes />
            </CloseButton>
            <NavigationButton className="prev" onClick={handlePrevious}>
              <FaChevronLeft />
            </NavigationButton>
            <NavigationButton className="next" onClick={handleNext}>
              <FaChevronRight />
            </NavigationButton>
          </ModalContent>
        </Modal>
      )}
    </GalleryContainer>
  );
};

export default ImageGallery;