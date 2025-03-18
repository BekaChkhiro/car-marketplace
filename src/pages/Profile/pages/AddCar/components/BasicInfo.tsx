import React, { useState, useEffect } from 'react';
import axios from '../../../../../api/config/axios';
import type { BrandOption, CategoryOption } from '../types';
import { TRANSPORT_TYPE_OPTIONS } from '../types';

interface BasicInfoProps {
  formData: {
    brand_id: string | number;
    category_id: string | number;
    model: string;
    year: number;
    price: string | number;
    transport_type: string;
  };
  onChange: (field: string, value: string | number) => void;
  errors?: Record<string, string>;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ formData, onChange, errors }) => {
  const [brands, setBrands] = useState<BrandOption[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<CategoryOption[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const years = Array.from({ length: 125 }, (_, i) => 2024 - i);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsResponse, categoriesResponse] = await Promise.all([
          axios.get('/transports/brands'),
          axios.get('/transports/categories')
        ]);
        
        setBrands(brandsResponse.data);
        setCategories(categoriesResponse.data);
        setFilteredCategories(categoriesResponse.data);
      } catch (err) {
        console.error('Error fetching form data:', err);
        setError('მონაცემების ჩატვირთვა ვერ მოხერხდა');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchModels = async () => {
      if (!formData.brand_id) {
        setModels([]);
        return;
      }

      try {
        const response = await axios.get(`/transports/brands/${formData.brand_id}/models`);
        setModels(response.data);
      } catch (err) {
        console.error('Error fetching models:', err);
        setError('მოდელების ჩატვირთვა ვერ მოხერხდა');
      }
    };

    fetchModels();
  }, [formData.brand_id]);

  useEffect(() => {
    // როცა ტრანსპორტის ტიპი იცვლება, გავფილტროთ კატეგორიები
    if (formData.transport_type && categories.length > 0) {
      try {
        // გავფილტროთ კატეგორიები ტრანსპორტის ტიპის მიხედვით
        const filtered = categories.filter(category => 
          category.transport_type === formData.transport_type
        );
        setFilteredCategories(filtered);
        
        // თუ არჩეული კატეგორია არ არის ახალ ფილტრირებულ სიაში, გავასუფთაოთ
        if (!filtered.find(cat => cat.id === formData.category_id)) {
          onChange('category_id', '');
        }
      } catch (err) {
        console.error('Error filtering categories:', err);
      }
    } else {
      setFilteredCategories([]);
      onChange('category_id', '');
    }
  }, [formData.transport_type, categories]);

  const handleChange = (field: string, value: string | number) => {
    if (value === '') {
      onChange(field, '');
      return;
    }

    if (['brand_id', 'category_id', 'price', 'year'].includes(field)) {
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        value = numValue;
      }
    }

    if (field === 'brand_id') {
      onChange('model', '');
    }

    if (field === 'transport_type') {
      onChange('category_id', '');
    }

    onChange(field, value);
  };

  if (loading) {
    return (
      <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  const transportTypeLabels = {
    car: 'მანქანა',
    motorcycle: 'მოტოციკლი',
    truck: 'სატვირთო'
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold text-gray-dark border-b pb-4">ძირითადი ინფორმაცია</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            ტრანსპორტის ტიპი *
          </label>
          <div className="grid grid-cols-3 gap-4">
            {TRANSPORT_TYPE_OPTIONS.map((type) => (
              <label
                key={type}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg cursor-pointer border-2 transition-all ${
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
          {errors?.transport_type && (
            <p className="mt-1 text-sm text-red-600">{errors.transport_type}</p>
          )}
        </div>

        <div>
          <label htmlFor="brand_id" className="block text-sm font-medium text-gray-700 mb-2">
            მარკა *
          </label>
          <select
            id="brand_id"
            value={formData.brand_id}
            onChange={(e) => handleChange('brand_id', Number(e.target.value))}
            className={`w-full px-4 py-2 border-2 rounded-lg text-base ${
              errors?.brand_id 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-100 focus:border-primary focus:ring-primary/20'
            } focus:outline-none focus:ring-2 transition-colors`}
          >
            <option value="">აირჩიეთ მარკა</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
          {errors?.brand_id && (
            <p className="mt-1 text-sm text-red-600">{errors.brand_id}</p>
          )}
        </div>

        <div>
          <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
            კატეგორია *
          </label>
          <select
            id="category_id"
            value={formData.category_id}
            onChange={(e) => handleChange('category_id', Number(e.target.value))}
            className={`w-full px-4 py-2 border-2 rounded-lg text-base ${
              errors?.category_id 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-100 focus:border-primary focus:ring-primary/20'
            } focus:outline-none focus:ring-2 transition-colors`}
            disabled={!formData.transport_type}
          >
            <option value="">აირჩიეთ კატეგორია</option>
            {filteredCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors?.category_id && (
            <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
          )}
        </div>

        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
            მოდელი *
          </label>
          <select
            id="model"
            value={formData.model}
            onChange={(e) => handleChange('model', e.target.value)}
            disabled={!formData.brand_id}
            className={`w-full px-4 py-2 border-2 rounded-lg text-base ${
              errors?.model 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-100 focus:border-primary focus:ring-primary/20'
            } focus:outline-none focus:ring-2 transition-colors ${!formData.brand_id ? 'bg-gray-50 cursor-not-allowed' : ''}`}
          >
            <option value="">აირჩიეთ მოდელი</option>
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
          {errors?.model && (
            <p className="mt-1 text-sm text-red-600">{errors.model}</p>
          )}
        </div>

        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
            გამოშვების წელი *
          </label>
          <select
            id="year"
            value={formData.year}
            onChange={(e) => handleChange('year', Number(e.target.value))}
            className={`w-full px-4 py-2 border-2 rounded-lg text-base ${
              errors?.year 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-100 focus:border-primary focus:ring-primary/20'
            } focus:outline-none focus:ring-2 transition-colors`}
          >
            <option value="">აირჩიეთ წელი</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          {errors?.year && (
            <p className="mt-1 text-sm text-red-600">{errors.year}</p>
          )}
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
            ფასი ($) *
          </label>
          <input
            type="number"
            id="price"
            min="0"
            step="100"
            value={formData.price}
            onChange={(e) => handleChange('price', Number(e.target.value))}
            onWheel={(e) => e.currentTarget.blur()}
            className={`w-full px-4 py-2 border-2 rounded-lg text-base ${
              errors?.price 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-100 focus:border-primary focus:ring-primary/20'
            } focus:outline-none focus:ring-2 transition-colors`}
            placeholder="მაგ: 15000"
          />
          {errors?.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;