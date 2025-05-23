import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Car, Heart, User, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LoginModal from '../layout/Header/auth/LoginModal';
import RegisterModal from '../layout/Header/auth/RegisterModal';

const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [touchFeedback, setTouchFeedback] = useState<string | null>(null);
  
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path === '/cars' && location.pathname.includes('/cars')) return true;
    if (path === '/wishlist' && location.pathname.includes('/wishlist')) return true;
    if (path === '/login' && (location.pathname.includes('/login') || location.pathname.includes('/profile'))) return true;
    return false;
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setShowLoginModal(true);
    } else {
      navigate('/wishlist');
    }
    provideTouchFeedback('/wishlist');
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setShowLoginModal(true);
    } else {
      navigate('/profile');
    }
    provideTouchFeedback('/login');
  };
  
  const handleAddCarClick = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    } else {
      navigate('/add-car');
    }
    provideTouchFeedback('/add-car');
  };
  
  const provideTouchFeedback = (path: string) => {
    setTouchFeedback(path);
    setTimeout(() => setTouchFeedback(null), 300);
  };

  const handleCloseModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  const handleShowRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleShowLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg">
        <div className="flex justify-around items-center h-16">
          <Link 
            to="/" 
            onClick={() => provideTouchFeedback('/')} 
            className={`flex flex-col items-center justify-center w-1/5 py-1 relative ${isActive('/') ? 'text-primary' : 'text-gray-500'} ${touchFeedback === '/' ? 'animate-quick-pulse' : ''}`}
          >
            {isActive('/') && <div className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-primary"></div>}
            <Home size={22} strokeWidth={1.8} />
            <span className="text-[10px] mt-1">მთავარი</span>
          </Link>
          
          <Link 
            to="/cars" 
            onClick={() => provideTouchFeedback('/cars')} 
            className={`flex flex-col items-center justify-center w-1/5 py-1 relative ${isActive('/cars') ? 'text-primary' : 'text-gray-500'} ${touchFeedback === '/cars' ? 'animate-quick-pulse' : ''}`}
          >
            {isActive('/cars') && <div className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-primary"></div>}
            <Car size={22} strokeWidth={1.8} />
            <span className="text-[10px] mt-1">მანქანები</span>
          </Link>
          
          <button
            onClick={handleWishlistClick}
            className={`flex flex-col items-center justify-center w-1/5 py-1 relative ${isActive('/wishlist') ? 'text-primary' : 'text-gray-500'} ${touchFeedback === '/wishlist' ? 'animate-quick-pulse' : ''}`}
          >
            {isActive('/wishlist') && <div className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-primary"></div>}
            <Heart size={22} strokeWidth={1.8} />
            <span className="text-[10px] mt-1">რჩეულები</span>
          </button>
          
          <button
            onClick={handleAddCarClick}
            className={`flex flex-col items-center justify-center w-1/5 py-1 relative ${touchFeedback === '/add-car' ? 'animate-quick-pulse' : ''} text-primary`}
          >
            <div className="rounded-full bg-primary text-white p-1.5">
              <Plus size={16} strokeWidth={3} />
            </div>
            <span className="text-[10px] mt-1">დამატება</span>
          </button>

          <button
            onClick={handleProfileClick}
            className={`flex flex-col items-center justify-center w-1/5 py-1 relative ${isActive('/login') ? 'text-primary' : 'text-gray-500'} ${touchFeedback === '/login' ? 'animate-quick-pulse' : ''}`}
          >
            {isActive('/login') && <div className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-primary"></div>}
            <User size={22} strokeWidth={1.8} />
            <span className="text-[10px] mt-1">{isAuthenticated ? 'პროფილი' : 'შესვლა'}</span>
          </button>
      </div>
    </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={handleCloseModals}
        onShowRegister={handleShowRegister}
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={handleCloseModals}
        onSwitchToLogin={handleShowLogin}
      />
    </>
  );
};

export default MobileBottomNav;
