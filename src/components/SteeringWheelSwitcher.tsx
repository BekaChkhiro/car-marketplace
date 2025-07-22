import React from 'react';
import { useTranslation } from 'react-i18next';

interface SteeringWheelSwitcherProps {
  value: string | undefined;
  onChange: (value: string) => void;
  className?: string;
}


const SteeringWheelSwitcher: React.FC<SteeringWheelSwitcherProps> = ({ value, onChange, className = '' }) => {
  const { t } = useTranslation('filter');
  
  const steeringWheelOptions = [
    { value: 'left', label: t('steeringWheels.left') },
    { value: 'right', label: t('steeringWheels.right') }
  ];

  return (
    <div className={`flex items-center p-1 bg-gray-100 rounded-lg ${className}`}>
      {steeringWheelOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`w-1/2 py-2.5 text-sm font-medium rounded-md transition-all ${
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

export default SteeringWheelSwitcher;
