import React, { useState, useEffect } from 'react';
import { Car } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { NewCarFormData } from '../types';
import CustomSelect from '../../../../../components/common/CustomSelect';
import { CITY_OPTIONS, COUNTRY_OPTIONS, LOCATION_TYPE_OPTIONS } from '../types';
import CurrencySwitcher from '../../../../../components/CurrencySwitcher';
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
  const { t } = useTranslation(['profile', 'filter']);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<{id: number; name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('Fetching brands and categories...');
        const [brandsData, categoriesData] = await Promise.all([
          carService.getBrands(),
          carService.getCategories()
        ]);
        console.log('Received brands:', brandsData);
        console.log('Received categories:', categoriesData);
        setBrands(brandsData || []);
        setCategories(categoriesData || []);
      } catch (err: any) {
        console.error('Detailed error:', err);
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

    const loadModels = async () => {
      try {
        console.log('BasicInfo - Fetching models for brand_id:', formData.brand_id);
        console.log('BasicInfo - Available brands:', brands.map(b => `${b.id}: ${b.name}`).join(', '));
        
        // Find the selected brand to verify it exists
        const selectedBrand = brands.find(b => b.id.toString() === formData.brand_id.toString());
        console.log('BasicInfo - Selected brand object:', selectedBrand);
        
        if (!selectedBrand) {
          console.error('BasicInfo - Cannot find brand with ID:', formData.brand_id);
          return;
        }
        
        const models = await carService.getModelsByBrand(Number(formData.brand_id));
        console.log('BasicInfo - Received models:', models);
        setAvailableModels(models || []);
      } catch (err: any) {
        console.error('BasicInfo - Error loading models:', err);
        setError(err.message);
        setAvailableModels([]);
      }
    };

    loadModels();
  }, [formData.brand_id, brands]);

  const handleBrandChange = (value: string | string[]) => {
    console.log('handleBrandChange - received value:', value);
    const brandId = Array.isArray(value) ? value[0] : value;
    console.log('handleBrandChange - setting brand_id to:', brandId);
    if (brandId) {
      onChange('brand_id', brandId.toString());
    }
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
      <div className="bg-white rounded-xl p-6 border">
        <div className="flex flex-col md:flex-col gap-6">
          <div className="w-full">
            <label className="block text-sm font-medium  text-gray-700 mb-2">
              {t('addCar.basicInfo.title')} *
              {errors?.title && (
                <span className="text-red-500 ml-1 text-xs">{errors.title}</span>
              )}
            </label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => onChange('title', e.target.value)}
              className="w-full px-4 py-2.5 border-2 rounded-lg text-sm sm:text-md bg-white hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              placeholder={t('addCar.basicInfo.titlePlaceholder')}
            />
          </div>
          
          <div className='w-full flex flex-col sm:flex-row justify-between gap-6'>
            <div className='w-full sm:w-1/2'>
              <label className="block text-sm font-medium  text-gray-700 mb-2">
                {t('addCar.basicInfo.brand')} *
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
                placeholder={t('addCar.basicInfo.selectBrand')}
                error={errors?.brand_id}
                isValid={!!formData.brand_id}
                icon={<Car size={18} />}
              />
            </div>

            <div className='w-full sm:w-1/2'>
              <label className="block text-sm font-medium  text-gray-700 mb-2">
                {t('addCar.basicInfo.model')} *
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
                placeholder={t('addCar.basicInfo.selectModel')}
                disabled={!formData.brand_id}
                error={errors?.model}
                isValid={!!formData.model}
              />
            </div>
          </div>
          
          <div className='w-full'>
            <label className="block text-sm font-medium  text-gray-700 mb-2">
              {t('addCar.basicInfo.vinCode')}
              {errors?.vin_code && (
                <span className="text-red-500 ml-1 text-xs">{errors.vin_code}</span>
              )}
            </label>
            <input
              type="text"
              value={formData.vin_code || ''}
              onChange={(e) => onChange('vin_code', e.target.value)}
              className="w-full px-4 py-2.5 border-2 rounded-lg text-sm sm:text-md bg-white hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              placeholder={t('addCar.basicInfo.vinPlaceholder')}
            />
          </div>

          <div className='w-full flex flex-col sm:flex-row justify-between items-center gap-6 '>
            <div className='w-full sm:w-1/3'>
                <label className="block  align-middle  font-medium text-gray-700 mb-2 ">
                  {t('addCar.basicInfo.category')} *
                  {errors?.category_id && (
                    <span className="text-red-500 ml-1 text-xs">{errors.category_id}</span>
                  )}
                </label>
                <CustomSelect
                  options={categories.map(category => ({
                    value: String(category.id),
                    label: category.name
                  }))}
                  value={String(formData.category_id || '')}
                  onChange={(value) => onChange('category_id', value)}
                  placeholder={t('addCar.basicInfo.selectCategory')}
                  error={errors?.category_id}
                  isValid={!!formData.category_id}
                />
              </div>

            <div className='w-full sm:w-1/3'>
              <label className="block text-sm  font-medium text-gray-700 mb-2">
                {t('addCar.basicInfo.year')} *
                {errors?.year && (
                  <span className="text-red-500 ml-1  text-xs ">{errors.year}</span>
                )}
              </label>
              <CustomSelect
                options={Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => ({
                  value: String(new Date().getFullYear() - i),
                  label: String(new Date().getFullYear() - i)
                }))}
                value={String(formData.year || '')}
                onChange={(value) => onChange('year', Number(value))}
                placeholder={t('addCar.basicInfo.selectYear')}
                error={errors?.year}
                isValid={!!formData.year}
              />
            </div>

            <div className='w-full sm:w-1/3'>
              <label className="block text-sm     font-medium text-gray-700 mb-2">
                {t('addCar.basicInfo.price')} *
                {errors?.price && (
                  <span className="text-red-500 ml-1 text-xs">{errors.price}</span>
                )}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.price || ''}
                  onChange={(e) => onChange('price', Number(e.target.value))}
                  className="w-full px-2 sm:px-4 py-2.5 border-2 text-sm text-md rounded-lg text-base bg-white hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 pr-24"
                  placeholder={t('addCar.basicInfo.pricePlaceholder')}
                  min="0"
                />
                <div className="absolute right-1 sm:right-2  top-1/2  transform -translate-y-1/2">
                  <CurrencySwitcher 
                    value={formData.currency as 'GEL' | 'USD'} 
                    onChange={(value) => onChange('currency', value)}
                    className="border-0 shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;