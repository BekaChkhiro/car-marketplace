import React from 'react';
import { COLOR_OPTIONS } from '../pages/Profile/pages/AddCar/types';

interface ColorSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ value, onChange, error }) => {
  // Map of color values to their visual representation
  const colorMap: Record<string, string> = {
    white: 'bg-white',
    black: 'bg-black',
    silver: 'bg-gray-300',
    gray: 'bg-gray-500',
    red: 'bg-red-600',
    blue: 'bg-blue-600',
    yellow: 'bg-yellow-400',
    green: 'bg-green-600',
    orange: 'bg-orange-500',
    gold: 'bg-yellow-600',
    purple: 'bg-purple-600',
    pink: 'bg-pink-400',
    beige: 'bg-yellow-100',
    burgundy: 'bg-red-800',
    lightblue: 'bg-blue-300',
    brown: 'bg-amber-800',
    other: 'bg-gradient-to-r from-purple-500 to-pink-500'
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {COLOR_OPTIONS.map((option) => (
          <div 
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              w-10 h-10 rounded-full cursor-pointer flex items-center justify-center
              ${colorMap[option.value] || 'bg-gray-200'}
              ${value === option.value ? 'ring-2 ring-offset-2 ring-primary' : 'hover:ring-2 hover:ring-offset-1 hover:ring-gray-300'}
              ${option.value === 'white' ? 'border border-gray-200' : ''}
              transition-all duration-200
            `}
            title={option.label}
          >
            {value === option.value && (
              <span className={`text-xs ${['white', 'yellow', 'beige', 'lightblue', 'silver'].includes(option.value) ? 'text-black' : 'text-white'}`}>
                ✓
              </span>
            )}
          </div>
        ))}
      </div>
      
      {/* Show selected color name */}
      <div className="text-sm text-gray-700">
        {value && `არჩეული: ${COLOR_OPTIONS.find(opt => opt.value === value)?.label || value}`}
      </div>
      
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default ColorSelector;
