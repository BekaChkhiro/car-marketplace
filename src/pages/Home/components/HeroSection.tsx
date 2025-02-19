import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, DollarSign, Calendar, Search } from 'lucide-react';
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
    <section className="relative min-h-[700px] flex flex-col items-center justify-center text-center text-white p-20 m-4 rounded-xl overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/98 to-black mix-blend-multiply"></div>
        <img src="https://hips.hearstapps.com/hmg-prod/images/2024-alfa-romeo-giulia-quadrifoglio-100th-anniversario-116-643962c48c32c.jpg?crop=0.498xw:0.421xh;0,0.474xh&resize=1200:*" alt="Hero Background" className="w-full h-full object-cover transform scale-105 animate-slowly-move opacity-80" />
      </div>
      
      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black"></div>
      
      {/* Content */}
      <div className="relative z-10 animate-fade-in-up">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-green-lighter">
          იპოვე შენი საოცნებო მანქანა საქართველოში
        </h1>
        <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed text-green-lighter">
          დაათვალიერე ჩვენი ვრცელი კოლექცია და იპოვე შენთვის იდეალური ავტომობილი
        </p>
        
        {/* Search Form */}
        <div className="w-full max-w-5xl mx-auto bg-white/95 backdrop-blur-xl p-10 rounded-3xl shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-3xl border border-green-lighter/20">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="relative group">
              <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-primary transition-all duration-300 group-hover:scale-110" />
              <select
                value={formData.brand}
                onChange={handleBrandChange}
                className="w-full pl-12 pr-4 py-4 border-2 border-green-light rounded-xl bg-white/80 text-gray-dark focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all cursor-pointer hover:border-primary"
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
                className="w-full pl-12 pr-4 py-4 border-2 border-green-light rounded-xl bg-white/80 text-gray-dark focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed hover:border-primary"
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
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-primary transition-all duration-300 group-hover:scale-110" />
              <select
                value={formData.priceRange}
                onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                className="w-full pl-12 pr-4 py-4 border-2 border-green-light rounded-xl bg-white/80 text-gray-dark focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all cursor-pointer hover:border-primary"
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
                className="w-full pl-12 pr-4 py-4 border-2 border-green-light rounded-xl bg-white/80 text-gray-dark focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all cursor-pointer hover:border-primary"
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
              className="col-span-1 md:col-span-2 lg:col-span-4 flex items-center justify-center gap-3 py-5 px-10 bg-primary-gradient text-white text-xl font-semibold rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Search className="text-2xl" /> მოძებნე შენი იდეალური მანქანა
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;