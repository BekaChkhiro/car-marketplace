import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../../../../i18n';

interface Language {
  id: string;
  name: string;
}

const LanguageSelector: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const currentLanguage = i18n.language;
  
  const languages = [
    { id: 'ka', name: t('georgian') },
    { id: 'en', name: t('english') },
    { id: 'ru', name: t('russian') }
  ];

  const handleLanguageChange = (langId: string) => {
    // Will handle page refresh via the changeLanguage function
    changeLanguage(langId);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.language-selector')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative language-selector">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
      >
        <Globe className="w-4 h-4 mr-1" />
        <span>
          {currentLanguage === 'ka' ? 'Geo' : currentLanguage === 'ru' ? 'Rus' : 'Eng'}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 py-2 w-32 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => handleLanguageChange(lang.id)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                currentLanguage === lang.id
                  ? 'text-primary font-medium'
                  : 'text-gray-700'
              }`}
            >
              {lang.id === 'ka' ? 'Geo' : lang.id === 'ru' ? 'Rus' : 'Eng'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;