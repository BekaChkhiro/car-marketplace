import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavigation from './AdminNavigation';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const AdminLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { user } = useAuth();

  // Track window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  return (
    <div className="min-h-screen bg-gray-50 rounded-lg">
      {/* Mobile Header with Menu Button */}
      <div className="lg:hidden sticky top-0 z-20 bg-white shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white shadow-sm">
            {user?.username?.charAt(0).toUpperCase() || 'A'}
          </div>
          <span className="font-medium text-primary">ადმინ პანელი</span>
        </div>
        <button 
          onClick={toggleMobileMenu}
          className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={toggleMobileMenu}
          />
        )}

        {/* Side Navigation - desktop: always visible, mobile: conditionally visible */}
        <div className={`
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 transition-transform duration-300 ease-in-out
          fixed lg:relative z-40 lg:z-auto h-screen lg:block
        `}>
          <AdminNavigation onCloseMobileMenu={() => setIsMobileMenuOpen(false)} />
        </div>
        
        <main className="flex-1 rounded-lg overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;