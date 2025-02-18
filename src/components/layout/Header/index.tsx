import React, { useState } from 'react';
import { Globe, User, Plus, Heart, UserPlus, ChevronDown, CircleDollarSign } from 'lucide-react';

const Header = () => {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('ქართული');
  const [currentCurrency, setCurrentCurrency] = useState('GEL');

  const languages = [
    { id: 'ka', name: 'ქართული' },
    { id: 'ru', name: 'რუსული' },
    { id: 'en', name: 'ინგლისური' },
  ];

  const handleLanguageChange = (langName: string) => {
    setCurrentLanguage(langName);
    setIsLanguageOpen(false);
  };

  const menuItems = [
    { id: 1, text: 'მთავარი', href: '/' },
    { id: 2, text: 'მანქანები', href: '/cars' },
    { id: 3, text: 'კომპანიის შესახებ', href: '/about' },
    { id: 4, text: 'კონტაქტი', href: '/contact' },
  ];

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50 border-b">
      <div className="w-[90%] mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Menu Section */}
          <div className="flex items-center space-x-12">
            <a 
              href="/" 
              className="text-2xl font-bold text-primary hover:opacity-90 transition-opacity"
            >
              Big Way
            </a>
            
            {/* Navigation Menu */}
            <nav className="flex items-center">
              <ul className="flex items-center space-x-8 m-0">
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <a 
                      href={item.href}
                      className="text-gray-dark hover:text-primary 
                        transition-colors py-2 font-medium"
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-6">
            {/* Add Button */}
            <button className="flex items-center space-x-2 bg-primary text-white px-4 py-2 
              rounded-xl hover:bg-secondary transition-all duration-200 
              transform hover:scale-105 shadow-sm hover:shadow-md">
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">დამატება</span>
            </button>
            
            {/* User Controls */}
            <div className="flex items-center space-x-6">
              {/* Wishlist Button */}
              <button className="flex items-center space-x-1.5 text-gray-dark 
                hover:text-primary transition-colors group relative">
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs 
                  rounded-full w-4 h-4 flex items-center justify-center">0</span>
              </button>

              {/* Currency Selector */}
              <div className="relative group">
                <button 
                  className="flex items-center space-x-1.5 text-gray-dark 
                    hover:text-primary transition-colors group py-2 px-2
                    rounded-lg hover:bg-gray-50"
                >
                  <CircleDollarSign className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm font-medium min-w-[40px]">{currentCurrency}</span>
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180 duration-300" />
                </button>
                
                <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 
                  absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg 
                  border border-gray-100 py-3 w-48 transition-all duration-300
                  transform translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="px-4 pb-2 mb-2 border-b border-gray-100">
                    <p className="text-sm text-gray-600">მიმდინარე კურსი</p>
                    <p className="text-sm font-medium flex items-center space-x-1">
                      <span>1 USD</span>
                      <span className="text-gray-400">=</span>
                      <span className="text-primary">2.65 GEL</span>
                    </p>
                  </div>
                  <button 
                    onClick={() => setCurrentCurrency('GEL')}
                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center space-x-2
                      hover:bg-gray-50 hover:text-primary transition-all duration-200
                      ${currentCurrency === 'GEL' ? 'text-primary font-medium bg-gray-50' : 'text-gray-dark'}`}
                  >
                    <span className="text-lg">🇬🇪</span>
                    <span>ლარი (GEL)</span>
                  </button>
                  <button 
                    onClick={() => setCurrentCurrency('USD')}
                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center space-x-2
                      hover:bg-gray-50 hover:text-primary transition-all duration-200
                      ${currentCurrency === 'USD' ? 'text-primary font-medium bg-gray-50' : 'text-gray-dark'}`}
                  >
                    <span className="text-lg">🇺🇸</span>
                    <span>დოლარი (USD)</span>
                  </button>
                </div>
              </div>

              {/* Language Selector */}
              <div className="relative group">
                <button 
                  className="flex items-center space-x-1.5 text-gray-dark 
                    hover:text-primary transition-colors group py-2"
                >
                  <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span className="text-sm">{currentLanguage}</span>
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180 duration-300" />
                </button>
                
                <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 
                  absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg 
                  border border-gray-100 py-2 w-40 transition-all duration-300
                  transform translate-y-2 group-hover:translate-y-0">
                  {languages.filter(lang => lang.name !== currentLanguage).map(lang => (
                    <button 
                      key={lang.id}
                      onClick={() => handleLanguageChange(lang.name)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-dark 
                        hover:bg-gray-50 hover:text-primary transition-colors
                        hover:pl-6 duration-200"
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Auth Buttons */}
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 text-gray-dark 
                  hover:text-primary transition-colors px-3 py-1.5 rounded-lg
                  hover:bg-green-light">
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">შესვლა</span>
                </button>
                <button className="flex items-center space-x-2 text-sm font-medium bg-primary text-white 
                  px-4 py-2 rounded-xl hover:bg-secondary transition-all duration-300 
                  transform hover:scale-105 shadow-sm hover:shadow-md 
                  border-2 border-transparent hover:border-secondary">
                  <UserPlus className="w-5 h-5" />
                  <span>რეგისტრაცია</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;