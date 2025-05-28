import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import SideNavigation from './components/SideNavigation';
import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../i18n';

const ProfilePage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const activeTab = location.pathname.split('/')[2] || 'info';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { t } = useTranslation([namespaces.profile, namespaces.common]);
  const { lang } = useParams<{ lang: string }>();

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <svg className="animate-spin w-full h-full text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-gray-600 animate-pulse">{t('profile:common.pleaseWait')}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 rounded-lg">
      {/* Mobile Header with Menu Button */}
      <div className="lg:hidden sticky top-0 z-20 bg-white shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white shadow-sm">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span className="font-medium text-gray-800">{user?.username}</span>
        </div>
        <button 
          onClick={toggleMobileMenu}
          className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={24} />
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
          <SideNavigation onCloseMobileMenu={() => setIsMobileMenuOpen(false)} />
        </div>
        
        <main className="flex-1 py-4 px-4 md:py-6 md:px-6 lg:py-8 lg:px-8">
          <div className="mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;