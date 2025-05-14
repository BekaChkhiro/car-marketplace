import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  isValid?: boolean;
  className?: string;
  icon?: React.ReactNode;
  multiple?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'აირჩიეთ',
  disabled = false,
  error,
  isValid,
  className = '',
  icon,
  multiple = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValues, setSelectedValues] = useState<string[]>(
    multiple ? (Array.isArray(value) ? value : []) : []
  );
  const selectRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOptions = multiple 
    ? options.filter(option => selectedValues.includes(option.value))
    : [];
  const singleSelectedOption = multiple 
    ? null 
    : options.find(option => option.value === value);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (multiple) {
      setSelectedValues(Array.isArray(value) ? value : []);
    }
  }, [value, multiple]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current && options.length > 4) {
      searchInputRef.current.focus();
    }
  }, [isOpen, options.length]);

  const getBorderColor = () => {
    if (error) return 'border-red-300 focus-within:border-red-500 focus-within:ring-red-200';
    if (isValid) return 'border-green-300';
    if (disabled) return 'border-gray-200';
    return 'border-gray-100 hover:border-primary focus-within:border-primary focus-within:ring-primary/20';
  };

  const handleOptionSelect = (optionValue: string) => {
    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue];
      setSelectedValues(newValues);
      onChange(newValues);
    } else {
      onChange(optionValue);
      setIsOpen(false);
    }
    setSearchTerm('');
  };

  const handleRemoveValue = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newValues = selectedValues.filter(v => v !== optionValue);
    setSelectedValues(newValues);
    onChange(newValues);
  };

  const renderSelectedValues = () => {
    if (!multiple) {
      return (
        <span className={`flex-1 text-sm sm:text-base ${value ? 'text-gray-900' : 'text-gray-500'}`}>
          {singleSelectedOption ? singleSelectedOption.label : placeholder}
        </span>
      );
    }

    if (selectedValues.length === 0) {
      return <span className="flex-1 text-gray-500">{placeholder}</span>;
    }

    return (
      <div className="flex flex-wrap gap-1 flex-1 ">
        {selectedValues.map(val => {
          const opt = options.find(o => o.value === val);
          if (!opt) return null;
          return (
            <span
              key={val}
              className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-primary/10 text-primary rounded"
            >
              {opt.label}
              <X
                size={14}
                className="cursor-pointer hover:text-primary/80"
                onClick={(e) => handleRemoveValue(val, e)}
              />
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="relative" ref={selectRef}>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          relative flex items-center gap-2 w-full px-4 py-2.5 border-2 rounded-lg 
          bg-white cursor-pointer transition-all duration-200 min-h-[42px]
          ${getBorderColor()}
          ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'hover:bg-gray-50/50'}
          focus:outline-none focus-within:ring-2
          ${className}
        `}
      >
        {icon && <span className="text-primary">{icon}</span>}
        {renderSelectedValues()}
        <ChevronDown
          size={18}
          className={`text-gray-400 transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-lg shadow-xl py-2 max-h-60 overflow-auto
          animate-in fade-in-0 zoom-in-95 duration-100">
          {options.length > 4 && (
            <div className="sticky top-0 bg-white px-3 py-2 border-b border-gray-100 backdrop-blur-sm backdrop-saturate-150">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg
                    focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10
                    transition-all duration-200"
                  placeholder="ძებნა..."
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}
          <div className="py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleOptionSelect(option.value)}
                  className={`
                    w-full flex items-center justify-between px-4 py-2.5 text-left text-base
                    transition-all duration-200 hover:bg-gray-50
                    ${multiple 
                      ? selectedValues.includes(option.value) 
                        ? 'text-primary font-medium bg-primary/5 hover:bg-primary/10' 
                        : 'text-gray-700'
                      : option.value === value 
                        ? 'text-primary font-medium bg-primary/5 hover:bg-primary/10' 
                        : 'text-gray-700'}
                  `}
                >
                  <span className="flex-1">{option.label}</span>
                  {multiple ? (
                    <div className={`ml-3 w-4 h-4 border rounded flex items-center justify-center
                      transition-all duration-200
                      ${selectedValues.includes(option.value) 
                        ? 'border-primary bg-primary scale-100' 
                        : 'border-gray-300 scale-95'}`}
                    >
                      {selectedValues.includes(option.value) && (
                        <Check size={12} className="text-white" />
                      )}
                    </div>
                  ) : (
                    option.value === value && 
                    <Check size={16} className="text-primary ml-3 animate-in fade-in-0 duration-200" />
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                შედეგი ვერ მოიძებნა
              </div>
            )}
          </div>
        </div>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default CustomSelect;