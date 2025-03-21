import React, { useState, useEffect } from 'react';
import { Car, DollarSign, MapPin, Check, AlertTriangle, Navigation } from 'lucide-react';
import { mockCategories } from '../../../../../data/mockData';
import carService from '../../../../../api/services/carService';
import { NewCarFormData } from '../types';
import CustomSelect from '../../../../../components/common/CustomSelect';
import {
  CITY_OPTIONS,
  COUNTRY_OPTIONS,
  LOCATION_TYPE_OPTIONS
} from '../types';
import TechnicalSpecs from './TechnicalSpecs';

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

const BasicInfo: React.FC<BasicInfoProps> = ({
  formData,
  onChange,
  onSpecificationsChange,
  errors = {}
}) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);

  // Load brands on mount
  useEffect(() => {
    const loadBrands = async () => {
      try {
        setLoading(true);
        const data = await carService.getBrands();
        setBrands(data);
      } catch (err: any) {
        setError(err.message);
        console.error('Error loading brands:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBrands();
  }, []);

  // Load models when brand changes
  useEffect(() => {
    const loadModels = async () => {
      if (!formData.brand_id) {
        setAvailableModels([]);
        return;
      }

      try {
        setLoadingModels(true);
        const models = await carService.getModels(formData.brand_id);
        setAvailableModels(models);
      } catch (err: any) {
        console.error('Error loading models:', err);
        setError(err.message);
      } finally {
        setLoadingModels(false);
      }
    };

    loadModels();
  }, [formData.brand_id]);

  // Brand selection handler
  const handleBrandChange = (value: string | string[]) => {
    const brandId = Array.isArray(value) ? value[0] : value;
    onChange('brand_id', brandId);
    onChange('model', ''); // Reset model when brand changes
  };

  const getFieldStatus = (fieldName: string) => {
    if (errors[fieldName]) return 'error';
    if (formData[fieldName as keyof NewCarFormData]) return 'valid';
    return 'initial';
  };

  const renderStatusIcon = (status: 'initial' | 'valid' | 'error') => {
    if (status === 'valid') {
      return <Check size={16} className="text-green-500" />;
    }
    if (status === 'error') {
      return <AlertTriangle size={16} className="text-red-500" />;
    }
    return null;
  };

  return (
    <div className="space-y-8 transition-all duration-300">
      {/* Car Details Section */}
      <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110">
            <Car size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">მანქანის დეტალები</h2>
            <p className="text-sm text-gray-500">ძირითადი ინფორმაცია მანქანის შესახებ</p>
          </div>
        </div>

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
              value={String(formData.brand_id)}
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
              value={formData.model}
              onChange={(value) => onChange('model', value)}
              placeholder="აირჩიეთ მოდელი"
              disabled={!formData.brand_id}
              error={errors?.model}
              isValid={!!formData.model}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              კატეგორია *
              {errors?.category_id && (
                <span className="text-red-500 ml-1 text-xs">{errors.category_id}</span>
              )}
            </label>
            <CustomSelect
              options={mockCategories.map(category => ({
                value: String(category.id),
                label: category.name
              }))}
              value={String(formData.category_id)}
              onChange={(value) => onChange('category_id', value)}
              placeholder="აირჩიეთ კატეგორია"
              error={errors?.category_id}
              isValid={!!formData.category_id}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              წელი *
              {errors?.year && (
                <span className="text-red-500 ml-1 text-xs">{errors.year}</span>
              )}
            </label>
            <CustomSelect
              options={Array.from({ length: (new Date().getFullYear() + 1) - 1900 }, (_, i) => ({
                value: String(1900 + i),
                label: String(1900 + i)
              })).reverse()}
              value={String(formData.year)}
              onChange={(value) => onChange('year', value)}
              placeholder="აირჩიეთ წელი"
              error={errors?.year}
              isValid={!!formData.year}
            />
          </div>
        </div>
      </div>

      {/* Technical Specifications */}
      <TechnicalSpecs 
        specifications={formData.specifications}
        onChange={onSpecificationsChange}
        errors={errors}
      />

      {/* Price Section */}
      <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <DollarSign size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">ფასი</h2>
            <p className="text-sm text-gray-500">მიუთითეთ მანქანის ფასი</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ფასი (₾) *
            {errors?.price && (
              <span className="text-red-500 ml-1 text-xs">{errors.price}</span>
            )}
          </label>
          <div className="relative">
            <input
              type="number"
              value={formData.price}
              onChange={(e) => onChange('price', e.target.value)}
              className={`w-full px-4 py-2.5 border-2 rounded-lg text-base bg-white hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 pr-10 ${
                errors?.price
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : formData.price
                  ? 'border-green-300'
                  : 'border-gray-100'
              }`}
              placeholder="შეიყვანეთ ფასი"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {renderStatusIcon(getFieldStatus('price'))}
            </div>
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 ჰ-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <MapPin size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">მდებარეობა</h2>
            <p className="text-sm text-gray-500">მიუთითეთ მანქანის მდებარეობა</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ქვეყანა *
            </label>
            <CustomSelect
              options={COUNTRY_OPTIONS.map(country => ({
                value: country,
                label: country
              }))}
              value={formData.country}
              onChange={(value) => onChange('country', value)}
              placeholder="აირჩიეთ ქვეყანა"
              error={errors?.country}
              isValid={!!formData.country}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ქალაქი *
            </label>
            <CustomSelect
              options={CITY_OPTIONS.map(city => ({
                value: city,
                label: city
              }))}
              value={formData.city}
              onChange={(value) => onChange('city', value)}
              placeholder="აირჩიეთ ქალაქი"
              error={errors?.city}
              isValid={!!formData.city}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              რაიონი/უბანი
            </label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => onChange('state', e.target.value)}
              className="w-full px-4 py-2.5 border-2 rounded-lg text-base bg-white hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              placeholder="შეიყვანეთ რაიონი/უბანი"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              მდებარეობის ტიპი
            </label>
            <CustomSelect
              options={LOCATION_TYPE_OPTIONS}
              value={formData.location_type}
              onChange={(value) => onChange('location_type', value)}
              placeholder="აირჩიეთ მდებარეობის ტიპი"
              isValid={!!formData.location_type}
            />
          </div>

          {formData.location_type === 'transit' && (
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ტრანზიტის სტატუსი
              </label>
              <select
                value={formData.transit_status || ''}
                onChange={(e) => onChange('transit_status', e.target.value)}
                className="w-full px-4 py-2.5 border-2 rounded-lg text-base bg-white hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              >
                <option value="">აირჩიეთ სტატუსი</option>
                <option value="გზაში საქ.-სკენ">გზაში საქართველოსკენ</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Technical Specifications */}
      <TechnicalSpecs 
        specifications={formData.specifications}
        onChange={onSpecificationsChange}
        errors={errors}
      />

      {/* Description Section */}
      <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 ჰ-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Navigation size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">აღწერა</h2>
            <p className="text-sm text-gray-500">დაწერეთ დეტალური ინფორმაცია მანქანის შესახებ</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              აღწერა (ქართულად) *
              {errors?.description_ka && (
                <span className="text-red-500 ml-1 text-xs">{errors.description_ka}</span>
              )}
            </label>
            <textarea
              value={formData.description_ka}
              onChange={(e) => onChange('description_ka', e.target.value)}
              className={`w-full px-4 py-2.5 border-2 rounded-lg text-base bg-white hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 min-h-[150px] resize-none ${
                errors?.description_ka
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : formData.description_ka
                  ? 'border-green-300'
                  : 'border-gray-100'
              }`}
              placeholder="დაწერეთ დეტალური ინფორმაცია მანქანის შესახებ..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              აღწერა (ინგლისურად)
            </label>
            <textarea
              value={formData.description_en}
              onChange={(e) => onChange('description_en', e.target.value)}
              className="w-full px-4 py-2.5 border-2 rounded-lg text-base bg-white hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 min-h-[150px] resize-none"
              placeholder="Write detailed information about the car..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              აღწერა (რუსულად)
            </label>
            <textarea
              value={formData.description_ru}
              onChange={(e) => onChange('description_ru', e.target.value)}
              className="w-full px-4 py-2.5 border-2 rounded-lg text-base bg-white hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 min-h-[150px] resize-none"
              placeholder="Напишите подробную информацию об автомобиле..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;