import React, { useState, useEffect } from 'react';
import { Car, Settings2, Fuel, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/config/axios';
import CustomSelect from './common/CustomSelect';

interface FormData {
  brand: string;
  model: string;
  category: string;
  year: string;
  transmission: string;
  fuelType: string;
  location: string;
}

interface Brand {
  id: number;
  name: string;
  models: string[];
}

interface Category {
  id: number;
  name: string;
}

interface VerticalSearchFilterProps {
  onFilterChange: (filters: FormData) => void;
}

const VerticalSearchFilter: React.FC<VerticalSearchFilterProps> = ({ onFilterChange }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    brand: '',
    model: '',
    category: '',
    year: '',
    transmission: '',
    fuelType: '',
    location: ''
  });

  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  const years = Array.from({ length: 35 }, (_, i) => 2024 - i);
  const transmissions = ['ავტომატიკა', 'მექანიკა'];
  const fuelTypes = ['ბენზინი', 'დიზელი', 'ჰიბრიდი', 'ელექტრო'];
  const locations = ['თბილისი', 'ბათუმი', 'ქუთაისი', 'რუსთავი', 'გორი', 'ზუგდიდი', 'ფოთი'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsResponse, categoriesResponse] = await Promise.all([
          axios.get('/api/cars/brands'),
          axios.get('/api/cars/categories')
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
    if (!formData.brand) {
      setAvailableModels([]);
      return;
    }

    const selectedBrand = brands.find(b => b.id.toString() === formData.brand);
    setAvailableModels(selectedBrand?.models || []);
  }, [formData.brand, brands]);

  const handleChange = (field: keyof FormData, value: string | string[]) => {
    // Ensure we're always using a string value
    const stringValue = Array.isArray(value) ? value[0] : value;
    
    setFormData(prev => {
      const newData = { ...prev, [field]: stringValue };
      
      if (field === 'brand') {
        newData.model = '';
      }
      
      onFilterChange(newData);
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
    navigate(`/cars?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-semibold text-gray-dark mb-6">ძებნა</h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Car className="text-primary" size={18} /> მარკა და მოდელი
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <CustomSelect
              options={brands.map(brand => ({
                value: String(brand.id),
                label: brand.name
              }))}
              value={formData.brand}
              onChange={value => handleChange('brand', value)}
              placeholder="მარკა"
              icon={<Car size={18} />}
              multiple={false}
            />
            <CustomSelect
              options={availableModels.map(model => ({
                value: model,
                label: model
              }))}
              value={formData.model}
              onChange={value => handleChange('model', value)}
              placeholder="მოდელი"
              disabled={!formData.brand}
              multiple={false}
            />
          </div>
        </div>

        <div>
          <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Car className="text-primary" size={18} /> კატეგორია
          </h4>
          <CustomSelect
            options={categories.map(category => ({
              value: String(category.id),
              label: category.name
            }))}
            value={formData.category}
            onChange={value => handleChange('category', value)}
            placeholder="კატეგორია"
            multiple={false}
          />
        </div>

        <div>
          <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Settings2 className="text-primary" size={18} /> წელი
          </h4>
          <CustomSelect
            options={years.map(year => ({
              value: String(year),
              label: String(year)
            }))}
            value={formData.year}
            onChange={value => handleChange('year', value)}
            placeholder="წელი"
            multiple={false}
          />
        </div>

        <div>
          <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Settings2 className="text-primary" size={18} /> ტრანსმისია
          </h4>
          <CustomSelect
            options={transmissions.map(type => ({
              value: type,
              label: type
            }))}
            value={formData.transmission}
            onChange={value => handleChange('transmission', value)}
            placeholder="ტრანსმისია"
            multiple={false}
          />
        </div>

        <div>
          <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Fuel className="text-primary" size={18} /> საწვავის ტიპი
          </h4>
          <CustomSelect
            options={fuelTypes.map(type => ({
              value: type,
              label: type
            }))}
            value={formData.fuelType}
            onChange={value => handleChange('fuelType', value)}
            placeholder="საწვავის ტიპი"
            multiple={false}
          />
        </div>

        <div>
          <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <MapPin className="text-primary" size={18} /> მდებარეობა
          </h4>
          <CustomSelect
            options={locations.map(location => ({
              value: location,
              label: location
            }))}
            value={formData.location}
            onChange={value => handleChange('location', value)}
            placeholder="მდებარეობა"
            multiple={false}
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          ძებნა
        </button>
      </div>
    </form>
  );
};

export default VerticalSearchFilter;