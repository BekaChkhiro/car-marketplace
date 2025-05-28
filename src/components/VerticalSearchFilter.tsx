import React, { useState, useEffect } from 'react';
import { Car, Settings2, MapPin, Sliders, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from '../api/config/axios';
import CustomSelect from './common/CustomSelect';
import carService from '../api/services/carService';
import RangeFilter from './ui/RangeFilter';
import AdvancedFiltersModal, { AdvancedFilters } from './AdvancedFiltersModal';
import { namespaces } from '../i18n';

interface FormData {
  brand: string;
  model: string;
  category: string;
  priceFrom: string;
  priceTo: string;
  transmission: string;
  location: string;
  // Advanced filters
  yearFrom: string;
  yearTo: string;
  engineSizeFrom: string;
  engineSizeTo: string;
  mileageFrom: string;
  mileageTo: string;
  fuelType: string;
  color: string;
  driveType: string;
  seats: string;
  condition: string;
  steeringWheel: string;
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
  const { t } = useTranslation([namespaces.common, namespaces.filter]);
  const [formData, setFormData] = useState<FormData>({
    brand: '',
    model: '',
    category: '',
    priceFrom: '',
    priceTo: '',
    transmission: '',
    location: '',
    // Advanced filters
    yearFrom: '',
    yearTo: '',
    engineSizeFrom: '',
    engineSizeTo: '',
    mileageFrom: '',
    mileageTo: '',
    fuelType: '',
    color: '',
    driveType: '',
    seats: '',
    condition: '',
    steeringWheel: ''
  });
  
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const years = Array.from({ length: 35 }, (_, i) => (new Date().getFullYear() - i).toString());
  const transmissions = [t('filter:automatic'), t('filter:manual'), t('filter:variator'), t('filter:semiAutomatic')];
  const locations = ['თბილისი', 'ბათუმი', 'ქუთაისი', 'რუსთავი', 'გორი', 'ზუგდიდი', 'ფოთი', 'თელავი', 'სხვა']; // These are proper names, so we won't translate them
  
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

  // Handle advanced filters
  const handleAdvancedFiltersApply = (advancedFilters: AdvancedFilters) => {
    setFormData(prev => {
      const updatedData = {
        ...prev,
        ...advancedFilters
      };
      onFilterChange(updatedData);
      return updatedData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    // Map basic form fields to the expected filter parameters in CarListing page
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
    
    // Add advanced filter parameters - ensuring parameter names match what CarListing expects
    if (formData.yearFrom) params.append('yearFrom', formData.yearFrom);
    if (formData.yearTo) params.append('yearTo', formData.yearTo);
    if (formData.engineSizeFrom) params.append('engineSizeFrom', formData.engineSizeFrom);
    if (formData.engineSizeTo) params.append('engineSizeTo', formData.engineSizeTo);
    if (formData.mileageFrom) params.append('mileageFrom', formData.mileageFrom);
    if (formData.mileageTo) params.append('mileageTo', formData.mileageTo);
    if (formData.fuelType) params.append('fuel_type', formData.fuelType);
    if (formData.color) params.append('exterior_color', formData.color);
    if (formData.driveType) params.append('drive_type', formData.driveType);
    if (formData.seats) params.append('seats', formData.seats);
    if (formData.condition) params.append('condition', formData.condition);
    if (formData.steeringWheel) params.append('steering_wheel', formData.steeringWheel);
    
    // Save filters to localStorage to maintain them across both pages
    try {
      localStorage.setItem('carFilters', JSON.stringify({
        brand_id: formData.brand || undefined,
        model: formData.model || undefined,
        category: formData.category || undefined,
        priceFrom: formData.priceFrom || undefined,
        priceTo: formData.priceTo || undefined,
        transmission: formData.transmission || undefined,
        location: formData.location || undefined,
        yearFrom: formData.yearFrom || undefined,
        yearTo: formData.yearTo || undefined,
        engineSizeFrom: formData.engineSizeFrom || undefined,
        engineSizeTo: formData.engineSizeTo || undefined,
        mileageFrom: formData.mileageFrom || undefined,
        mileageTo: formData.mileageTo || undefined,
        fuel_type: formData.fuelType || undefined,
        exterior_color: formData.color || undefined,
        drive_type: formData.driveType || undefined,
        seats: formData.seats || undefined,
        condition: formData.condition || undefined,
        steering_wheel: formData.steeringWheel || undefined
      }));
      console.log('[VerticalSearchFilter] Saved filters to localStorage');
    } catch (error) {
      console.error('[VerticalSearchFilter] Error saving filters to localStorage:', error);
    }
    
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
        <h2 className="text-xl font-bold text-gray-800">{t('common:search')}</h2>
      </div>
      
      <div className="space-y-5">
        {/* Brand and Model side by side */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('filter:brand')} & {t('filter:model')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <CustomSelect
              options={[
                { value: '', label: t('filter:selectBrand') },
                ...brands.map(brand => ({
                  value: String(brand.id),
                  label: brand.name
                }))
              ]}
              value={formData.brand}
              onChange={value => handleChange('brand', value)}
              placeholder={t('filter:selectBrand')}
              icon={<Car size={18} />}
            />
            <CustomSelect
              options={availableModels.length > 0 ? [
                { value: '', label: t('filter:selectModel') },
                ...availableModels.map(model => ({
                  value: model,
                  label: model
                }))
              ] : [
                { value: '', label: t('filter:selectModel') }
              ]}
              value={formData.model}
              onChange={value => handleChange('model', value)}
              placeholder={loading ? t('common:loading') : t('filter:selectModel')}
              disabled={loading || !formData.brand}
              loading={loading}
            />
          </div>
        </div>
        
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('filter:category')}
          </label>
          <CustomSelect
            options={[
              { value: '', label: t('filter:selectCategory') },
              ...categories.map(category => ({
                value: String(category.id),
                label: category.name
              }))
            ]}
            value={formData.category}
            onChange={value => handleChange('category', value)}
            placeholder={t('filter:selectCategory')}
            icon={<Car size={18} />}
          />
        </div>
        
        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('filter:price')} (GEL)
          </label>
          <RangeFilter
            name="price"
            fromValue={formData.priceFrom}
            toValue={formData.priceTo}
            placeholder={{ from: t('filter:priceFrom'), to: t('filter:priceTo') }}
            onChange={handleRangeChange}
          />
        </div>
        
        {/* Transmission */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('filter:transmission')}
          </label>
          <CustomSelect
            options={[
              { value: '', label: t('filter:anyOption') },
              ...transmissions.map(type => ({
                value: type,
                label: type
              }))
            ]}
            value={formData.transmission}
            onChange={value => handleChange('transmission', value)}
            placeholder={t('filter:anyOption')}
            icon={<Sliders size={18} />}
          />
        </div>
        
        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('filter:location')}
          </label>
          <CustomSelect
            options={[
              { value: '', label: t('filter:anyOption') },
              ...locations.map(location => ({
                value: location,
                label: location
              }))
            ]}
            value={formData.location}
            onChange={value => handleChange('location', value)}
            placeholder={t('filter:anyOption')}
            icon={<MapPin size={18} />}
          />
        </div>

        <div className="flex gap-3 mt-3">
          <button
            type="button"
            onClick={() => setShowAdvancedFilters(true)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-primary border-2 border-primary font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-md hover:shadow-lg w-1/3"
          >
            <Filter size={18} />
            <span className="hidden sm:inline">{t('filter:advancedFilters')}</span>
          </button>
          <button
            type="submit"
            className="w-2/3 px-4 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
          >
            {t('common:search')}
          </button>
        </div>
        
        {/* Advanced Filters Modal */}
        <AdvancedFiltersModal
          isOpen={showAdvancedFilters}
          onClose={() => setShowAdvancedFilters(false)}
          onApply={handleAdvancedFiltersApply}
          currentFilters={{
            yearFrom: formData.yearFrom,
            yearTo: formData.yearTo,
            engineSizeFrom: formData.engineSizeFrom,
            engineSizeTo: formData.engineSizeTo,
            mileageFrom: formData.mileageFrom,
            mileageTo: formData.mileageTo,
            fuelType: formData.fuelType,
            color: formData.color,
            driveType: formData.driveType,
            seats: formData.seats,
            condition: formData.condition,
            steeringWheel: formData.steeringWheel
          }}
        />
      </div>
    </form>
  );
};

export default VerticalSearchFilter;