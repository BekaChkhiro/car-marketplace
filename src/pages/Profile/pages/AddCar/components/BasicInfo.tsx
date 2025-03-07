import React, { useState, useEffect } from 'react';
import axios from '../../../../../api/config/axios';
import type { BrandOption, CategoryOption } from '../types';

interface BasicInfoProps {
  formData: {
    brand_id: string | number;
    category_id: string | number;
    model: string;
    year: number;
    price: string | number;
  };
  onChange: (field: string, value: string | number) => void;
  errors?: Record<string, string>;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ formData, onChange, errors }) => {
  const [brands, setBrands] = useState<BrandOption[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const years = Array.from({ length: 125 }, (_, i) => 2024 - i);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsResponse, categoriesResponse] = await Promise.all([
          axios.get('/cars/brands'),
          axios.get('/cars/categories')
        ]);
        
        setBrands(brandsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (err) {
        console.error('Error fetching form data:', err);
        setError('მონაცემების ჩატვირთვა ვერ მოხერხდა');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (field: string, value: string | number) => {
    // Handle price as integer
    if (field === 'price') {
      const numValue = parseInt(value as string);
      if (!isNaN(numValue)) {
        value = numValue;
      } else if (value === '') {
        value = '';
      }
    }
    
    // Handle year as integer
    if (field === 'year') {
      const numValue = parseInt(value as string);
      if (!isNaN(numValue)) {
        value = numValue;
      }
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

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold text-gray-dark border-b pb-4">ძირითადი ინფორმაცია</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="brand_id" className="block text-sm font-medium text-gray-700 mb-2">
            მარკა *
          </label>
          <select
            id="brand_id"
            value={formData.brand_id}
            onChange={(e) => onChange('brand_id', e.target.value)}
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
            onChange={(e) => onChange('category_id', e.target.value)}
            className={`w-full px-4 py-2 border-2 rounded-lg text-base ${
              errors?.category_id 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-100 focus:border-primary focus:ring-primary/20'
            } focus:outline-none focus:ring-2 transition-colors`}
          >
            <option value="">აირჩიეთ კატეგორია</option>
            {categories.map((category) => (
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
          <input
            type="text"
            id="model"
            value={formData.model}
            onChange={(e) => onChange('model', e.target.value)}
            className={`w-full px-4 py-2 border-2 rounded-lg text-base ${
              errors?.model 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-100 focus:border-primary focus:ring-primary/20'
            } focus:outline-none focus:ring-2 transition-colors`}
            placeholder="მაგ: Camry"
          />
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
            onChange={(e) => handleChange('price', e.target.value)}
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