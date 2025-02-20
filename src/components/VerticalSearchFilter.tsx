import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, DollarSign, Calendar, Search, Settings, Fuel, Navigation, Palette } from 'lucide-react';
import data from '../data/cars.json';

interface SearchFormData {
  brand: string;
  model: string;
  priceRange: string;
  year: string;
  transmission: string;
  fuelType: string;
  drive: string;
  color: string;
}

const VerticalSearchFilter: React.FC = () => {
  const navigate = useNavigate();
  const { brands } = data;
  
  const [formData, setFormData] = useState<SearchFormData>({
    brand: '',
    model: '',
    priceRange: '',
    year: '',
    transmission: '',
    fuelType: '',
    drive: '',
    color: ''
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

  const transmissions = ['Automatic', 'Manual', 'CVT', 'DSG', 'PDK', 'Single-Speed'];
  const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
  const driveTypes = ['FWD', 'RWD', 'AWD', '4WD'];
  const colors = ['Black', 'White', 'Silver', 'Gray', 'Red', 'Blue', 'Pearl White', 'Deep Black', 'Nardo Gray', 'Guards Red', 'Modern Steel', 'Amazon Gray'];

  return (
    <div className="w-full h-full bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-green-lighter/20 overflow-y-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative group">
          <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-primary transition-all duration-300 group-hover:scale-110" />
          <select
            value={formData.brand}
            onChange={handleBrandChange}
            className="w-full pl-12 pr-4 py-3 border-2 border-green-light rounded-xl bg-white/80 text-gray-dark focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all cursor-pointer hover:border-primary"
          >
            <option value="">აირჩიე მარკა</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.name}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="relative group">
          <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-primary transition-all duration-300 group-hover:scale-110" />
          <select
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            disabled={!formData.brand}
            className="w-full pl-12 pr-4 py-3 border-2 border-green-light rounded-xl bg-white/80 text-gray-dark focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed hover:border-primary"
          >
            <option value="">აირჩიე მოდელი</option>
            {availableModels.map(model => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
        
        <div className="relative group">
          <Settings className="absolute left-4 top-1/2 -translate-y-1/2 text-primary transition-all duration-300 group-hover:scale-110" />
          <select
            value={formData.transmission}
            onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
            className="w-full pl-12 pr-4 py-3 border-2 border-green-light rounded-xl bg-white/80 text-gray-dark focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all cursor-pointer hover:border-primary"
          >
            <option value="">ტრანსმისია</option>
            {transmissions.map(transmission => (
              <option key={transmission} value={transmission}>
                {transmission}
              </option>
            ))}
          </select>
        </div>

        <div className="relative group">
          <Fuel className="absolute left-4 top-1/2 -translate-y-1/2 text-primary transition-all duration-300 group-hover:scale-110" />
          <select
            value={formData.fuelType}
            onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
            className="w-full pl-12 pr-4 py-3 border-2 border-green-light rounded-xl bg-white/80 text-gray-dark focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all cursor-pointer hover:border-primary"
          >
            <option value="">საწვავის ტიპი</option>
            {fuelTypes.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="relative group">
          <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-primary transition-all duration-300 group-hover:scale-110" />
          <select
            value={formData.drive}
            onChange={(e) => setFormData({ ...formData, drive: e.target.value })}
            className="w-full pl-12 pr-4 py-3 border-2 border-green-light rounded-xl bg-white/80 text-gray-dark focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all cursor-pointer hover:border-primary"
          >
            <option value="">წამყვანი თვლები</option>
            {driveTypes.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="relative group">
          <Palette className="absolute left-4 top-1/2 -translate-y-1/2 text-primary transition-all duration-300 group-hover:scale-110" />
          <select
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="w-full pl-12 pr-4 py-3 border-2 border-green-light rounded-xl bg-white/80 text-gray-dark focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all cursor-pointer hover:border-primary"
          >
            <option value="">ფერი</option>
            {colors.map(color => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>
        
        <div className="relative group">
          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-primary transition-all duration-300 group-hover:scale-110" />
          <select
            value={formData.priceRange}
            onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
            className="w-full pl-12 pr-4 py-3 border-2 border-green-light rounded-xl bg-white/80 text-gray-dark focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all cursor-pointer hover:border-primary"
          >
            <option value="">ფასის დიაპაზონი</option>
            {priceRanges.map(range => (
              <option key={range} value={range}>
                ${range}
              </option>
            ))}
          </select>
        </div>
        
        <div className="relative group">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary transition-all duration-300 group-hover:scale-110" />
          <select
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            className="w-full pl-12 pr-4 py-3 border-2 border-green-light rounded-xl bg-white/80 text-gray-dark focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all cursor-pointer hover:border-primary"
          >
            <option value="">წელი</option>
            {years.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        
        <button
          type="submit"
          className="flex items-center justify-center gap-3 py-3 px-4 bg-primary-gradient text-white text-lg font-semibold rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Search className="text-xl" /> მოძებნა
        </button>
      </form>
    </div>
  );
};

export default VerticalSearchFilter;