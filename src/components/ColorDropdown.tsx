import React from 'react';
import { ChevronDown } from 'lucide-react';
import { COLOR_OPTIONS } from '../pages/Profile/pages/AddCar/types';

interface ColorDropdownProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

const ColorDropdown: React.FC<ColorDropdownProps> = ({ 
  value, 
  onChange, 
  error, 
  placeholder = 'აირჩიეთ ფერი' 
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

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

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedColor = COLOR_OPTIONS.find(option => option.value === value);

  return (
    <div className="relative border-2 rounded-lg" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 border-2 rounded-lg text-base bg-white hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 flex items-center justify-between ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <div className="flex items-center gap-2">
          {value ? (
            <>
              <span 
                className={`w-5 h-5 rounded-full ${colorMap[value] || 'bg-gray-200'} ${value === 'white' ? 'border border-gray-200' : ''}`}
              ></span>
              <span>{selectedColor?.label || value}</span>
            </>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
        <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {COLOR_OPTIONS.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`px-4 py-2.5 flex items-center gap-2 cursor-pointer hover:bg-gray-50 ${
                value === option.value ? 'bg-gray-100' : ''
              }`}
            >
              <span 
                className={`w-5 h-5 rounded-full ${colorMap[option.value] || 'bg-gray-200'} ${option.value === 'white' ? 'border border-gray-200' : ''}`}
              ></span>
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default ColorDropdown;
