import React, { useEffect, useState } from 'react';
import { Car, Brand, Category, UpdateCarFormData } from '../../../../api/types/car.types';
import carService from '../../../../api/services/carService';
import { Loader } from 'lucide-react';
import CurrencySwitcher from '../../../../components/CurrencySwitcher';

interface CarFormProps {
  initialData?: Car;
  onSubmit: (data: UpdateCarFormData) => void;
  isSubmitting: boolean;
  mode: 'create' | 'edit';
}

const CarForm: React.FC<CarFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  mode
}) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [formData, setFormData] = useState<UpdateCarFormData>({
    id: initialData?.id || 0,
    brand_id: initialData?.brand_id || 0,
    category_id: initialData?.category_id || 0,
    model: initialData?.model || '',
    title: initialData?.title || '',
    year: initialData?.year || new Date().getFullYear(),
    price: initialData?.price || 0,
    currency: initialData?.currency || 'GEL',
    description_ka: initialData?.description_ka || '',
    description_en: initialData?.description_en || '',
    description_ru: initialData?.description_ru || '',
    specifications: initialData?.specifications || {
      id: 0,
      transmission: 'automatic',
      fuel_type: 'Gasoline',
      mileage: 0,
      mileage_unit: 'km',
      steering_wheel: 'left',
      drive_type: 'FWD'
    },
    location: initialData?.location ? {
      city: initialData.location.city || 'თბილისი',
      country: initialData.location.country || 'საქართველო',
      location_type: initialData.location.location_type || 'georgia',
      is_transit: initialData.location.is_transit || false
    } : {
      city: 'თბილისი',
      country: 'საქართველო',
      location_type: 'georgia',
      is_transit: false
    }
  });
  
  // Fetch brands and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingBrands(true);
        setLoadingCategories(true);
        
        const [brandsData, categoriesData] = await Promise.all([
          carService.getBrands(),
          carService.getCategories()
        ]);
        
        setBrands(brandsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching form data:', error);
      } finally {
        setLoadingBrands(false);
        setLoadingCategories(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Fetch models when brand changes
  useEffect(() => {
    const fetchModels = async () => {
      if (!formData.brand_id) {
        setModels([]);
        return;
      }
      
      try {
        setLoadingModels(true);
        const modelsData = await carService.getModelsByBrand(formData.brand_id);
        setModels(modelsData);
      } catch (error) {
        console.error('Error fetching models:', error);
      } finally {
        setLoadingModels(false);
      }
    };
    
    fetchModels();
  }, [formData.brand_id]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle nested properties (specifications, location)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => {
        // Ensure parentObj is a proper object with type assertion
        const parentObj = (prev[parent as keyof UpdateCarFormData] || {}) as Record<string, any>;
        return {
          ...prev,
          [parent]: {
            ...parentObj,
            [child]: type === 'number' ? Number(value) : value
          }
        };
      });
    } else {
      // Handle top-level properties
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value
      }));
    }
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    // Handle nested properties for checkboxes
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => {
        // Ensure parentObj is a proper object with type assertion
        const parentObj = (prev[parent as keyof UpdateCarFormData] || {}) as Record<string, any>;
        return {
          ...prev,
          [parent]: {
            ...parentObj,
            [child]: checked
          }
        };
      });
    } else {
      // Handle top-level properties
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a copy of the form data to avoid mutating the state directly
    const submissionData = { ...formData };
    
    // Ensure specifications exists
    if (submissionData.specifications) {
      // Translate drive_type from Georgian to English if needed
      if (submissionData.specifications.drive_type) {
        // Map Georgian drive types to English values expected by the backend
        const driveTypeMap: Record<string, 'FWD' | 'RWD' | 'AWD' | '4WD'> = {
          'წინა': 'FWD',
          'უკანა': 'RWD',
          '4x4': 'AWD'
        };
        
        // Check if the current value is a Georgian key in our map
        const driveTypeKey = submissionData.specifications.drive_type as string;
        if (driveTypeMap[driveTypeKey]) {
          submissionData.specifications.drive_type = driveTypeMap[driveTypeKey];
        }
      }
    }
    
    onSubmit(submissionData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="grid grid-cols-1 gap-8">
        {/* Basic Information Section */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-5h2a2 2 0 012 2v1h-1.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-1a4 4 0 00-4-4h-1V6a1 1 0 00-1-1H3z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">ძირითადი ინფორმაცია</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 gap-4 mb-4">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  სათაური
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="მაგ: BMW X5 M-პაკეტი, იდეალურ მდგომარეობაში"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Brand */}
              <div>
                <label htmlFor="brand_id" className="block text-sm font-medium text-gray-700 mb-1">
                  ბრენდი
                </label>
                <select
                  id="brand_id"
                  name="brand_id"
                  value={formData.brand_id}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={loadingBrands}
                >
                  <option value="">აირჩიეთ ბრენდი</option>
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                {loadingBrands && (
                  <div className="mt-1 text-sm text-gray-500 flex items-center">
                    <Loader size={14} className="animate-spin mr-1" /> ბრენდების ჩატვირთვა...
                  </div>
                )}
              </div>
              
              {/* Category */}
              <div>
                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                  კატეგორია
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={loadingCategories}
                >
                  <option value="">აირჩიეთ კატეგორია</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {loadingCategories && (
                  <div className="mt-1 text-sm text-gray-500 flex items-center">
                    <Loader size={14} className="animate-spin mr-1" /> კატეგორიების ჩატვირთვა...
                  </div>
                )}
              </div>
              
              {/* Model */}
              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                  მოდელი
                </label>
                <select
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={loadingModels || !formData.brand_id}
                >
                  <option value="">აირჩიეთ მოდელი</option>
                  {models.map(model => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
                {loadingModels && (
                  <div className="mt-1 text-sm text-gray-500 flex items-center">
                    <Loader size={14} className="animate-spin mr-1" /> მოდელების ჩატვირთვა...
                  </div>
                )}
              </div>
              
              {/* Year */}
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                  წელი
                </label>
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">აირჩიეთ წელი</option>
                  {Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
              
              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  ფასი
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    className="w-full p-2 pr-24 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <CurrencySwitcher
                      value={formData.currency as 'GEL' | 'USD'}
                      onChange={(value) => {
                        setFormData(prev => ({
                          ...prev,
                          currency: value
                        }));
                      }}
                      className="border-0 shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Specifications Section */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">სპეციფიკაციები</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Transmission */}
              <div>
                <label htmlFor="specifications.transmission" className="block text-sm font-medium text-gray-700 mb-1">
                  ტრანსმისია
                </label>
                <select
                  id="specifications.transmission"
                  name="specifications.transmission"
                  value={formData.specifications?.transmission || 'automatic'}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="automatic">ავტომატური</option>
                  <option value="manual">მექანიკური</option>
                  <option value="semi-automatic">ნახევრად ავტომატური</option>
                </select>
              </div>
              
              {/* Fuel Type */}
              <div>
                <label htmlFor="specifications.fuel_type" className="block text-sm font-medium text-gray-700 mb-1">
                  საწვავის ტიპი
                </label>
                <select
                  id="specifications.fuel_type"
                  name="specifications.fuel_type"
                  value={formData.specifications?.fuel_type || 'Gasoline'}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Gasoline">ბენზინი</option>
                  <option value="Diesel">დიზელი</option>
                  <option value="Hybrid">ჰიბრიდი</option>
                  <option value="Electric">ელექტრო</option>
                  <option value="LPG">გაზი</option>
                </select>
              </div>
              
              {/* Mileage */}
              <div>
                <label htmlFor="specifications.mileage" className="block text-sm font-medium text-gray-700 mb-1">
                  გარბენი
                </label>
                <div className="flex">
                  <input
                    type="number"
                    id="specifications.mileage"
                    name="specifications.mileage"
                    value={formData.specifications?.mileage || 0}
                    onChange={handleChange}
                    min="0"
                    className="w-full p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <select
                    id="specifications.mileage_unit"
                    name="specifications.mileage_unit"
                    value={formData.specifications?.mileage_unit || 'km'}
                    onChange={handleChange}
                    className="w-24 p-2 border border-gray-300 rounded-r-md focus:ring-blue-500 focus:border-blue-500 border-l-0"
                  >
                    <option value="km">კმ</option>
                    <option value="mi">მილი</option>
                  </select>
                </div>
              </div>
              
              {/* Steering Wheel */}
              <div>
                <label htmlFor="specifications.steering_wheel" className="block text-sm font-medium text-gray-700 mb-1">
                  საჭე
                </label>
                <select
                  id="specifications.steering_wheel"
                  name="specifications.steering_wheel"
                  value={formData.specifications?.steering_wheel || 'left'}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="left">მარცხენა</option>
                  <option value="right">მარჯვენა</option>
                </select>
              </div>
              
              {/* Drive Type */}
              <div>
                <label htmlFor="specifications.drive_type" className="block text-sm font-medium text-gray-700 mb-1">
                  წამყვანი თვლები
                </label>
                <select
                  id="specifications.drive_type"
                  name="specifications.drive_type"
                  value={formData.specifications?.drive_type || 'FWD'}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="FWD">წინა</option>
                  <option value="RWD">უკანა</option>
                  <option value="AWD">4x4</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Location Section */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center">
            <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">მდებარეობა</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Country */}
              <div>
                <label htmlFor="location.country" className="block text-sm font-medium text-gray-700 mb-1">
                  ქვეყანა
                </label>
                <input
                  type="text"
                  id="location.country"
                  name="location.country"
                  value={formData.location?.country || 'საქართველო'}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              

              
              {/* City */}
              <div>
                <label htmlFor="location.city" className="block text-sm font-medium text-gray-700 mb-1">
                  ქალაქი
                </label>
                <input
                  type="text"
                  id="location.city"
                  name="location.city"
                  value={formData.location?.city || 'თბილისი'}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* Location Type */}
              <div>
                <label htmlFor="location.location_type" className="block text-sm font-medium text-gray-700 mb-1">
                  მდებარეობის ტიპი
                </label>
                <select
                  id="location.location_type"
                  name="location.location_type"
                  value={formData.location?.location_type || 'georgia'}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="georgia">საქართველო</option>
                  <option value="transit">ტრანზიტში</option>
                  <option value="international">საზღვარგარეთ</option>
                </select>
              </div>
              
              {/* Is Transit */}
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="location.is_transit"
                  name="location.is_transit"
                  checked={formData.location?.is_transit || false}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="location.is_transit" className="ml-2 block text-sm text-gray-700">
                  ტრანზიტში
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Description Section */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center">
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">აღწერა</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {/* Georgian Description */}
              <div>
                <label htmlFor="description_ka" className="block text-sm font-medium text-gray-700 mb-1">
                  აღწერა (ქართულად)
                </label>
                <textarea
                  id="description_ka"
                  name="description_ka"
                  value={formData.description_ka || ''}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                ></textarea>
              </div>
              
              {/* English Description */}
              <div>
                <label htmlFor="description_en" className="block text-sm font-medium text-gray-700 mb-1">
                  აღწერა (ინგლისურად)
                </label>
                <textarea
                  id="description_en"
                  name="description_en"
                  value={formData.description_en || ''}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              
              {/* Russian Description */}
              <div>
                <label htmlFor="description_ru" className="block text-sm font-medium text-gray-700 mb-1">
                  აღწერა (რუსულად)
                </label>
                <textarea
                  id="description_ru"
                  name="description_ru"
                  value={formData.description_ru || ''}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Submit Button */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
        <div className="flex flex-col sm:flex-row  justify-between items-center ">
          <div className="text-sm text-gray-500">
            {mode === 'create' ? 'ახალი მანქანის დამატება' : 'მანქანის ინფორმაციის განახლება'}
          </div>
          <div className="flex space-x-3 mt-2 sm:mt-0">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              გაუქმება
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader size={16} className="animate-spin mr-2" />
                  {mode === 'create' ? 'იქმნება...' : 'ნახლდება...'}
                </>
              ) : (
                mode === 'create' ? 'მანქანის დამატება' : 'მანქანის განახლება'
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CarForm;