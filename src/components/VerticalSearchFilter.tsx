import React, { useState, useEffect } from 'react';
import { Car, Settings2, MapPin, Sliders, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/config/axios';
import CustomSelect from './common/CustomSelect';
import carService from '../api/services/carService';
import RangeFilter from './ui/RangeFilter';

interface FormData {
  brand: string;
  model: string;
  category: string;
  priceFrom: string;
  priceTo: string;
  transmission: string;
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
    priceFrom: '',
    priceTo: '',
    transmission: '',
    location: ''
  });

  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const years = Array.from({ length: 35 }, (_, i) => (new Date().getFullYear() - i).toString());
  const transmissions = ['ავტომატიკა', 'მექანიკა', 'ვარიატორი', 'ნახევრად ავტომატური'];
  const locations = ['თბილისი', 'ბათუმი', 'ქუთაისი', 'რუსთავი', 'გორი', 'ზუგდიდი', 'ფოთი', 'თელავი', 'სხვა'];
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsResponse, categoriesResponse] = await Promise.all([
          carService.getBrands(),
          carService.getCategories()
        ]);

        setBrands(brandsResponse);
        setCategories(categoriesResponse);
      } catch (error) {
        console.error('[VerticalSearchFilter] Error fetching data:', error);
        // Set fallback data if API fails
        setBrands([]);
        setCategories([]);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchModels = async () => {
      if (!formData.brand) {
        setAvailableModels([]);
        return;
      }
      
      try {
        setLoading(true);
        // Make sure brand ID is a number
        const brandId = Number(formData.brand);
        
        if (!isNaN(brandId)) {
          const modelsData = await carService.getModelsByBrand(brandId);
          
          if (Array.isArray(modelsData) && modelsData.length > 0) {
            setAvailableModels(modelsData);
          } else {
            console.warn('[VerticalSearchFilter] No models returned from API or empty array');
            setAvailableModels([]);
          }
        }
      } catch (error) {
        console.error('[VerticalSearchFilter] Error fetching models:', error);
        setAvailableModels([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchModels();
  }, [formData.brand]);

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
  
  // Handle price range filter change
  const handleRangeChange = (name: string, values: { from: string; to: string }) => {
    if (name === 'price') {
      setFormData(prev => ({
        ...prev,
        priceFrom: values.from || '',
        priceTo: values.to || ''
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    // Map form fields to the expected filter parameters in CarListing page
    if (formData.brand) params.append('brand_id', formData.brand);
    if (formData.model) params.append('model', formData.model);
    if (formData.category) {
      params.append('category_id', formData.category);
      console.log('[VerticalSearchFilter] Adding category_id:', formData.category);
    }
    if (formData.priceFrom) params.append('priceFrom', formData.priceFrom);
    if (formData.priceTo) params.append('priceTo', formData.priceTo);
    if (formData.transmission) params.append('transmission', formData.transmission);
    if (formData.location) params.append('location', formData.location);
    
    // Add default pagination parameters
    params.append('page', '1');
    params.append('limit', '12');
    
    // Debug log
    console.log('[VerticalSearchFilter] Navigating to car listing with params:', params.toString());
    
    navigate(`/cars?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full h-full rounded-lg sm:rounded-2xl bg-white shadow-md p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6 pb-3 border-b border-green-100">
        <h2 className="text-xl font-bold text-gray-800">ძებნა</h2>
      </div>
      
      <div className="space-y-5">
        {/* Brand and Model side by side */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            მარკა და მოდელი
          </label>
          <div className="grid grid-cols-2 gap-3">
            <CustomSelect
              options={[
                { value: '', label: 'მარკა' },
                ...brands.map(brand => ({
                  value: String(brand.id),
                  label: brand.name
                }))
              ]}
              value={formData.brand}
              onChange={value => handleChange('brand', value)}
              placeholder="მარკა"
              icon={<Car size={18} />}
            />
            <CustomSelect
              options={availableModels.length > 0 ? [
                { value: '', label: 'მოდელი' },
                ...availableModels.map(model => ({
                  value: model,
                  label: model
                }))
              ] : [
                { value: '', label: formData.brand ? 'მოდელი' : 'მოდელი' }
              ]}
              value={formData.model}
              onChange={value => handleChange('model', value)}
              placeholder={loading ? 'იტვირთება...' : 'მოდელი'}
              disabled={loading || !formData.brand}
              loading={loading}
            />
          </div>
        </div>
        
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            კატეგორია
          </label>
          <CustomSelect
            options={[
              { value: '', label: 'ყველა კატეგორია' },
              ...categories.map(category => ({
                value: String(category.id),
                label: category.name
              }))
            ]}
            value={formData.category}
            onChange={value => handleChange('category', value)}
            placeholder="ყველა კატეგორია"
            icon={<Car size={18} />}
          />
        </div>
        
        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ფასი (GEL)
          </label>
          <RangeFilter
            name="price"
            fromValue={formData.priceFrom}
            toValue={formData.priceTo}
            placeholder={{ from: 'დან', to: 'მდე' }}
            onChange={handleRangeChange}
          />
        </div>
        
        {/* Transmission */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            გადაცემათა კოლოფი
          </label>
          <CustomSelect
            options={[
              { value: '', label: 'ნებისმიერი' },
              ...transmissions.map(type => ({
                value: type,
                label: type
              }))
            ]}
            value={formData.transmission}
            onChange={value => handleChange('transmission', value)}
            placeholder="ნებისმიერი"
            icon={<Sliders size={18} />}
          />
        </div>
        
        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            მდებარეობა
          </label>
          <CustomSelect
            options={[
              { value: '', label: 'ნებისმიერი' },
              ...locations.map(location => ({
                value: location,
                label: location
              }))
            ]}
            value={formData.location}
            onChange={value => handleChange('location', value)}
            placeholder="ნებისმიერი"
            icon={<MapPin size={18} />}
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg mt-3"
        >
          ძებნა
        </button>
      </div>
    </form>
  );
};

export default VerticalSearchFilter;