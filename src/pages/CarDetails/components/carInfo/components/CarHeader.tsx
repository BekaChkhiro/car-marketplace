import React, { useState, useEffect } from 'react';
import { Heart, Share } from 'lucide-react';
import { usePrice } from '../../../../../context/usePrice';
import { useWishlist } from '../../../../../context/WishlistContext';
import { useToast } from '../../../../../context/ToastContext';
import { useAuth } from '../../../../../context/AuthContext';
import LoginModal from '../../../../../components/layout/Header/auth/LoginModal';
import RegisterModal from '../../../../../components/layout/Header/auth/RegisterModal';

interface CarHeaderProps {
  make: string;
  model: string;
  year: number;
  price: number;
  carId: number;
}

const CarHeader: React.FC<CarHeaderProps> = ({ make, model, year, price, carId }) => {
  const { formatPrice } = usePrice();
  const { isAuthenticated } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { showToast } = useToast();
  const [isInWishlistState, setIsInWishlistState] = useState(false);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      checkWishlistStatus();
    }
  }, [carId, isAuthenticated]);

  const checkWishlistStatus = async () => {
    try {
      const exists = await isInWishlist(carId);
      setIsInWishlistState(exists);
    } catch (err) {
      console.error('Error checking wishlist status:', err);
    }
  };

  const handleWishlistClick = async () => {
    if (!isAuthenticated) {
      setIsLoginOpen(true);
      return;
    }

    if (isLoadingWishlist) return;

    setIsLoadingWishlist(true);
    try {
      if (isInWishlistState) {
        await removeFromWishlist(carId);
        showToast('მანქანა წაიშალა სასურველებიდან', 'success');
      } else {
        await addToWishlist(carId);
        showToast('მანქანა დაემატა სასურველებში', 'success');
      }
      setIsInWishlistState(!isInWishlistState);
    } catch (err: any) {
      showToast(err.message || 'Error updating wishlist', 'error');
    } finally {
      setIsLoadingWishlist(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('ბმული დაკოპირდა', 'success');
  };

  return (
    <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
      <div className="flex-1 min-w-[280px]">
        <h1 className="text-3xl font-bold mb-2 text-gray-dark leading-tight">
          {year} {make} {model}
        </h1>
        <div className="flex gap-4 mt-4">
          <button 
            onClick={handleWishlistClick}
            className={`flex items-center justify-center space-x-2 px-4 py-2.5 
              rounded-xl transition-colors border border-gray-100
              ${isInWishlistState 
                ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                : 'text-gray-dark hover:text-red-500 hover:bg-red-50'
              }`}
            disabled={isLoadingWishlist}
          >
            <Heart className={`w-4 h-4 ${isLoadingWishlist ? 'animate-pulse' : ''}`} />
            <span className="text-sm font-medium">
              {isInWishlistState ? 'სასურველებშია' : 'სასურველებში დამატება'}
            </span>
          </button>
          <button 
            onClick={handleShare}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 
              rounded-xl text-gray-dark hover:text-primary transition-colors
              hover:bg-green-light border border-gray-100"
          >
            <Share className="w-4 h-4" />
            <span className="text-sm font-medium">გაზიარება</span>
          </button>
        </div>
      </div>
      <div className="text-right">
        <div className="text-3xl text-primary font-bold leading-none">
          {formatPrice(price)}
        </div>
      </div>

      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onShowRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />
      <RegisterModal 
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </div>
  );
};

export default CarHeader;