import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { Container, Button, Loading } from '../../../components/ui';
import partService from '../../../api/services/partService';
import balanceService from '../../../api/services/balanceService';
import ImageUploader from '../AddPart/components/ImageUploader';
import MultiLanguageDescription from '../AddPart/components/MultiLanguageDescription';
import VIPStatus from '../AddPart/components/VIPStatus';
import AuthorInfo from '../AddPart/components/AuthorInfo';
import { namespaces } from '../../../i18n';
import { Part, PartImage } from '../../../api/services/partService';

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
  author_name: string;
  author_phone: string;
}

const EditPart: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation([namespaces.parts, namespaces.filter]);
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [part, setPart] = useState<Part | null>(null);
  const [userBalance, setUserBalance] = useState<number>(0);
  
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
  const [existingImages, setExistingImages] = useState<PartImage[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Load reference data (brands, categories, balance) on component mount
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
      }
    };
    
    loadReferenceData();
  }, [showToast, t]);

  // Load part data
  useEffect(() => {
    const loadPart = async () => {
      if (!id) return;
      
      try {
        const partData = await partService.getPartById(parseInt(id));
        setPart(partData);
        
        // Populate form data from part
        setFormData({
          title: partData.title || '',
          category_id: partData.category_id || 0,
          brand_id: partData.brand_id || 0,
          model_id: partData.model_id || 0,
          condition: partData.condition || 'used',
          price: partData.price || 0,
          description: partData.description || '',
          description_en: partData.description_en || '',
          description_ka: partData.description_ka || '',
          vip_status: (partData as any).vip_status || 'none',
          vip_days: (partData as any).vip_days || 1,
          color_highlighting: (partData as any).color_highlighting || false,
          color_highlighting_days: (partData as any).color_highlighting_days || 1,
          auto_renewal: (partData as any).auto_renewal || false,
          auto_renewal_days: (partData as any).auto_renewal_days || 1,
          author_name: partData.author_name || user ? `${user.first_name} ${user.last_name}` : '',
          author_phone: partData.author_phone || user?.phone || ''
        });
        
        // Set existing images
        if (partData.images && partData.images.length > 0) {
          setExistingImages(partData.images);
        }
        
        // Load models for the selected brand
        if (partData.brand_id) {
          try {
            const modelsData = await partService.getModelsByBrand(partData.brand_id);
            setModels(modelsData);
          } catch (modelError) {
            console.error('Error loading models:', modelError);
          }
        }
      } catch (error) {
        console.error('[EditPart] Error loading part:', error);
        showToast(t('loadPartError'), 'error');
        navigate('/profile/parts');
      } finally {
        setLoading(false);
      }
    };
    
    loadPart();
  }, [id, navigate, showToast, t]);
  
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
  
  // Check if user is authorized to edit this part
  useEffect(() => {
    if (part && user && part.seller_id !== user.id) {
      showToast(t('noPermissionToEdit'), 'error');
      navigate('/profile/parts');
    }
  }, [part, user, navigate, showToast, t]);
  
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
    
    // Only require images if there are no existing images
    if (images.length === 0 && existingImages.length === 0) {
      newErrors.images = t('imageRequired');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast(t('correctFormErrors'), 'error');
      return;
    }
    
    if (!id || !part) {
      showToast(t('partNotFound'), 'error');
      return;
    }
    
    setSaveLoading(true);
    try {
      // Ensure numeric fields are converted to numbers
      const processedFormData = {
        id: parseInt(id),
        ...formData,
        category_id: Number(formData.category_id),
        brand_id: Number(formData.brand_id),
        model_id: Number(formData.model_id),
        price: Number(formData.price)
      };
      
      // Update part with form data and new images (without VIP status initially)
      await partService.updatePart(processedFormData, images);
      
      // Check if VIP status or additional services have changed and need to be purchased
      const originalVipStatus = (part as any).vip_status || 'none';
      const originalColorHighlighting = (part as any).color_highlighting || false;
      const originalAutoRenewal = (part as any).auto_renewal || false;
      
      const hasVipStatusChange = formData.vip_status !== originalVipStatus;
      const hasColorHighlightingChange = formData.color_highlighting !== originalColorHighlighting;
      const hasAutoRenewalChange = formData.auto_renewal !== originalAutoRenewal;
      const hasVipStatus = formData.vip_status !== 'none';
      const hasAdditionalServices = formData.color_highlighting || formData.auto_renewal;
      
      // If VIP status or additional services are selected, purchase VIP status
      // Always purchase if VIP status is not 'none' or if additional services are enabled
      if (hasVipStatus || hasAdditionalServices) {
        try {
          console.log('Purchasing updated VIP status for part:', {
            partId: parseInt(id),
            vipStatus: formData.vip_status,
            days: formData.vip_days,
            colorHighlighting: formData.color_highlighting,
            colorHighlightingDays: formData.color_highlighting_days,
            autoRenewal: formData.auto_renewal,
            autoRenewalDays: formData.auto_renewal_days
          });
          
          await partService.purchaseVipStatus(
            parseInt(id),
            formData.vip_status,
            formData.vip_days,
            formData.color_highlighting || false,
            formData.color_highlighting_days,
            formData.auto_renewal || false,
            formData.auto_renewal_days
          );
          
          console.log('VIP status updated successfully for part');
          showToast(t('partUpdated') + ' (VIP status updated)', 'success');
        } catch (vipError) {
          console.error('Error updating VIP status:', vipError);
          showToast(t('partUpdated') + ' (VIP update failed)', 'warning');
        }
      } else {
        showToast(t('partUpdated'), 'success');
      }
      // Navigate to profile parts page with language prefix
      const currentLang = localStorage.getItem('i18nextLng') || 'ka';
      navigate(`/${currentLang}/profile/parts`);
    } catch (error) {
      console.error('Error updating part:', error);
      showToast(t('partUpdateError'), 'error');
    } finally {
      setSaveLoading(false);
    }
  };
  
  const handleDeleteImage = async (imageId: number) => {
    if (!id) return;
    
    try {
      await partService.deleteImage(parseInt(id), imageId);
      
      // Update existing images list
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
      
      showToast(t('imageDeleted'), 'success');
    } catch (error) {
      console.error('Error deleting image:', error);
      showToast(t('imageDeleteError'), 'error');
    }
  };
  
  const handleSetPrimaryImage = async (imageId: number) => {
    if (!id) return;
    
    try {
      await partService.setImageAsPrimary(parseInt(id), imageId);
      
      // Update existing images list to reflect new primary status
      setExistingImages(prev => prev.map(img => ({
        ...img,
        is_primary: img.id === imageId
      })));
      
      showToast(t('primaryImageSet'), 'success');
    } catch (error) {
      console.error('Error setting primary image:', error);
      showToast(t('primaryImageError'), 'error');
    }
  };
  
  // Redirect if not logged in
  if (!user) {
    navigate('/login');
    return null;
  }
  
  if (loading) {
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
        <h1 className="text-2xl font-bold mb-6">{t('editPart')}</h1>
        
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
          
          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('existingImages')}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {existingImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <div className={`h-24 w-full bg-gray-100 rounded-md overflow-hidden ${image.is_primary ? 'ring-2 ring-primary' : ''}`}>
                      <img
                        src={image.medium_url || image.url}
                        alt={`Part image ${image.id}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="absolute top-1 right-1 flex space-x-1">
                      {!image.is_primary && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryImage(image.id)}
                          className="bg-blue-600 bg-opacity-70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          title={t('setPrimary')}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(image.id)}
                        className="bg-gray-800 bg-opacity-70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title={t('deleteImage')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    {image.is_primary && (
                      <div className="absolute bottom-1 left-1 bg-blue-600 bg-opacity-70 text-white text-xs px-1 rounded">
                        {t('primary')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* New Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {existingImages.length > 0 ? t('addMoreImages') : t('partImages')} 
              {existingImages.length === 0 && <span className="text-red-500">*</span>}
            </label>
            <ImageUploader 
              images={images} 
              onChange={handleImageChange} 
              error={errors.images}
            />
            {errors.images && <p className="mt-1 text-sm text-red-500">{errors.images}</p>}
          </div>
          
          {/* Author Information */}
          <div className="mb-6">
            <AuthorInfo
              authorName={formData.author_name}
              authorPhone={formData.author_phone}
              onAuthorNameChange={(value) => setFormData(prev => ({ ...prev, author_name: value }))}
              onAuthorPhoneChange={(value) => setFormData(prev => ({ ...prev, author_phone: value }))}
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
              onChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
            />
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/profile/parts')}
              disabled={saveLoading}
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={saveLoading}
            >
              {t('savePart')}
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
};

export default EditPart;
