import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Car, Heart, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LoginModal from '../layout/Header/auth/LoginModal';
import RegisterModal from '../layout/Header/auth/RegisterModal';

const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  
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
    }
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setShowLoginModal(true);
    }
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex justify-around items-center h-16">
          <Link to="/" className={`flex flex-col items-center justify-center w-1/4 py-1 ${isActive('/') ? 'text-primary' : 'text-gray-500'}`}>
            <Home size={20} strokeWidth={2} />
            <span className="text-xs mt-1">მთავარი</span>
          </Link>
          
          <Link to="/cars" className={`flex flex-col items-center justify-center w-1/4 py-1 ${isActive('/cars') ? 'text-primary' : 'text-gray-500'}`}>
            <Car size={20} strokeWidth={2} />
            <span className="text-xs mt-1">მანქანები</span>
          </Link>
          
          <button
            onClick={handleWishlistClick}
            className={`flex flex-col items-center justify-center w-1/4 py-1 ${isActive('/wishlist') ? 'text-primary' : 'text-gray-500'}`}
          >
            <Heart size={20} strokeWidth={2} />
            <span className="text-xs mt-1">რჩეულები</span>
          </button>
          
          <button
            onClick={handleProfileClick}
            className={`flex flex-col items-center justify-center w-1/4 py-1 ${isActive('/login') ? 'text-primary' : 'text-gray-500'}`}
          >
            <User size={20} strokeWidth={2} />
            <span className="text-xs mt-1">{isAuthenticated ? 'პროფილი' : 'შესვლა'}</span>
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
