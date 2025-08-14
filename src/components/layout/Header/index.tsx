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
import LoginModal from './auth/LoginModal';
import RegisterModal from './auth/RegisterModal';
import { Home, Car, Info, Phone, Heart, Settings, User, ChevronRight, LogOut, CreditCard } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

// Define interfaces for menu items
interface BaseMenuItem {
  id: number;
  icon?: React.ComponentType<any>;
  href?: string;
}

interface TextMenuItem extends BaseMenuItem {
  text: string;
  component?: never;
}

interface ComponentMenuItem extends BaseMenuItem {
  component: React.ComponentType;
  text?: never;
}

type MenuItem = TextMenuItem | ComponentMenuItem;

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
  const [activeTab, setActiveTab] = useState<'menu' | 'profile'>('menu');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Languages are now managed by the LanguageSelector component internally

  const menuItems: MenuItem[] = [
    { id: 1, text: t('home'), href: '/', icon: Home },
    { id: 2, text: t('aboutUs'), href: '/about', icon: Info },
    { id: 3, text: t('cars'), href: '/cars', icon: Car },
    { id: 4, text: t('parts'), href: '/parts', icon: Car },
    { id: 5, text: t('dealers'), href: '/dealers', icon: Car },
    { id: 6, text: t('autosalons'), href: '/autosalons', icon: Car },
    { id: 7, text: t('ad'), href: '/advertising-spaces', icon: Info },
    { id: 8, text: t('contact'), href: '/contact', icon: Phone },
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
    if (path === '/dealers' && location.pathname.includes('/dealers')) return true;
    if (path === '/autosalons' && location.pathname.includes('/autosalons')) return true;
    if (path === '/about' && location.pathname.includes('/about')) return true;
    if (path === '/contact' && location.pathname.includes('/contact')) return true;
    if (path === '/advertising-spaces' && location.pathname.includes('/advertising-spaces')) return true;
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
    // Reset to menu tab when opening menu
    if (!mobileMenuOpen) {
      setActiveTab('menu');
    }
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
          {/* Logo */}
          <div className="flex items-center">
            <Logo />
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

        {/* Bottom Menu */}
        <div className="hidden md:flex items-center justify-between border-t mt-4 pt-3">
          {/* Left Side Menu Items */}
          <nav className="flex-1">
            <ul className="flex items-center space-x-10 mb-0">
              {menuItems.slice(0, 6).map((item) => (
                <li key={item.id}>
                  {item.component ? (
                    <item.component />
                  ) : (
                    <Link
                      to={langPath(item.href || '/')}
                      className="text-gray-600 hover:text-primary transition-colors font-medium text-sm flex items-center space-x-1"
                    >
                      {item.icon && <item.icon size={16} className="mr-1" />}
                      <span>{item.text}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Side Menu Items */}
          <nav>
            <ul className="flex items-center space-x-10 mb-0">
              {menuItems.slice(6, 8).map((item) => (
                <li key={item.id}>
                  {item.component ? (
                    <item.component />
                  ) : (
                    <Link
                      to={langPath(item.href || '/')}
                      className="text-gray-600 hover:text-primary transition-colors font-medium text-sm flex items-center space-x-1"
                    >
                      {item.icon && <item.icon size={16} className="mr-1" />}
                      <span>{item.text}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={toggleMobileMenu}
      ></div>

      {/* Improved Mobile Menu */}
      <div
        className={`fixed top-0 right-0 w-[85%] max-w-xs h-full bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out mobile-menu overflow-y-auto ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Menu Header */}
        <div className="sticky top-0 bg-white z-10 border-b border-gray-100 shadow-sm">
          <div className="flex justify-between items-center px-4 py-3.5">
            <Logo />
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
          
          {/* Tabs */}
          {isAuthenticated && (
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('menu')}
                className={`flex-1 py-3 px-4 text-sm font-medium text-center transition-colors ${
                  activeTab === 'menu'
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t('menu')}
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-3 px-4 text-sm font-medium text-center transition-colors ${
                  activeTab === 'profile'
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t('profile')}
              </button>
            </div>
          )}
        </div>

        <div className="px-3 py-2">
          {/* Menu Tab Content */}
          {(!isAuthenticated || activeTab === 'menu') && (
            <>
              {/* Main Navigation */}
              <div className="mb-4">
                <h3 className="text-xs uppercase text-gray-500 font-medium px-3 py-2">{t('menu')}</h3>
                <nav className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-100">
                  <ul>
                    {menuItems.map((item) => (
                      <li key={item.id} className="border-b border-gray-100 last:border-0">
                        {item.component ? (
                          <div
                            onClick={() => {
                              setMobileMenuOpen(false);
                              provideTouchFeedback(langPath(item.href || '/cars'));
                            }}
                            className={`py-3 px-3 ${isActive(item.href || '/cars') ? 'bg-gray-50' : ''}`}
                          >
                            <div className="flex items-center space-x-3">
                              {item.icon && <item.icon size={18} className={`${isActive(item.href || '/cars') ? 'text-primary' : 'text-gray-500'}`} />}
                              <span className="flex-1">{t('cars')}</span>
                              <ChevronRight size={16} className="text-gray-400" />
                            </div>
                          </div>
                        ) : (
                          <Link
                            to={langPath(item.href || '/')}
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


              {/* Account Section for non-authenticated users */}
              {!isAuthenticated && (
                <div className="mb-4">
                  <h3 className="text-xs uppercase text-gray-500 font-medium px-3 py-2">{t('account')}</h3>
                  <div className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-100">
                    <div className="p-3">
                      <AuthButtons 
                        isMobile={true} 
                        onClose={() => setMobileMenuOpen(false)}
                        onLoginOpen={() => setIsLoginOpen(true)}
                        onRegisterOpen={() => setIsRegisterOpen(true)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Settings */}
              <div className="mb-2">
                <h3 className="text-xs uppercase text-gray-500 font-medium px-3 py-2">{t('settings')}</h3>
                <div className="bg-white rounded-md overflow-visible shadow-sm border border-gray-100 p-4 space-y-5">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{t('currency')}</span>
                      <CurrencySelector />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{t('language')}</span>
                      <LanguageSelector />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Profile Tab Content */}
          {isAuthenticated && activeTab === 'profile' && (
            <>
              {/* Profile Navigation */}
              <div className="mb-4">
                <h3 className="text-xs uppercase text-gray-500 font-medium px-3 py-2">{t('profile')}</h3>
                <nav className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-100">
                  <ul>
                    <li className="border-b border-gray-100">
                      <Link
                        to={langPath('/profile')}
                        className={`py-3 px-3 flex items-center space-x-3 ${isActive('/profile') ? 'text-primary bg-gray-50' : 'text-gray-700'} ${touchFeedback === '/profile' ? 'animate-quick-pulse' : ''}`}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          provideTouchFeedback('/profile');
                        }}
                      >
                        <User size={18} className={isActive('/profile') ? 'text-primary' : 'text-gray-500'} />
                        <span>{t('profile')}</span>
                        <ChevronRight size={16} className="text-gray-400 ml-auto" />
                      </Link>
                    </li>
                    <li className="border-b border-gray-100">
                      <Link
                        to={langPath('/profile/cars')}
                        className={`py-3 px-3 flex items-center space-x-3 ${isActive('/profile/cars') ? 'text-primary bg-gray-50' : 'text-gray-700'} ${touchFeedback === '/profile/cars' ? 'animate-quick-pulse' : ''}`}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          provideTouchFeedback('/profile/cars');
                        }}
                      >
                        <Car size={18} className={isActive('/profile/cars') ? 'text-primary' : 'text-gray-500'} />
                        <span>{t('myCars')}</span>
                        <ChevronRight size={16} className="text-gray-400 ml-auto" />
                      </Link>
                    </li>
                    <li className="border-b border-gray-100">
                      <Link
                        to={langPath('/profile/balance')}
                        className={`py-3 px-3 flex items-center space-x-3 ${isActive('/profile/balance') ? 'text-primary bg-gray-50' : 'text-gray-700'} ${touchFeedback === '/profile/balance' ? 'animate-quick-pulse' : ''}`}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          provideTouchFeedback('/profile/balance');
                        }}
                      >
                        <CreditCard size={18} className={isActive('/profile/balance') ? 'text-primary' : 'text-gray-500'} />
                        <span>{t('balance')}</span>
                        <ChevronRight size={16} className="text-gray-400 ml-auto" />
                      </Link>
                    </li>
                    <li className="border-b border-gray-100">
                      <Link
                        to={langPath('/profile/settings')}
                        className={`py-3 px-3 flex items-center space-x-3 ${isActive('/profile/settings') ? 'text-primary bg-gray-50' : 'text-gray-700'} ${touchFeedback === '/profile/settings' ? 'animate-quick-pulse' : ''}`}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          provideTouchFeedback('/profile/settings');
                        }}
                      >
                        <Settings size={18} className={isActive('/profile/settings') ? 'text-primary' : 'text-gray-500'} />
                        <span>{t('settings')}</span>
                        <ChevronRight size={16} className="text-gray-400 ml-auto" />
                      </Link>
                    </li>
                    <li>
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
                    </li>
                  </ul>
                </nav>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Login/Register Modals */}
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
    </header>
  );
};

export default Header;