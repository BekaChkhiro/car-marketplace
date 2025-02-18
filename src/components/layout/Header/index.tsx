import React, { useState } from 'react';
import Logo from './components/Logo';
import Navigation from './components/Navigation';
import AddButton from './components/AddButton';
import WishlistButton from './components/WishlistButton';
import CurrencySelector from './components/CurrencySelector';
import LanguageSelector from './components/LanguageSelector';
import AuthButtons from './components/AuthButtons';

const Header = () => {
  const [currentLanguage, setCurrentLanguage] = useState('ქართული');
  const [currentCurrency, setCurrentCurrency] = useState('GEL');

  const languages = [
    { id: 'ka', name: 'ქართული' },
    { id: 'ru', name: 'რუსული' },
    { id: 'en', name: 'ინგლისური' },
  ];

  const menuItems = [
    { id: 1, text: 'მთავარი', href: '/' },
    { id: 2, text: 'მანქანები', href: '/cars' },
    { id: 3, text: 'კომპანიის შესახებ', href: '/about' },
    { id: 4, text: 'კონტაქტი', href: '/contact' },
  ];

  const handleLanguageChange = (langName: string) => {
    setCurrentLanguage(langName);
  };

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50 border-b">
      <div className="w-[90%] mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Menu Section */}
          <div className="flex items-center space-x-12">
            <Logo text="Big Way" />
            <Navigation menuItems={menuItems} />
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-6">
            <AddButton />
            
            {/* User Controls */}
            <div className="flex items-center space-x-6">
              <WishlistButton />
              <CurrencySelector 
                currentCurrency={currentCurrency}
                setCurrentCurrency={setCurrentCurrency}
              />
              <LanguageSelector 
                currentLanguage={currentLanguage}
                languages={languages}
                onLanguageChange={handleLanguageChange}
              />
              <AuthButtons />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;