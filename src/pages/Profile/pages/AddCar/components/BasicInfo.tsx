import React, { useState, useEffect } from 'react';
import { Car, DollarSign, MapPin, Gauge, Check, AlertTriangle } from 'lucide-react';
import { mockCategories } from '../../../../../data/mockData';
import { getBrands } from '../../../../../api/services/carService';
import { NewCarFormData } from '../types';
import CustomSelect from '../../../../../components/common/CustomSelect';
import {
  TRANSMISSION_OPTIONS,
  FUEL_TYPE_OPTIONS,
  BODY_TYPE_OPTIONS,
  DRIVE_TYPE_OPTIONS
} from '../types';

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

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await getBrands();
        setBrands(data);
      } catch (err) {
        setError('Failed to load brands');
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        {error}
      </div>
    );
  }

  const selectedBrand = brands.find(brand => String(brand.id) === String(formData.brand_id));
  const availableModels = selectedBrand?.models || [];

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
    <div className="space-y-8">
      {/* Car Details Section */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
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
              onChange={(value) => {
                onChange('brand_id', value);
                onChange('model', '');
              }}
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

      {/* Price Section */}
      <div className="bg-gray-50 rounded-xl p-6">
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

      {/* Specifications Section */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Gauge size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">სპეციფიკაციები</h2>
            <p className="text-sm text-gray-500">ტექნიკური მახასიათებლები</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              გარბენი (კმ)
              {errors?.mileage && (
                <span className="text-red-500 ml-1 text-xs">{errors.mileage}</span>
              )}
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.specifications.mileage}
                onChange={(e) => onSpecificationsChange('mileage', e.target.value)}
                className={`w-full px-4 py-2.5 border-2 rounded-lg text-base bg-white hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 pr-10 ${
                  errors?.mileage
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : formData.specifications.mileage
                    ? 'border-green-300'
                    : 'border-gray-100'
                }`}
                placeholder="მაგ: 100000"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {renderStatusIcon(getFieldStatus('mileage'))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              გადაცემათა კოლოფი
              {errors?.transmission && (
                <span className="text-red-500 ml-1 text-xs">{errors.transmission}</span>
              )}
            </label>
            <CustomSelect
              options={TRANSMISSION_OPTIONS.map(option => ({
                value: option,
                label: option === 'manual' ? 'მექანიკა' : 
                       option === 'automatic' ? 'ავტომატი' : 
                       option === 'tiptronic' ? 'ტიპტრონიკი' : 
                       'ვარიატორი'
              }))}
              value={formData.specifications.transmission}
              onChange={(value) => onSpecificationsChange('transmission', value)}
              placeholder="აირჩიეთ გადაცემათა კოლოფი"
              error={errors?.transmission}
              isValid={!!formData.specifications.transmission}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              საწვავის ტიპი
              {errors?.fuel_type && (
                <span className="text-red-500 ml-1 text-xs">{errors.fuel_type}</span>
              )}
            </label>
            <CustomSelect
              options={FUEL_TYPE_OPTIONS.map(option => ({
                value: option,
                label: option
              }))}
              value={formData.specifications.fuel_type}
              onChange={(value) => onSpecificationsChange('fuel_type', value)}
              placeholder="აირჩიეთ საწვავის ტიპი"
              error={errors?.fuel_type}
              isValid={!!formData.specifications.fuel_type}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ძარის ტიპი
              {errors?.body_type && (
                <span className="text-red-500 ml-1 text-xs">{errors.body_type}</span>
              )}
            </label>
            <CustomSelect
              options={BODY_TYPE_OPTIONS.map(option => ({
                value: option,
                label: option
              }))}
              value={formData.specifications.body_type}
              onChange={(value) => onSpecificationsChange('body_type', value)}
              placeholder="აირჩიეთ ძარის ტიპი"
              error={errors?.body_type}
              isValid={!!formData.specifications.body_type}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              წამყვანი თვლები
              {errors?.drive_type && (
                <span className="text-red-500 ml-1 text-xs">{errors.drive_type}</span>
              )}
            </label>
            <CustomSelect
              options={DRIVE_TYPE_OPTIONS.map(option => ({
                value: option,
                label: option === 'front' ? 'წინა' : 
                       option === 'rear' ? 'უკანა' : '4x4'
              }))}
              value={formData.specifications.drive_type}
              onChange={(value) => onSpecificationsChange('drive_type', value)}
              placeholder="აირჩიეთ წამყვანი თვლები"
              error={errors?.drive_type}
              isValid={!!formData.specifications.drive_type}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ძრავის მოცულობა (ლ)
              {errors?.engine_size && (
                <span className="text-red-500 ml-1 text-xs">{errors.engine_size}</span>
              )}
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={formData.specifications.engine_size}
                onChange={(e) => onSpecificationsChange('engine_size', e.target.value)}
                className={`w-full px-4 py-2.5 border-2 rounded-lg text-base bg-white hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 pr-10 ${
                  errors?.engine_size
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : formData.specifications.engine_size
                    ? 'border-green-300'
                    : 'border-gray-100'
                }`}
                placeholder="მაგ: 2.0"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {renderStatusIcon(getFieldStatus('engine_size'))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ფერი
              {errors?.color && (
                <span className="text-red-500 ml-1 text-xs">{errors.color}</span>
              )}
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.specifications.color}
                onChange={(e) => onSpecificationsChange('color', e.target.value)}
                className={`w-full px-4 py-2.5 border-2 rounded-lg text-base bg-white hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 pr-10 ${
                  errors?.color
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : formData.specifications.color
                    ? 'border-green-300'
                    : 'border-gray-100'
                }`}
                placeholder="მაგ: შავი"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {renderStatusIcon(getFieldStatus('color'))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className="bg-gray-50 rounded-xl p-6">
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
              ქალაქი *
              {errors?.city && (
                <span className="text-red-500 ml-1 text-xs">{errors.city}</span>
              )}
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.city}
                onChange={(e) => onChange('city', e.target.value)}
                className={`w-full px-4 py-2.5 border-2 rounded-lg text-base bg-white hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 pr-10 ${
                  errors?.city
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : formData.city
                    ? 'border-green-300'
                    : 'border-gray-100'
                }`}
                placeholder="მაგ: თბილისი"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {renderStatusIcon(getFieldStatus('city'))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              რეგიონი *
              {errors?.state && (
                <span className="text-red-500 ml-1 text-xs">{errors.state}</span>
              )}
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.state}
                onChange={(e) => onChange('state', e.target.value)}
                className={`w-full px-4 py-2.5 border-2 rounded-lg text-base bg-white hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 pr-10 ${
                  errors?.state
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : formData.state
                    ? 'border-green-300'
                    : 'border-gray-100'
                }`}
                placeholder="მაგ: თბილისი"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {renderStatusIcon(getFieldStatus('state'))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            აღწერა *
            {errors?.description_ka && (
              <span className="text-red-500 ml-1 text-xs">{errors.description_ka}</span>
            )}
          </label>
          <div className="relative">
            <textarea
              value={formData.description_ka}
              onChange={(e) => onChange('description_ka', e.target.value)}
              className={`w-full px-4 py-2.5 border-2 rounded-lg text-base bg-white hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 min-h-[150px] resize-none pr-10 ${
                errors?.description_ka
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : formData.description_ka
                  ? 'border-green-300'
                  : 'border-gray-100'
              }`}
              placeholder="დაწერეთ დეტალური ინფორმაცია მანქანის შესახებ..."
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {renderStatusIcon(getFieldStatus('description_ka'))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;