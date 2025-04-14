import { Heart } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { useWishlist } from '../../../../context/WishlistContext';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';

const WishlistButton = () => {
  const { isAuthenticated } = useAuth();
  const { wishlistCount } = useWishlist();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setIsLoginOpen(true);
    }
  };

  return (
    <>
      <Link 
        to="/profile/wishlist"
        onClick={handleClick}
        className="flex items-center space-x-1.5 text-gray-dark 
          hover:text-primary transition-colors group relative"
      >
        <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
        {wishlistCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-white text-xs 
            rounded-full w-4 h-4 flex items-center justify-center">
            {wishlistCount}
          </span>
        )}
      </Link>

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
    </>
  );
};

export default WishlistButton;