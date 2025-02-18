import React from 'react';
import { FaSort, FaCar, FaChevronDown } from 'react-icons/fa';

interface SortingHeaderProps {
  total: number;
  sortBy: string;
  onSortChange: (value: string) => void;
}

const SortingHeader: React.FC<SortingHeaderProps> = ({
  total,
  sortBy,
  onSortChange
}) => {
  return (
    <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm mb-6 transition-all duration-200 md:flex-row flex-col gap-4">
      <div className="flex items-center gap-3 text-lg font-semibold text-gray-dark">
        <FaCar className="text-xl text-primary" />
        აღმოჩენილია <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold">{total}</span> {total === 1 ? 'მანქანა' : 'მანქანა'}
      </div>
      
      <div className="flex items-center gap-6 sm:flex-row flex-col w-full sm:w-auto">
        <span className="text-base text-gray-dark flex items-center gap-2">
          <FaSort className="text-primary" /> დალაგება
        </span>
        <div className="relative w-full sm:w-auto">
          <select 
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full sm:w-[200px] py-2 px-4 border-2 border-gray-100 rounded-lg text-base font-medium text-gray-dark bg-white cursor-pointer appearance-none transition-colors hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="newest">უახლესი</option>
            <option value="price-asc">ფასი: დაბლიდან მაღლა</option>
            <option value="price-desc">ფასი: მაღლიდან დაბლა</option>
            <option value="year-desc">წელი: ახლიდან ძველისკენ</option>
            <option value="year-asc">წელი: ძველიდან ახლისკენ</option>
            <option value="mileage-asc">გარბენი: დაბლიდან მაღლა</option>
            <option value="mileage-desc">გარბენი: მაღლიდან დაბლა</option>
          </select>
          <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none transition-transform group-hover:rotate-180" />
        </div>
      </div>
    </div>
  );
};

export default SortingHeader;