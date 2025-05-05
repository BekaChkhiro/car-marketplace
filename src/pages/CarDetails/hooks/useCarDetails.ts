import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Car } from '../../../api/types/car.types';
import carService from '../../../api/services/carService';
import { useToast } from '../../../context/ToastContext';
import { customStyles } from '../styles/styles';

export interface CarFeature {
  name: string;
  value?: boolean;
}

export interface KeySpec {
  icon: JSX.Element;
  label: string;
  value: string;
  color?: string;
  textColor?: string;
}

export const useCarDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('details'); // 'details', 'specs', 'seller'
  const [showFullGallery, setShowFullGallery] = useState(false);
  const { showToast } = useToast();

  // Add custom styles to head
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = customStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    const fetchCar = async () => {
      setLoading(true);
      try {
        if (!id) {
          showToast('Invalid car ID', 'error');
          setLoading(false);
          return;
        }
        
        const carData = await carService.getCar(Number(id));
        if (carData) {
          setCar(carData);
          // Check if car is in favorites
          const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
          setIsFavorite(favorites.includes(carData.id));
        } else {
          showToast('Failed to load car details', 'error');
        }
      } catch (error) {
        console.error('Error fetching car details:', error);
        showToast('Error loading car details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id, showToast]);

  const toggleFavorite = () => {
    if (!car?.id) return;
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let newFavorites;
    
    if (isFavorite) {
      newFavorites = favorites.filter((favId: number) => favId !== car.id);
      showToast('Removed from favorites', 'info');
    } else {
      newFavorites = [...favorites, car.id];
      showToast('Added to favorites', 'success');
    }
    
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: car?.title || `${car?.brand || ''} ${car?.model || ''}`,
        url: window.location.href,
      }).catch(error => console.log('Error sharing', error));
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard', 'success');
    }
  };

  const toggleGallery = () => {
    setShowFullGallery(!showFullGallery);
  };

  return {
    car,
    loading,
    isFavorite,
    activeTab,
    showFullGallery,
    setActiveTab,
    toggleFavorite,
    handleShare,
    toggleGallery,
  };
};

export default useCarDetails;
