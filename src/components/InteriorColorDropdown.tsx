import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { INTERIOR_COLOR_OPTIONS } from '../pages/Profile/pages/AddCar/types';

interface InteriorColorDropdownProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

const InteriorColorDropdown: React.FC<InteriorColorDropdownProps> = ({ 
  value, 
  onChange, 
  error, 
  placeholder = 'აირჩიეთ სალონის ფერი' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Map color values to Tailwind classes
  const colorClasses: Record<string, string> = {
    black: 'bg-black',
    white: 'bg-white border border-gray-300',
    gray: 'bg-gray-400',
    brown: 'bg-amber-800',
    beige: 'bg-yellow-100 border border-gray-300',
    red: 'bg-red-600',
    blue: 'bg-blue-600',
    yellow: 'bg-yellow-400',
    orange: 'bg-orange-500',
    burgundy: 'bg-red-800',
    gold: 'bg-yellow-600'
  };

  // Close dropdown when clicking outside
  useEffect(() => {
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

  const selectedColor = INTERIOR_COLOR_OPTIONS.find(option => option.value === value);

  return (
    <div className="relative border-2 rounded-lg" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 border-2 rounded-lg text-base text-left bg-white hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 flex items-center justify-between ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <div className="flex items-center">
          {selectedColor ? (
            <>
              <div 
                className={`w-5 h-5 rounded-full mr-2 ${colorClasses[selectedColor.value] || 'bg-gray-200'}`}
              ></div>
              <span>{selectedColor.label}</span>
            </>
          ) : (
            <span className="text-gray-500 text-sm sm:text-base">{placeholder}</span>
          )}
        </div>
        <ChevronDown size={18} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {INTERIOR_COLOR_OPTIONS.map((option) => (
            <div
              key={option.value}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              <div 
                className={`w-5 h-5 rounded-full mr-2 ${colorClasses[option.value] || 'bg-gray-200'}`}
              ></div>
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InteriorColorDropdown;
