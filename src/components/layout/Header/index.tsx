import React from 'react';
import { Globe, User, Plus } from 'lucide-react';

const Header = () => {
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
              {/* Language Selector */}
              <button className="flex items-center space-x-1.5 text-gray-dark 
                hover:text-primary transition-colors group">
                <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span className="text-sm">ქართული</span>
              </button>
              
              {/* Login Button */}
              <button className="flex items-center space-x-2 text-gray-dark 
                hover:text-primary transition-colors px-3 py-1.5 rounded-lg
                hover:bg-green-light">
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">შესვლა</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;