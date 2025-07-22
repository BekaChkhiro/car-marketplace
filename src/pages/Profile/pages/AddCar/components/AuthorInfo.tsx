import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormSectionProps } from '../types';

interface AuthorInfoProps {
  authorName: string;
  authorPhone: string;
  onAuthorNameChange: (value: string) => void;
  onAuthorPhoneChange: (value: string) => void;
  errors?: { [key: string]: string };
}

const AuthorInfo: React.FC<AuthorInfoProps> = ({
  authorName,
  authorPhone,
  onAuthorNameChange,
  onAuthorPhoneChange,
  errors
}) => {
  const { t } = useTranslation('profile');
  return (
    <div className="bg-white rounded-xl p-6 border">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('addCar.authorInfo.title')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="author_name" className="block text-sm font-medium text-gray-700 mb-1">
            {t('addCar.authorInfo.name')}
          </label>
          <input
            type="text"
            id="author_name"
            value={authorName}
            onChange={(e) => onAuthorNameChange(e.target.value)}
            className={`w-full px-3 py-2 border ${
              errors?.author_name ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
          />
          {errors?.author_name && (
            <p className="mt-1 text-sm text-red-600">{errors.author_name}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="author_phone" className="block text-sm font-medium text-gray-700 mb-1">
            {t('addCar.authorInfo.phone')}
          </label>
          <input
            type="tel"
            id="author_phone"
            value={authorPhone}
            onChange={(e) => onAuthorPhoneChange(e.target.value)}
            className={`w-full px-3 py-2 border ${
              errors?.author_phone ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
          />
          {errors?.author_phone && (
            <p className="mt-1 text-sm text-red-600">{errors.author_phone}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorInfo;
