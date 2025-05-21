import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Car, Heart, User } from 'lucide-react';

const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path === '/cars' && location.pathname.includes('/cars')) return true;
    if (path === '/wishlist' && location.pathname.includes('/wishlist')) return true;
    if (path === '/login' && (location.pathname.includes('/login') || location.pathname.includes('/profile'))) return true;
    return false;
  };

  return (
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
        
        <Link to="/wishlist" className={`flex flex-col items-center justify-center w-1/4 py-1 ${isActive('/wishlist') ? 'text-primary' : 'text-gray-500'}`}>
          <Heart size={20} strokeWidth={2} />
          <span className="text-xs mt-1">რჩეულები</span>
        </Link>
        
        <Link to="/login" className={`flex flex-col items-center justify-center w-1/4 py-1 ${isActive('/login') ? 'text-primary' : 'text-gray-500'}`}>
          <User size={20} strokeWidth={2} />
          <span className="text-xs mt-1">შესვლა</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileBottomNav;
