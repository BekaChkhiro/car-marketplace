import React, { useState, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { getStoredPreferences, storePreferences } from '../../../../utils/userPreferences';

interface Language {
  id: string;
  name: string;
}

interface LanguageSelectorProps {
  languages: Language[];
  currentLanguage: string;
  onLanguageChange: (langName: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ languages, currentLanguage, onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (langId: string, langName: string) => {
    onLanguageChange(langName);
    storePreferences({ language: langId });
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
        <span>{currentLanguage}</span>
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
        <div className="absolute right-0 mt-2 py-2 w-32 bg-white rounded-xl shadow-lg border border-gray-100">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => handleLanguageChange(lang.id, lang.name)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                currentLanguage === lang.name
                  ? 'text-primary font-medium'
                  : 'text-gray-700'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;