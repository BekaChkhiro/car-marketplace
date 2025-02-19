import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaCar, FaCalendar, FaDollarSign } from 'react-icons/fa';
import data from '../../../data/cars.json';

interface SearchFormData {
  brand: string;
  model: string;
  priceRange: string;
  year: string;
}

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { brands } = data;
  
  const [formData, setFormData] = useState<SearchFormData>({
    brand: '',
    model: '',
    priceRange: '',
    year: ''
  });
  
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  
  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBrand = e.target.value;
    const brandData = brands.find(brand => brand.name === selectedBrand);
    setFormData({
      ...formData,
      brand: selectedBrand,
      model: ''
    });
    setAvailableModels(brandData?.models || []);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });
    navigate(`/cars?${params.toString()}`);
  };
  
  const years = Array.from({ length: 35 }, (_, i) => 2024 - i);
  const priceRanges = [
    '0-5000',
    '5000-10000',
    '10000-20000',
    '20000-30000',
    '30000-50000',
    '50000+'
  ];

  return (
    <section className="relative min-h-[600px] flex flex-col items-center justify-center text-center text-white p-20 overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-blue-800/85"></div>
        <img src="/images/hero-bg.jpg" alt="Hero Background" className="w-full h-full object-cover" />
      </div>
      
      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-background"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
          Find Your Dream Car in Georgia
        </h1>
        <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
          Browse through our extensive collection of quality vehicles and find the perfect match for your needs
        </p>
        
        {/* Search Form */}
        <div className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative">
              <FaCar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
              <select
                value={formData.brand}
                onChange={handleBrandChange}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-gray-900 focus:border-primary focus:ring-3 focus:ring-primary/25 transition-all cursor-pointer"
              >
                <option value="">Select Brand</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.name}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <FaCar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
              <select
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                disabled={!formData.brand}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-gray-900 focus:border-primary focus:ring-3 focus:ring-primary/25 transition-all cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed"
              >
                <option value="">Select Model</option>
                {availableModels.map(model => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <FaDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
              <select
                value={formData.priceRange}
                onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-gray-900 focus:border-primary focus:ring-3 focus:ring-primary/25 transition-all cursor-pointer"
              >
                <option value="">Price Range</option>
                {priceRanges.map(range => (
                  <option key={range} value={range}>
                    ${range}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <FaCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-gray-900 focus:border-primary focus:ring-3 focus:ring-primary/25 transition-all cursor-pointer"
              >
                <option value="">Year</option>
                {years.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              type="submit"
              className="col-span-1 md:col-span-2 lg:col-span-4 flex items-center justify-center gap-2 py-4 px-8 bg-gradient-to-r from-primary to-primary-dark text-white text-lg font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <FaSearch className="text-xl" /> Find Your Car
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;