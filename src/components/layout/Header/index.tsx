import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from './components/Logo';
import Navigation from './components/Navigation';
import AddButton from './components/AddButton';
import WishlistButton from './components/WishlistButton';
import CurrencySelector from './components/CurrencySelector';
import LanguageSelector from './components/LanguageSelector';
import AuthButtons from './components/AuthButtons';
import CarsDropdown from './components/CarsDropdown';

const Header = () => {
  const [currentLanguage, setCurrentLanguage] = useState('ქარ');
  const [currentCurrency, setCurrentCurrency] = useState('GEL');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const languages = [
    { id: 'ka', name: 'ქარ' },
    { id: 'ru', name: 'რუს' },
    { id: 'en', name: 'ინგ' },
  ];

  const menuItems = [
    { id: 1, text: 'მთავარი', href: '/' },
    { id: 2, component: CarsDropdown },
    { id: 3, text: 'კომპანიის შესახებ', href: '/about' },
    { id: 4, text: 'კონტაქტი', href: '/contact' },
  ];

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

  const handleLanguageChange = (langName: string) => {
    setCurrentLanguage(langName);
  };

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
              <LanguageSelector 
                currentLanguage={currentLanguage}
                languages={languages}
                onLanguageChange={handleLanguageChange}
              />
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
        className={`fixed inset-0 bg-black bg-opacity-20 z-40 transition-opacity duration-200 ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleMobileMenu}
      ></div>

      {/* Mobile Menu - Ultra Minimalist */}
      <div 
        className={`fixed top-0 right-0 w-[75%] max-w-xs h-full bg-white z-50 shadow-sm transform transition-transform duration-200 ease-in-out mobile-menu overflow-y-auto ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Minimal Header */}
        <div className="sticky top-0 bg-white z-10 border-b border-gray-50">
          <div className="flex justify-between items-center px-4 py-3">
            <Logo text="Big Way" />
            <button 
              onClick={toggleMobileMenu}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-4 py-3">
          {/* Main Navigation */}
          <nav>
            <ul>
              {menuItems.map((item) => (
                <li key={item.id} className="border-b border-gray-50 last:border-0">
                  {item.component ? (
                    <div 
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-3"
                    >
                      <item.component />
                    </div>
                  ) : (
                    <Link
                      to={item.href || '/'}
                      className="py-3 flex items-center text-gray-700 hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>{item.text}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Action Buttons - Super Minimal */}
          <div className="flex space-x-1 py-3 border-b border-gray-50">
            <Link 
              to="/add-car" 
              className="flex items-center justify-center py-2 px-3 bg-primary text-white rounded text-xs flex-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>დამატება</span>
            </Link>
            <Link 
              to="/wishlist" 
              className="flex items-center justify-center py-2 px-3 bg-gray-50 text-gray-700 rounded text-xs flex-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>რჩეულები</span>
            </Link>
          </div>

          {/* Settings - Ultra Minimal */}
          <div className="flex justify-between py-3 border-b border-gray-50">
            <div className="flex items-center">
              <span className="text-xs text-gray-500 mr-2">ვალუტა:</span>
              <CurrencySelector />
            </div>
            <div className="flex items-center">
              <span className="text-xs text-gray-500 mr-2">ენა:</span>
              <LanguageSelector 
                currentLanguage={currentLanguage}
                languages={languages}
                onLanguageChange={handleLanguageChange}
              />
            </div>
          </div>
          
          {/* Auth - Ultra Minimal */}
          <div className="py-3">
            <AuthButtons />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;