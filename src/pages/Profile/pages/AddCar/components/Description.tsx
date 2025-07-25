import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher, { Language } from '../../../../../components/LanguageSwitcher';

interface DescriptionProps {
  description_en?: string;
  description_ka?: string;
  description_ru?: string;
  onChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

const Description: React.FC<DescriptionProps> = ({ 
  description_en = '',
  description_ka = '',
  description_ru = '', 
  onChange,
  errors
}) => {
  const { t } = useTranslation('profile');
  const [activeLanguage, setActiveLanguage] = useState<Language>('ka');

  const getPlaceholder = (lang: Language) => {
    return t('addCar.description.placeholder');
  };

  const getLabel = (lang: Language) => {
    switch (lang) {
      case 'ka': return t('addCar.description.georgian');
      case 'en': return t('addCar.description.english');
      case 'ru': return t('addCar.description.russian');
      default: return '';
    }
  };

  const getValue = (lang: Language) => {
    switch (lang) {
      case 'ka': return description_ka;
      case 'en': return description_en;
      case 'ru': return description_ru;
      default: return '';
    }
  };

  const getError = (lang: Language) => {
    switch (lang) {
      case 'ka': return errors?.description_ka;
      case 'en': return errors?.description_en;
      case 'ru': return errors?.description_ru;
      default: return undefined;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(`description_${activeLanguage}`, e.target.value);
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex flex-col sm:flex-row justify-between items-start border-b pb-4">
        <h2 className="text-lg font-semibold text-gray-dark">
          {t('addCar.description.title')}
        </h2>
        <LanguageSwitcher 
          value={activeLanguage} 
          onChange={setActiveLanguage} 
          className="border shadow-sm"
        />
      </div>
      
      <div>
        <div>
          <label htmlFor={`description_${activeLanguage}`} className="block text-sm font-medium text-gray-700 mb-2">
            {getLabel(activeLanguage)} {activeLanguage === 'ka' && '*'}
          </label>
          <textarea
            id={`description_${activeLanguage}`}
            rows={8}
            value={getValue(activeLanguage)}
            onChange={handleChange}
            className={`w-full px-4 py-2 border-2 rounded-lg text-base ${
              getError(activeLanguage)
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-100 focus:border-primary focus:ring-primary/20'
            } focus:outline-none focus:ring-2 transition-colors resize-none`}
            placeholder={getPlaceholder(activeLanguage)}
          />
          {getError(activeLanguage) && (
            <p className="mt-1 text-sm text-red-600">{getError(activeLanguage)}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Description;