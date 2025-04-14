import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const CarsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex items-center space-x-1 text-gray-700 hover:text-primary"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <span>მანქანები</span>
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <Link
            to="/cars"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            ყიდვა
          </Link>
          <Link
            to="/how-to-sell"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            გაყიდვა
          </Link>
        </div>
      )}
    </div>
  );
};

export default CarsDropdown;