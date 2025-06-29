import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { Container, Button, Loading } from '../../../components/ui';
import partService from '../../../api/services/partService';
import ImageUploader from './components/ImageUploader';
import MultiLanguageDescription from './components/MultiLanguageDescription';
import { namespaces } from '../../../i18n';

interface FormData {
  title: string;
  category_id: number;
  brand_id: number;
  model_id: number;
  condition: string;
  price: number;
  description: string;
  description_en: string;
  description_ka: string;
}

const AddPart: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(namespaces.parts);
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    category_id: 0,
    brand_id: 0,
    model_id: 0,
    condition: 'used',
    price: 0,
    description: '',
    description_en: '',
    description_ka: ''
  });
  
  const [images, setImages] = useState<File[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Load brands and categories on component mount
  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        const [brandsData, categoriesData] = await Promise.all([
          partService.getBrands(),
          partService.getPartCategories()
        ]);
        
        setBrands(brandsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading reference data:', error);
        showToast(t('loadFormDataError'), 'error');
      } finally {
        setLoadingData(false);
      }
    };
    
    loadReferenceData();
  }, [showToast]);
  
  // Load models when brand changes
  useEffect(() => {
    const loadModels = async () => {
      if (!formData.brand_id) {
        setModels([]);
        return;
      }
      
      try {
        const modelsData = await partService.getModelsByBrand(formData.brand_id);
        setModels(modelsData);
      } catch (error) {
        console.error('Error loading models:', error);
        showToast(t('loadModelsError'), 'error');
      }
    };
    
    loadModels();
  }, [formData.brand_id, showToast]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleImageChange = (files: File[]) => {
    setImages(files);
    
    // Clear image error if present
    if (errors['images']) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors['images'];
        return newErrors;
      });
    }
  };
  
  const handleDescriptionChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when field is changed
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.title.trim()) newErrors.title = t('formErrors.titleRequired');
    if (formData.title.trim().length < 3) newErrors.title = t('titleTooShort');
    
    if (!formData.category_id) newErrors.category_id = t('formErrors.categoryRequired');
    if (!formData.brand_id) newErrors.brand_id = t('formErrors.brandRequired');
    if (!formData.model_id) newErrors.model_id = t('formErrors.modelRequired');
    
    if (!formData.price || formData.price <= 0) newErrors.price = t('formErrors.priceRequired');
    
    if (images.length === 0) newErrors.images = t('imageRequired');
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast(t('correctFormErrors'), 'error');
      return;
    }
    
    setLoading(true);
    try {
      // Ensure numeric fields are converted to numbers
      const processedFormData = {
        ...formData,
        category_id: Number(formData.category_id),
        brand_id: Number(formData.brand_id),
        model_id: Number(formData.model_id),
        price: Number(formData.price)
      };
      
      // Create part data object with form data and images
      await partService.createPart({
        ...processedFormData,
        images
      });
      
      showToast(t('partCreated'), 'success');
      // Navigate to profile parts page with language prefix
      const currentLang = localStorage.getItem('i18nextLng') || 'ka';
      navigate(`/${currentLang}/profile/parts`);
    } catch (error) {
      console.error('Error creating part:', error);
      showToast(t('partCreateError'), 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Redirect if not logged in
  if (!user) {
    navigate('/login');
    return null;
  }
  
  if (loadingData) {
    return (
      <Container>
        <div className="flex justify-center items-center h-64">
          <Loading />
        </div>
      </Container>
    );
  }
  
  return (
    <Container>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">{t('addPart')}</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                {t('title')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder={t('enterTitle')}
                className={`w-full p-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>
            
            {/* Category */}
            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                {t('category')} <span className="text-red-500">*</span>
              </label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.category_id ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="0">{t('selectCategory')}</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category_id && <p className="mt-1 text-sm text-red-500">{errors.category_id}</p>}
            </div>
            
            {/* Brand */}
            <div>
              <label htmlFor="brand_id" className="block text-sm font-medium text-gray-700 mb-1">
                {t('brand')} <span className="text-red-500">*</span>
              </label>
              <select
                id="brand_id"
                name="brand_id"
                value={formData.brand_id}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.brand_id ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="0">{t('selectBrand')}</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
              {errors.brand_id && <p className="mt-1 text-sm text-red-500">{errors.brand_id}</p>}
            </div>
            
            {/* Model */}
            <div>
              <label htmlFor="model_id" className="block text-sm font-medium text-gray-700 mb-1">
                {t('model')} <span className="text-red-500">*</span>
              </label>
              <select
                id="model_id"
                name="model_id"
                value={formData.model_id}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${errors.model_id ? 'border-red-500' : 'border-gray-300'}`}
                disabled={!formData.brand_id}
              >
                <option value="0">
                  {formData.brand_id ? t('selectModel') : t('selectBrandFirst')}
                </option>
                {models.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
              {errors.model_id && <p className="mt-1 text-sm text-red-500">{errors.model_id}</p>}
            </div>
            
            {/* Condition */}
            <div>
              <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                {t('condition')} <span className="text-red-500">*</span>
              </label>
              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="used">{t('used')}</option>
                <option value="new">{t('new')}</option>
              </select>
            </div>
            
            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                {t('price')} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                placeholder={t('enterPrice')}
                className={`w-full p-2 border rounded-md ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
            </div>
          </div>
          
          {/* Description in multiple languages */}
          <div className="mb-6">
            <MultiLanguageDescription
              descriptions={{
                description: formData.description,
                description_en: formData.description_en,
                description_ka: formData.description_ka
              }}
              onChange={handleDescriptionChange}
              errors={errors}
            />
          </div>
          
          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('partImages')} <span className="text-red-500">*</span>
            </label>
            <ImageUploader 
              images={images} 
              onChange={handleImageChange} 
              error={errors.images}
            />
            {errors.images && <p className="mt-1 text-sm text-red-500">{errors.images}</p>}
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/profile/parts')}
              disabled={loading}
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
            >
              {t('addPart')}
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
};

export default AddPart;
