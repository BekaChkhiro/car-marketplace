import React, { useState, useEffect } from 'react';
import { 
  SlidersHorizontal, 
  X, 
  Car,
  Bike, 
  Truck,
  Calendar, 
  Fuel, 
  Settings,
  RotateCcw,
  Search 
} from 'lucide-react';
import data from '../../../data/cars.json';
import axios from '../../../api/config/axios';

interface FilterSidebarProps {
  filters: {
    transportType: string;
    brand: string;
    model: string;
    category: string;
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
  const [categories, setCategories] = useState<Array<{ id: number; name: string; transport_type: string }>>([]);
  const [filteredCategories, setFilteredCategories] = useState<Array<{ id: number; name: string; transport_type: string }>>([]);
  const { brands } = data;
  const years = Array.from({ length: 35 }, (_, i) => 2024 - i);
  const fuelTypes = ['ბენზინი', 'დიზელი', 'ჰიბრიდი', 'ელექტრო'];
  const transmissions = ['ავტომატიკა', 'მექანიკა'];
  const transportTypes = [
    { id: 'car', name: 'მანქანა', icon: Car },
    { id: 'motorcycle', name: 'მოტოციკლი', icon: Bike },
    { id: 'truck', name: 'სატვირთო', icon: Truck }
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/transports/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (filters.transportType && categories.length > 0) {
      const filtered = categories.filter(category => 
        category.transport_type === filters.transportType
      );
      setFilteredCategories(filtered);
      
      // If the current category doesn't belong to the new transport type, reset it
      if (!filtered.find(cat => cat.id.toString() === filters.category)) {
        onFilterChange({ ...filters, category: '' });
      }
    } else {
      setFilteredCategories([]);
    }
  }, [filters.transportType, categories]);

  const toggleSidebar = () => setIsOpen(!isOpen);
  
  const handleReset = () => {
    onFilterChange({
      transportType: '',
      brand: '',
      model: '',
      category: '',
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
      
      <aside className={`fixed top-0 right-0 h-full bg-white w-80 shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">ფილტრი</h2>
            <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          {/* Transport Type Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ტრანსპორტის ტიპი
            </label>
            <div className="grid grid-cols-2 gap-2">
              {transportTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => onFilterChange({ ...filters, transportType: type.id })}
                  className={`p-2 flex items-center justify-center border rounded-md ${
                    filters.transportType === type.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <type.icon className="w-4 h-4 mr-2" />
                  {type.name}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          {filteredCategories.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                კატეგორია
              </label>
              <select
                value={filters.category}
                onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">აირჩიეთ კატეგორია</option>
                {filteredCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <h4 className="text-base font-semibold text-gray-dark mb-3 flex items-center gap-2">
              <Car className="text-primary" size={18} /> მარკა & მოდელი
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
              <Calendar className="text-primary" size={18} /> წელი
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
              <Fuel className="text-primary" size={18} /> საწვავის ტიპი
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
              <Settings className="text-primary" size={18} /> გადაცემათა კოლოფი
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
              <RotateCcw size={16} /> გასუფთავება
            </button>
            <button 
              className="flex-1 py-2 px-4 rounded-lg text-base font-medium bg-primary text-white hover:bg-secondary transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-105 shadow-sm hover:shadow-md"
              onClick={toggleSidebar}
            >
              <Search size={16} /> ძებნა
            </button>
          </div>
        </div>
      </aside>
      
      <button
        onClick={toggleSidebar}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-white shadow-lg hover:bg-secondary hover:scale-110 transition-all duration-200 md:hidden flex items-center justify-center"
      >
        <SlidersHorizontal size={24} />
      </button>
    </>
  );
};

export default FilterSidebar;