import React, { useState, useEffect } from 'react';
import { Car } from 'lucide-react';
import type { NewCarFormData } from '../types';
import CustomSelect from '../../../../../components/common/CustomSelect';
import { CITY_OPTIONS, COUNTRY_OPTIONS, LOCATION_TYPE_OPTIONS } from '../types';
import TechnicalSpecs from './TechnicalSpecs';
import { carService } from '../../../../../api';

interface Brand {
  id: number;
  name: string;
  models: string[];
}

interface BasicInfoProps {
  formData: NewCarFormData;
  onChange: (field: string, value: any) => void;
  onSpecificationsChange: (field: string, value: any) => void;
  errors?: Record<string, string>;
}

const BasicInfo = ({ formData, onChange, onSpecificationsChange, errors = {} }: BasicInfoProps) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<{id: number; name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [brandsData, categoriesData] = await Promise.all([
          carService.getBrands(),
          carService.getCategories()
        ]);
        setBrands(brandsData || []);
        setCategories(categoriesData || []);
      } catch (err: any) {
        setError(err.message);
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Update models when brand changes
  useEffect(() => {
    if (!formData.brand_id || brands.length === 0) {
      setAvailableModels([]);
      return;
    }

    const selectedBrand = brands.find((brand) => brand.id.toString() === formData.brand_id);
    setAvailableModels(selectedBrand?.models || []);
  }, [formData.brand_id, brands]);

  const handleBrandChange = (value: string | string[]) => {
    const brandId = Array.isArray(value) ? value[0] : value;
    onChange('brand_id', brandId);
    onChange('model', ''); // Reset model when brand changes
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              მარკა *
              {errors?.brand_id && (
                <span className="text-red-500 ml-1 text-xs">{errors.brand_id}</span>
              )}
            </label>
            <CustomSelect
              options={brands.map(brand => ({
                value: String(brand.id),
                label: brand.name
              }))}
              value={String(formData.brand_id || '')}
              onChange={handleBrandChange}
              placeholder="აირჩიეთ მარკა"
              error={errors?.brand_id}
              isValid={!!formData.brand_id}
              icon={<Car size={18} />}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              მოდელი *
              {errors?.model && (
                <span className="text-red-500 ml-1 text-xs">{errors.model}</span>
              )}
            </label>
            <CustomSelect
              options={availableModels.map(model => ({
                value: model,
                label: model
              }))}
              value={formData.model || ''}
              onChange={(value) => onChange('model', value)}
              placeholder="აირჩიეთ მოდელი"
              disabled={!formData.brand_id}
              error={errors?.model}
              isValid={!!formData.model}
            />
          </div>
        </div>
      </div>

      <TechnicalSpecs 
        specifications={formData.specifications}
        onChange={onSpecificationsChange}
        errors={errors}
      />
    </div>
  );
};

export default BasicInfo;