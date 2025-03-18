import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/config/axios';
import { Fuel, Car, Settings2, MapPin } from 'lucide-react';
import { TRANSPORT_TYPE_OPTIONS } from '../pages/Profile/pages/AddCar/types';
import { getCategories } from '../api/services/carService';

interface BrandData {
  id: number;
  name: string;
  models: string[];
}

interface CategoryData {
  id: number;
  name: string;
  transport_type: 'car' | 'motorcycle' | 'truck';
}

interface FormData {
  transport_type: string;
  brand: string;
  model: string;
  category: string;
  priceRange: string;
  year: string;
  fuelType: string;
  transmission: string;
  location: string;
}

interface VerticalSearchFilterProps {
  onFilterChange: (filters: any) => void;
}

const VerticalSearchFilter: React.FC<VerticalSearchFilterProps> = ({ onFilterChange }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    transport_type: '',
    brand: '',
    model: '',
    category: '',
    priceRange: '',
    year: '',
    fuelType: '',
    transmission: '',
    location: ''
  });

  const [brands, setBrands] = useState<BrandData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<CategoryData[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsResponse, categoriesResponse] = await Promise.all([
          axios.get('/transports/brands'),
          axios.get('/transports/categories')
        ]);

        setBrands(brandsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // ფილტრავს კატეგორიებს ტრანსპორტის ტიპის მიხედვით
    if (formData.transport_type && categories.length > 0) {
      const filtered = categories.filter(category => 
        category.transport_type === formData.transport_type
      );
      setFilteredCategories(filtered);
      
      // თუ არჩეული კატეგორია არ არის ახალ ფილტრირებულ სიაში, გავასუფთაოთ
      if (!filtered.find(cat => cat.id.toString() === formData.category)) {
        setFormData(prev => ({ ...prev, category: '' }));
      }
    } else {
      setFilteredCategories([]);
      setFormData(prev => ({ ...prev, category: '' }));
    }
  }, [formData.transport_type, categories]);

  useEffect(() => {
    if (!formData.brand) {
      setAvailableModels([]);
      return;
    }

    const selectedBrand = brands.find(b => b.id.toString() === formData.brand);
    setAvailableModels(selectedBrand?.models || []);
  }, [formData.brand, brands]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // გავასუფთაოთ დამოკიდებული ველები
      if (field === 'brand') {
        newData.model = '';
      }
      if (field === 'transport_type') {
        newData.category = '';
      }
      
      return newData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });
    navigate(`/transports?${params.toString()}`);
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
  const transportTypeLabels = {
    car: 'მანქანა',
    motorcycle: 'მოტოციკლი',
    truck: 'სატვირთო'
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-semibold text-gray-dark mb-6">ძებნა</h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Car className="text-primary" size={18} /> ტრანსპორტის ტიპი
          </h4>
          <div className="grid grid-cols-3 gap-3">
            {TRANSPORT_TYPE_OPTIONS.map((type) => (
              <label
                key={type}
                className={`flex items-center justify-center gap-2 p-2 rounded-lg cursor-pointer border-2 transition-all ${
                  formData.transport_type === type
                    ? 'border-primary bg-green-light text-primary'
                    : 'border-gray-100 hover:border-primary/50'
                }`}
              >
                <input
                  type="radio"
                  name="transport_type"
                  value={type}
                  checked={formData.transport_type === type}
                  onChange={(e) => handleChange('transport_type', e.target.value)}
                  className="hidden"
                />
                <span className="text-sm font-medium">{transportTypeLabels[type]}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Car className="text-primary" size={18} /> მარკა და მოდელი
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <select
              value={formData.brand}
              onChange={(e) => handleChange('brand', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg text-base text-gray-dark bg-white cursor-pointer appearance-none hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            >
              <option value="">მარკა</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>

            <select
              value={formData.model}
              onChange={(e) => handleChange('model', e.target.value)}
              disabled={!formData.brand}
              className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg text-base text-gray-dark bg-white cursor-pointer appearance-none hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
            >
              <option value="">მოდელი</option>
              {availableModels.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Settings2 className="text-primary" size={18} /> კატეგორია
          </h4>
          <select
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            disabled={!formData.transport_type}
            className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg text-base text-gray-dark bg-white cursor-pointer appearance-none hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
          >
            <option value="">აირჩიეთ კატეგორია</option>
            {filteredCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Settings2 className="text-primary" size={18} /> ფასი და წელი
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <select
              value={formData.priceRange}
              onChange={(e) => handleChange('priceRange', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg text-base text-gray-dark bg-white cursor-pointer appearance-none hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            >
              <option value="">ფასი</option>
              {priceRanges.map((range) => (
                <option key={range} value={range}>
                  ${range}
                </option>
              ))}
            </select>

            <select
              value={formData.year}
              onChange={(e) => handleChange('year', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg text-base text-gray-dark bg-white cursor-pointer appearance-none hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            >
              <option value="">წელი</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Fuel className="text-primary" size={18} /> საწვავის ტიპი
          </h4>
          <select
            value={formData.fuelType}
            onChange={(e) => handleChange('fuelType', e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg text-base text-gray-dark bg-white cursor-pointer appearance-none hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          >
            <option value="">ნებისმიერი</option>
            {fuelTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Settings2 className="text-primary" size={18} /> ტრანსმისია
          </h4>
          <select
            value={formData.transmission}
            onChange={(e) => handleChange('transmission', e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg text-base text-gray-dark bg-white cursor-pointer appearance-none hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          >
            <option value="">ნებისმიერი</option>
            {transmissions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <MapPin className="text-primary" size={18} /> მდებარეობა
          </h4>
          <select
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-100 rounded-lg text-base text-gray-dark bg-white cursor-pointer appearance-none hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          >
            <option value="">მდებარეობა</option>
            <option value="tbilisi">თბილისი</option>
            <option value="batumi">ბათუმი</option>
            <option value="kutaisi">ქუთაისი</option>
            <option value="rustavi">რუსთავი</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white font-medium py-3 rounded-lg hover:bg-primary/90 transition-colors duration-200"
        >
          ძებნა
        </button>
      </div>
    </form>
  );
};

export default VerticalSearchFilter;