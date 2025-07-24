import React from 'react';
import { useTranslation } from 'react-i18next';

interface DriveTypeSwitcherProps {
  value: string | undefined;
  onChange: (value: string) => void;
  className?: string;
}


const DriveTypeSwitcher: React.FC<DriveTypeSwitcherProps> = ({ value, onChange, className = '' }) => {
  const { t } = useTranslation('filter');
  
  const driveTypeOptions = [
    { value: 'front', label: t('driveTypes.front') },
    { value: 'rear', label: t('driveTypes.rear') },
    { value: '4x4', label: t('driveTypes.allWheel') },
    { value: 'all', label: t('driveTypes.fourWheel') }
  ];

  return (
    <div className={`flex items-center p-1 bg-gray-100 rounded-lg ${className}`}>
      {driveTypeOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`w-1/4 py-2.5 text-sm font-medium rounded-md transition-all ${
            value === option.value
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default DriveTypeSwitcher;
