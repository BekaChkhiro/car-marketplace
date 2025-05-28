import React from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../../i18n';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const currentLanguage = i18n.language;

  const handleLanguageChange = (lng: string) => {
    changeLanguage(lng);
  };

  return (
    <div className="relative inline-block text-left">
      <div className="group">
        <button
          type="button"
          className="inline-flex items-center justify-center w-full rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none"
          aria-expanded="true"
          aria-haspopup="true"
        >
          <Globe className="mr-2 h-5 w-5" aria-hidden="true" />
          <span>{currentLanguage === 'ka' ? t('georgian') : t('english')}</span>
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <button
              onClick={() => handleLanguageChange('ka')}
              className={`w-full text-left block px-4 py-2 text-sm ${
                currentLanguage === 'ka' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
              } hover:bg-gray-100 hover:text-gray-900`}
              role="menuitem"
            >
              {t('georgian')}
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`w-full text-left block px-4 py-2 text-sm ${
                currentLanguage === 'en' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
              } hover:bg-gray-100 hover:text-gray-900`}
              role="menuitem"
            >
              {t('english')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
