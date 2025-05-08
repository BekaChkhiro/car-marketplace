import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Car } from '../../../api/types/car.types';
import carService from '../../../api/services/carService';
import wishlistService from '../../../api/services/wishlistService';
import { useToast } from '../../../context/ToastContext';
import { useAuth } from '../../../context/AuthContext';
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

export const useCarDetails = (refreshTrigger: boolean = false) => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('details'); // 'details', 'specs', 'seller'
  const [showFullGallery, setShowFullGallery] = useState(false);
  const { showToast } = useToast();
  const { isAuthenticated, user } = useAuth();

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
          // Check wishlist status only if user is authenticated
          if (isAuthenticated) {
            try {
              const isInWishlist = await wishlistService.isInWishlist(Number(carData.id));
              setIsFavorite(isInWishlist);
            } catch (error) {
              console.error('Error checking wishlist status:', error);
              // Fallback to localStorage if API fails
              const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
              setIsFavorite(favorites.includes(carData.id));
            }
          } else {
            // Not logged in, use localStorage
            const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
            setIsFavorite(favorites.includes(carData.id));
          }
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
  }, [id, showToast, isAuthenticated, refreshTrigger]);

  const toggleFavorite = async () => {
    if (!car?.id) return;
    
    // If user is not authenticated, prompt login
    if (!isAuthenticated) {
      showToast('გთხოვთ გაიაროთ ავტორიზაცია ფავორიტებში დასამატებლად', 'warning');
      // Update localStorage for non-authenticated users
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      let newFavorites;
      
      if (isFavorite) {
        newFavorites = favorites.filter((favId: number) => favId !== car.id);
      } else {
        newFavorites = [...favorites, car.id];
      }
      
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setIsFavorite(!isFavorite);
      return;
    }
    
    try {
      if (isFavorite) {
        // Remove from wishlist
        await wishlistService.removeFromWishlist(car.id);
        showToast('წაშლილია ფავორიტებიდან', 'info');
      } else {
        // Add to wishlist
        await wishlistService.addToWishlist(car.id);
        showToast('დამატებულია ფავორიტებში', 'success');
      }
      
      // Also update localStorage for redundancy
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      let newFavorites;
      
      if (isFavorite) {
        newFavorites = favorites.filter((favId: number) => favId !== car.id);
      } else {
        newFavorites = [...favorites, car.id];
      }
      
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error updating wishlist:', error);
      showToast('ვერ მოხერხდა ფავორიტებში დამატება/წაშლა', 'error');
    }
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
