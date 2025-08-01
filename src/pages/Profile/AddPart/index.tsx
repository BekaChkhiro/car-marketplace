import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { useLoading } from '../../../context/LoadingContext';
import { Container, Button, Loading } from '../../../components/ui';
import partService from '../../../api/services/partService';
import balanceService from '../../../api/services/balanceService';
import ImageUploadWithFeatured from '../../../components/ImageUploadWithFeatured';
import MultiLanguageDescription from './components/MultiLanguageDescription';
import VIPStatus from './components/VIPStatus';
import AuthorInfo from './components/AuthorInfo';
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
  vip_status: 'none' | 'vip' | 'vip_plus' | 'super_vip';
  vip_days: number;
  color_highlighting?: boolean;
  color_highlighting_days: number;
  auto_renewal?: boolean;
  auto_renewal_days: number;
  currency?: string; // Currency code (GEL, USD, etc.)
  author_name: string;
  author_phone: string;
}

const AddPart: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation([namespaces.parts, namespaces.filter]);
  const { user } = useAuth();
  const { showToast } = useToast();
  const { showLoading, hideLoading } = useLoading();
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    category_id: 0,
    brand_id: 0,
    model_id: 0,
    condition: 'used',
    price: 0,
    description: '',
    description_en: '',
    description_ka: '',
    vip_status: 'none',
    vip_days: 1,
    color_highlighting: false,
    color_highlighting_days: 1,
    auto_renewal: false,
    auto_renewal_days: 1,
    author_name: user ? `${user.first_name} ${user.last_name}` : '',
    author_phone: user?.phone || ''
  });
  
  const [images, setImages] = useState<File[]>([]);
  const [featuredImageIndex, setFeaturedImageIndex] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [userBalance, setUserBalance] = useState<number>(0);
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Load brands, categories, and user balance on component mount
  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        const [brandsData, categoriesData, balance] = await Promise.all([
          partService.getBrands(),
          partService.getPartCategories(),
          balanceService.getBalance().catch(() => 0) // Default to 0 if balance fetch fails
        ]);
        
        setBrands(brandsData);
        setCategories(categoriesData);
        setUserBalance(balance);
      } catch (error) {
        console.error('Error loading reference data:', error);
        showToast(t('loadFormDataError'), 'error');
      } finally {
        setLoadingData(false);
      }
    };
    
    loadReferenceData();
  }, [showToast, t]);
  
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
  }, [formData.brand_id, showToast, t]);
  
  const handleChange = (field: string | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, value?: any) => {
    // Handle both direct calls (field, value) and event-based calls (e)
    if (typeof field === 'object') {
      // This is an event
      const e = field;
      const { name, value: eventValue, type } = e.target;
      
      // Ensure numeric fields are properly converted to numbers
      let processedValue: string | number = eventValue;
      if (type === 'number' || name === 'category_id' || name === 'brand_id' || name === 'model_id' || name === 'price') {
        processedValue = Number(eventValue);
        console.log(`Converting ${name} to number: ${eventValue} -> ${processedValue}`);
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: processedValue
      }));
      
      // Clear error when field is changed
      if (errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    } else {
      // This is a direct call with field and value
      // Ensure numeric fields are properly converted to numbers
      let processedValue = value;
      if (field === 'category_id' || field === 'brand_id' || field === 'model_id' || field === 'price') {
        processedValue = Number(value);
        console.log(`Converting ${field} to number: ${value} -> ${processedValue}`);
      }
      
      setFormData(prev => ({
        ...prev,
        [field]: processedValue
      }));
      
      // Clear error when field is changed
      if (errors[field]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    }
  };
  
  const handleImageUpload = async (files: File[]) => {
    try {
      setIsUploading(true);
      
      // First validate all files
      const validFiles = files.filter(file => {
        // Basic validation for image files
        if (!file.type.startsWith('image/')) {
          showToast(t('imageErrors.invalidFormat'), 'error');
          return false;
        }
        
        // Size validation (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          showToast(t('imageErrors.fileTooLarge'), 'error');
          return false;
        }
        
        return true;
      });

      if (validFiles.length > 15) {
        showToast(t('imageErrors.tooManyImages'), 'error');
        setIsUploading(false);
        return;
      }

      // Simulate a small delay to show the upload progress
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Directly set the images state to the valid files
      setImages(validFiles);
      
      // Set a timeout to turn off the uploading state
      setTimeout(() => {
        setIsUploading(false);
      }, 500);
      
      // Clear image error if present
      if (errors['images']) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors['images'];
          return newErrors;
        });
      }
    } catch (error: any) {
      setIsUploading(false);
      showToast(error.message || t('imageErrors.uploadError'), 'error');
    }
  };
  
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    if (featuredImageIndex === index) {
      setFeaturedImageIndex(0);
    } else if (featuredImageIndex > index) {
      setFeaturedImageIndex(prev => prev - 1);
    }
    
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
    
    showLoading();
    setLoading(true);
    try {
      console.log('Form data before submission:', formData);
      console.log('Images count:', images.length);
      console.log('Featured image index:', featuredImageIndex);
      
      // Ensure numeric fields are converted to numbers
      const processedFormData = {
        ...formData,
        category_id: Number(formData.category_id),
        brand_id: Number(formData.brand_id),
        model_id: Number(formData.model_id),
        price: Number(formData.price)
      };
      
      console.log('Processed form data:', processedFormData);
      
      // Verify we have images before submitting
      if (images.length === 0) {
        showToast(t('imageRequired'), 'error');
        hideLoading();
        setLoading(false);
        return;
      }
      
      // Create part data object with form data and images (without VIP status initially)
      // Pass the featured image index to the API
      const result = await partService.createPart({
        ...processedFormData,
        images,
        featuredImageIndex
        // VIP status will be purchased separately after part creation
      });
      
      console.log('Part created successfully:', result);
      
      // If VIP status is selected (not 'none') or additional services are enabled, purchase VIP status
      const hasVipStatus = formData.vip_status !== 'none';
      const hasAdditionalServices = formData.color_highlighting || formData.auto_renewal;
      
      if (hasVipStatus || hasAdditionalServices) {
        try {
          console.log('Purchasing VIP status for part:', {
            partId: result.id,
            vipStatus: formData.vip_status,
            days: formData.vip_days,
            colorHighlighting: formData.color_highlighting,
            colorHighlightingDays: formData.color_highlighting_days,
            autoRenewal: formData.auto_renewal,
            autoRenewalDays: formData.auto_renewal_days
          });
          
          await partService.purchaseVipStatus(
            result.id,
            formData.vip_status,
            formData.vip_days,
            formData.color_highlighting || false,
            formData.color_highlighting_days,
            formData.auto_renewal || false,
            formData.auto_renewal_days
          );
          
          console.log('VIP status purchased successfully for part');
          showToast(t('partCreated') + ' (VIP status purchased)', 'success');
        } catch (vipError) {
          console.error('Error purchasing VIP status:', vipError);
          showToast(t('partCreated') + ' (VIP purchase failed)', 'warning');
        }
      } else {
        showToast(t('partCreated'), 'success');
      }
      // Navigate to profile parts page with language prefix
      const currentLang = localStorage.getItem('i18nextLng') || 'ka';
      navigate(`/${currentLang}/profile/parts`);
    } catch (error) {
      console.error('Error creating part:', error);
      showToast(t('partCreateError'), 'error');
    } finally {
      hideLoading();
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
                    {t(`filter:${category.name}`, category.name)}
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
            <div className="bg-white rounded-xl p-6 border">
              <ImageUploadWithFeatured
                files={images}
                onFilesChange={handleImageUpload}
                onFileRemove={removeImage}
                featuredIndex={featuredImageIndex}
                onFeaturedIndexChange={setFeaturedImageIndex}
                error={errors.images}
                isUploading={isUploading}
              />
            </div>
          </div>
          
          {/* Author Information */}
          <div className="mb-6">
            <AuthorInfo
              authorName={formData.author_name}
              authorPhone={formData.author_phone}
              onAuthorNameChange={(value) => handleChange('author_name', value)}
              onAuthorPhoneChange={(value) => handleChange('author_phone', value)}
              errors={errors}
            />
          </div>
          
          {/* VIP Status */}
          <div className="mb-6">
            <VIPStatus
              vipStatus={formData.vip_status}
              vipDays={formData.vip_days}
              colorHighlighting={formData.color_highlighting || false}
              colorHighlightingDays={formData.color_highlighting_days}
              autoRenewal={formData.auto_renewal || false}
              autoRenewalDays={formData.auto_renewal_days}
              userBalance={userBalance}
              onChange={(field, value) => handleChange(field, value)}
            />
          </div>

          <div className="sticky bottom-0 bg-white border py-4 px-6 rounded-b-xl shadow-lg transform translate-y-1">
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
          </div>
        </form>
      </div>
    </Container>
  );
};

export default AddPart;
