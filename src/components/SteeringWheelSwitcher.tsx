import React from 'react';

interface SteeringWheelSwitcherProps {
  value: string | undefined;
  onChange: (value: string) => void;
  className?: string;
}

// Steering wheel options based on the existing STEERING_WHEEL_OPTIONS
const STEERING_WHEEL_OPTIONS = [
  { value: 'left', label: 'მარცხენა' },
  { value: 'right', label: 'მარჯვენა' }
];

const SteeringWheelSwitcher: React.FC<SteeringWheelSwitcherProps> = ({ value, onChange, className = '' }) => {
  return (
    <div className={`flex items-center p-1 bg-gray-100 rounded-lg ${className}`}>
      {STEERING_WHEEL_OPTIONS.map((option) => (
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
