import React, { useState } from 'react';
import { FaFilter, FaTimes, FaCar, FaGasPump, FaCog, FaCalendar, FaMapMarkerAlt, FaSearch, FaUndo } from 'react-icons/fa';
import data from '../../../data/cars.json';

interface FilterSidebarProps {
  filters: {
    brand: string;
    model: string;
    priceRange: string;
    year: string;
    fuelType: string;
    transmission: string;
    location: string;
  };
  onFilterChange: (filters: any) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { brands } = data;
  const years = Array.from({ length: 35 }, (_, i) => 2024 - i);
  const fuelTypes = ['ბენზინი', 'დიზელი', 'ჰიბრიდი', 'ელექტრო'];
  const transmissions = ['ავტომატიკა', 'მექანიკა'];
  const priceRanges = [
    '0-5000',
    '5000-10000',
    '10000-20000',
    '20000-30000',
    '30000-50000',
    '50000+'
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);
  
  const handleReset = () => {
    onFilterChange({
      brand: '',
      model: '',
      priceRange: '',
      year: '',
      fuelType: '',
      transmission: '',
      location: ''
    });
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        } transition-all duration-200`}
        onClick={toggleSidebar}
      />
      
      <aside className={`bg-white p-4 rounded-xl shadow-sm max-h-[calc(100vh-100px)] overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-primary md:translate-x-0 fixed md:static inset-y-0 left-0 w-[320px] md:w-auto z-50 transition-transform duration-200 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-dark flex items-center gap-2">
            <FaFilter className="text-primary" /> ფილტრები
          </h3>
          <button 
            onClick={toggleSidebar}
            className="md:hidden w-9 h-9 rounded-full bg-gray-100 text-gray-dark hover:bg-gray-200 hover:rotate-90 transition-all flex items-center justify-center"
          >
            <FaTimes />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-base font-semibold text-gray-dark mb-3 flex items-center gap-2">
              <FaCar className="text-primary" /> მარკა & მოდელი
            </h4>
            <div className="relative">
              <select
                value={filters.brand}
                onChange={(e) => onFilterChange({ ...filters, brand: e.target.value, model: '' })}
                className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg text-base text-gray-dark bg-white cursor-pointer appearance-none hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              >
                <option value="">ყველა მარკა</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.name}>
                    {brand.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 border-[5px] border-transparent border-t-gray-400" />
            </div>
            
            <div className="relative mt-4">
              <select
                value={filters.model}
                onChange={(e) => onFilterChange({ ...filters, model: e.target.value })}
                disabled={!filters.brand}
                className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg text-base text-gray-dark bg-white cursor-pointer appearance-none hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200"
              >
                <option value="">ყველა მოდელი</option>
                {filters.brand && 
                  brands
                    .find(b => b.name === filters.brand)
                    ?.models.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))
                }
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 border-[5px] border-transparent border-t-gray-400" />
            </div>
          </div>

          <div>
            <h4 className="text-base font-semibold text-gray-dark mb-3 flex items-center gap-2">
              <FaCalendar className="text-primary" /> წელი
            </h4>
            <div className="relative">
              <select
                value={filters.year}
                onChange={(e) => onFilterChange({ ...filters, year: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg text-base text-gray-dark bg-white cursor-pointer appearance-none hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              >
                <option value="">ნებისმიერი წელი</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 border-[5px] border-transparent border-t-gray-400" />
            </div>
          </div>

          <div>
            <h4 className="text-base font-semibold text-gray-dark mb-3 flex items-center gap-2">
              <FaGasPump className="text-primary" /> საწვავის ტიპი
            </h4>
            <div className="relative">
              <select
                value={filters.fuelType}
                onChange={(e) => onFilterChange({ ...filters, fuelType: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg text-base text-gray-dark bg-white cursor-pointer appearance-none hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              >
                <option value="">ნებისმიერი</option>
                {fuelTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 border-[5px] border-transparent border-t-gray-400" />
            </div>
          </div>

          <div>
            <h4 className="text-base font-semibold text-gray-dark mb-3 flex items-center gap-2">
              <FaCog className="text-primary" /> გადაცემათა კოლოფი
            </h4>
            <div className="relative">
              <select
                value={filters.transmission}
                onChange={(e) => onFilterChange({ ...filters, transmission: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg text-base text-gray-dark bg-white cursor-pointer appearance-none hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              >
                <option value="">ნებისმიერი</option>
                {transmissions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 border-[5px] border-transparent border-t-gray-400" />
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button 
              className="flex-1 py-2 px-4 rounded-lg text-base font-medium bg-gray-100 text-gray-dark hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
              onClick={handleReset}
            >
              <FaUndo /> გასუფთავება
            </button>
            <button 
              className="flex-1 py-2 px-4 rounded-lg text-base font-medium bg-primary text-white hover:bg-secondary transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-105 shadow-sm hover:shadow-md"
              onClick={toggleSidebar}
            >
              <FaSearch /> ძებნა
            </button>
          </div>
        </div>
      </aside>
      
      <button
        onClick={toggleSidebar}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-white shadow-lg hover:bg-secondary hover:scale-110 transition-all duration-200 md:hidden flex items-center justify-center"
      >
        <FaFilter />
      </button>
    </>
  );
};

export default FilterSidebar;