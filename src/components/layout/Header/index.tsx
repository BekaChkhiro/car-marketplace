import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from './components/Logo';
import Navigation from './components/Navigation';
import AddButton from './components/AddButton';
import WishlistButton from './components/WishlistButton';
import CurrencySelector from './components/CurrencySelector';
import LanguageSelector from './components/LanguageSelector';
import AuthButtons from './components/AuthButtons';
import CarsDropdown from './components/CarsDropdown';
import { Home, Car, Info, Phone, Heart, Settings, User, ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const Header = () => {
  const { t, i18n } = useTranslation('header');
  const location = useLocation();
  const { lang } = useParams<{ lang: string }>();
  const { isAuthenticated, logout } = useAuth();
  
  // Current language from URL or default
  const currentLang = lang || i18n.language || 'ka';
  // Language is now managed by i18n system
  const [currentCurrency, setCurrentCurrency] = useState('GEL');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [touchFeedback, setTouchFeedback] = useState<string | null>(null);

  // Languages are now managed by the LanguageSelector component internally

  const menuItems = [
    { id: 1, text: t('home'), href: '/', icon: Home },
    { id: 2, component: CarsDropdown, icon: Car },
    { id: 3, text: t('parts'), href: '/parts', icon: Car },
    { id: 4, text: t('aboutUs'), href: '/about', icon: Info },
    { id: 5, text: t('contact'), href: '/contact', icon: Phone },
  ];
  
  // Helper function to prefix paths with current language
  const langPath = (path: string): string => {
    // If path already starts with lang code, don't add it again
    if (path.startsWith(`/${currentLang}/`)) return path;
    if (path === '/') return `/${currentLang}`;
    return `/${currentLang}${path}`;
  };
  
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path === '/cars' && location.pathname.includes('/cars')) return true;
    if (path === '/parts' && location.pathname.includes('/parts')) return true;
    if (path === '/about' && location.pathname.includes('/about')) return true;
    if (path === '/contact' && location.pathname.includes('/contact')) return true;
    if (path === '/wishlist' && location.pathname.includes('/wishlist')) return true;
    if (path === '/profile' && location.pathname.includes('/profile')) return true;
    return false;
  };
  
  const provideTouchFeedback = (path: string) => {
    setTouchFeedback(path);
    setTimeout(() => setTouchFeedback(null), 300);
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (mobileMenuOpen && !target.closest('.mobile-menu') && !target.closest('.menu-toggle')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  // Language change is now handled by the LanguageSelector component internally

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50 border-b">
      <div className="w-[90%] mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Menu Toggle */}
          <div className="flex items-center">
            <Logo text="Big Way" />
            
            {/* Desktop Navigation */}
            <div className="hidden md:block ml-12">
              <Navigation menuItems={menuItems} />
            </div>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button 
            className="md:hidden flex flex-col justify-center items-center menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-gray-700 transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'transform rotate-45 translate-y-1.5' : 'mb-1.5'}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-700 transition-opacity duration-300 ease-in-out ${mobileMenuOpen ? 'opacity-0' : 'mb-1.5'}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-700 transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'transform -rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-6">
            <AddButton />
            
            {/* User Controls */}
            <div className="flex items-center space-x-6">
              <WishlistButton />
              <CurrencySelector />
              <LanguageSelector />
              <AuthButtons />
            </div>
          </div>

          {/* Tablet Right Section (Simplified) */}
          <div className="hidden sm:flex md:hidden items-center space-x-4">
            <AddButton />
            <WishlistButton />
            <AuthButtons />
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleMobileMenu}
      ></div>

      {/* Improved Mobile Menu */}
      <div 
        className={`fixed top-0 right-0 w-[85%] max-w-xs h-full bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out mobile-menu overflow-y-auto ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Menu Header */}
        <div className="sticky top-0 bg-white z-10 border-b border-gray-100 shadow-sm">
          <div className="flex justify-between items-center px-4 py-3.5">
            <Logo text="Big Way" />
            <button 
              onClick={toggleMobileMenu}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="დახურვა"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-3 py-2">
          {/* Main Navigation */}
          <div className="mb-4">
            <h3 className="text-xs uppercase text-gray-500 font-medium px-3 py-2">მენიუ</h3>
            <nav className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-100">
              <ul>
                {menuItems.map((item) => (
                  <li key={item.id} className="border-b border-gray-100 last:border-0">
                    {item.component ? (
                      <div 
                        onClick={() => {
                          setMobileMenuOpen(false);
                          provideTouchFeedback(item.href || '/cars');
                        }}
                        className={`py-3 px-3 ${isActive(item.href || '/cars') ? 'bg-gray-50' : ''}`}
                      >
                        <div className="flex items-center space-x-3">
                          {item.icon && <item.icon size={18} className={`${isActive(item.href || '/cars') ? 'text-primary' : 'text-gray-500'}`} />}
                          <span className="flex-1">მანქანები</span>
                          <ChevronRight size={16} className="text-gray-400" />
                        </div>
                      </div>
                    ) : (
                      <Link
                        to={item.href || '/'}
                        className={`py-3 px-3 flex items-center space-x-3 ${isActive(item.href || '/') ? 'text-primary bg-gray-50' : 'text-gray-700'} ${touchFeedback === item.href ? 'animate-quick-pulse' : ''}`}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          provideTouchFeedback(item.href || '/');
                        }}
                      >
                        {item.icon && <item.icon size={18} className={isActive(item.href || '/') ? 'text-primary' : 'text-gray-500'} />}
                        <span>{item.text}</span>
                        <ChevronRight size={16} className="text-gray-400 ml-auto" />
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Action Buttons */}
          <div className="mb-4">
            <h3 className="text-xs uppercase text-gray-500 font-medium px-3 py-2">მოქმედებები</h3>
            <div className="flex space-x-2 px-1">
              <Link 
                to="/add-car" 
                className="flex items-center justify-center py-2.5 px-3 bg-primary text-white rounded-md text-sm font-medium flex-1 shadow-sm hover:bg-primary/90 transition-colors"
                onClick={() => {
                  setMobileMenuOpen(false);
                  provideTouchFeedback('/add-car');
                }}
              >
                <span>+ მანქანის დამატება</span>
              </Link>
              <Link 
                to={langPath('/wishlist')} 
                className={`flex items-center justify-center py-2.5 px-3 bg-gray-100 text-gray-700 rounded-md text-sm font-medium flex-1 hover:bg-gray-200 transition-colors ${isActive('/wishlist') ? 'border-l-4 border-primary pl-2' : ''} ${touchFeedback === '/wishlist' ? 'animate-quick-pulse' : ''}`}
                onClick={() => {
                  setMobileMenuOpen(false);
                  provideTouchFeedback('/wishlist');
                }}
              >
                <Heart size={16} className="mr-1.5" />
                <span>{t('favorites')}</span>
              </Link>
            </div>
          </div>

          {/* Account Section */}
          <div className="mb-4">
            <h3 className="text-xs uppercase text-gray-500 font-medium px-3 py-2">ანგარიში</h3>
            <div className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-100">
              {isAuthenticated ? (
                <>
                  <Link 
                    to={langPath('/profile')} 
                    className={`py-3 px-3 flex items-center space-x-3 border-b border-gray-100 ${isActive('/profile') ? 'text-primary bg-gray-50' : 'text-gray-700'} ${touchFeedback === '/profile' ? 'animate-quick-pulse' : ''}`}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      provideTouchFeedback('/profile');
                    }}
                  >
                    <User size={18} className={isActive('/profile') ? 'text-primary' : 'text-gray-500'} />
                    <span>{t('profile')}</span>
                    <ChevronRight size={16} className="text-gray-400 ml-auto" />
                  </Link>
                  <Link 
                    to={langPath('/profile/settings')} 
                    className={`py-3 px-3 flex items-center space-x-3 border-b border-gray-100 ${isActive('/profile/settings') ? 'text-primary bg-gray-50' : 'text-gray-700'} ${touchFeedback === '/profile/settings' ? 'animate-quick-pulse' : ''}`}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      provideTouchFeedback('/profile/settings');
                    }}
                  >
                    <Settings size={18} className={isActive('/profile/settings') ? 'text-primary' : 'text-gray-500'} />
                    <span>{t('settings')}</span>
                    <ChevronRight size={16} className="text-gray-400 ml-auto" />
                  </Link>
                  <button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full py-3 px-3 flex items-center space-x-3 text-gray-700 hover:bg-gray-50"
                  >
                    <LogOut size={18} className="text-gray-500" />
                    <span>{t('logout')}</span>
                  </button>
                </>
              ) : (
                <div className="p-3">
                  <AuthButtons />
                </div>
              )}
            </div>
          </div>

          {/* Settings */}
          <div className="mb-2">
            <h3 className="text-xs uppercase text-gray-500 font-medium px-3 py-2">{t('settings')}</h3>
            <div className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-100 p-3">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 mr-2">{t('currency')}:</span>
                  <CurrencySelector />
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-700 mr-2">{t('language')}:</span>
                <LanguageSelector />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;