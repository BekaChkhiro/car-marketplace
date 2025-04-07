import React from 'react';

export type Language = 'ka' | 'en' | 'ru';

interface LanguageSwitcherProps {
  value: Language;
  onChange: (value: Language) => void;
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ value, onChange, className = '' }) => {
  return (
    <div className={`inline-flex items-center p-1 bg-gray-100 rounded-lg ${className}`}>
      <button
        type="button"
        className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
          value === 'ka'
            ? 'bg-white text-primary shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
        }`}
        onClick={() => onChange('ka')}
      >
        ქართ
      </button>
      <button
        type="button"
        className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
          value === 'en'
            ? 'bg-white text-primary shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
        }`}
        onClick={() => onChange('en')}
      >
        Eng
      </button>
      <button
        type="button"
        className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
          value === 'ru'
            ? 'bg-white text-primary shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
        }`}
        onClick={() => onChange('ru')}
      >
        Рус
      </button>
    </div>
  );
};

export default LanguageSwitcher;
