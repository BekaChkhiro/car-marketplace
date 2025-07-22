import React, { useState, useEffect } from 'react';
import { X, Upload, Building, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Autosalon, CreateAutosalonRequest } from '../../../../api/types/autosalon.types';
import autosalonService from '../../../../api/services/autosalonService';
import { useToast } from '../../../../context/ToastContext';
import { validatePassword, validateEmail } from '../../../../utils/validation';
import DealerImageUpload from '../../../../components/DealerImageUpload';

interface AutosalonFormProps {
  autosalon?: Autosalon | null;
  onClose: () => void;
  onSubmit: (success: boolean) => void;
}

const AutosalonForm: React.FC<AutosalonFormProps> = ({ autosalon, onClose, onSubmit }) => {
  const { t } = useTranslation('admin');
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [featuredImageIndex, setFeaturedImageIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    // User data
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: '',
    confirm_password: '',
    phone: '',
    gender: 'male' as 'male' | 'female' | 'other',
    
    // Autosalon data
    company_name: '',
    established_year: '',
    website_url: '',
    address: '',
    
    // Terms
    agreeToTerms: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (autosalon) {
      setFormData({
        first_name: autosalon.user?.first_name || '',
        last_name: autosalon.user?.last_name || '',
        email: autosalon.user?.email || '',
        username: autosalon.user?.username || '',
        password: '',
        confirm_password: '',
        phone: autosalon.user?.phone || '',
        gender: (autosalon.user?.gender as 'male' | 'female' | 'other') || 'male',
        company_name: autosalon.company_name,
        established_year: autosalon.established_year?.toString() || '',
        website_url: autosalon.website_url || '',
        address: autosalon.address || '',
        agreeToTerms: false
      });
      
      if (autosalon.logo_url) {
        setLogoPreview(autosalon.logo_url);
        // Note: For edit mode, we don't set images as they are actual uploaded files
        // The logo preview will show the current logo URL
      }
    }
  }, [autosalon]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    if (error) setError(null);

    if (name === 'password') {
      const { errors } = validatePassword(value);
      setValidationErrors(errors);
    }

    if (name === 'password' && !value) {
      setValidationErrors([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = (newImages: File[]) => {
    setImages(newImages);
    if (newImages.length > 0 && !logoFile) {
      setLogoFile(newImages[featuredImageIndex] || newImages[0]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    
    if (featuredImageIndex >= newImages.length) {
      setFeaturedImageIndex(Math.max(0, newImages.length - 1));
    }
    
    if (newImages.length === 0) {
      setLogoFile(null);
      setLogoPreview(null);
    } else {
      const newFeaturedIndex = featuredImageIndex >= newImages.length ? 0 : featuredImageIndex;
      setLogoFile(newImages[newFeaturedIndex]);
    }
  };

  const handleFeaturedImageChange = (index: number) => {
    setFeaturedImageIndex(index);
    setLogoFile(images[index]);
  };

  const getPasswordStrength = (password: string): { color: string; text: string } => {
    if (!password) return { color: 'bg-gray-200', text: t('common.strength') };

    const { errors } = validatePassword(password);
    const remainingChecks = errors.length;

    if (remainingChecks === 0) return { color: 'bg-green-500', text: t('common.strong') };
    if (remainingChecks <= 2) return { color: 'bg-yellow-500', text: t('common.medium') };
    return { color: 'bg-red-500', text: t('common.weak') };
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      // Basic validation
      if (!formData.first_name || !formData.last_name || !formData.phone) {
        setError('გთხოვთ, შეავსოთ ყველა სავალდებულო ველი');
        return;
      }

      // Company name validation
      if (!formData.company_name) {
        setError('გთხოვთ, შეიყვანოთ კომპანიის სახელი');
        return;
      }

      // Phone validation
      if (!formData.phone.match(/^(\+995|0)\d{9}$/)) {
        setError('გთხოვთ, შეიყვანოთ ტელეფონის სწორი ფორმატი: +995XXXXXXXXX ან 0XXXXXXXXX');
        return;
      }
      
      setError(null);
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!autosalon) {
      // Validate all required fields for new autosalon
      if (!formData.first_name || !formData.last_name || !formData.phone || !formData.company_name) {
        setError('გთხოვთ, შეავსოთ ყველა სავალდებულო ველი');
        return;
      }

      if (!formData.email || !formData.password || !formData.confirm_password) {
        setError('გთხოვთ, შეავსოთ ყველა სავალდებულო ველი');
        return;
      }
      
      if (!formData.agreeToTerms) {
        setError('გთხოვთ, დაეთანხმოთ წესებს და პირობებს');
        return;
      }

      if (!validateEmail(formData.email)) {
        setError('გთხოვთ, შეიყვანოთ ელ-ფოსტის სწორი ფორმატი');
        return;
      }
      
      if (formData.password !== formData.confirm_password) {
        setError('პაროლები არ ემთხვევა');
        return;
      }

      const { isValid, errors } = validatePassword(formData.password);
      if (!isValid) {
        setValidationErrors(errors);
        return;
      }

      // Phone validation
      if (!formData.phone.match(/^(\+995|0)\d{9}$/)) {
        setError('გთხოვთ, შეიყვანოთ ტელეფონის სწორი ფორმატი: +995XXXXXXXXX ან 0XXXXXXXXX');
        return;
      }
    }

    setLoading(true);

    try {
      if (autosalon) {
        // Update existing autosalon
        const updateData = {
          company_name: formData.company_name,
          phone: formData.phone || undefined,
          established_year: formData.established_year ? parseInt(formData.established_year) : undefined,
          website_url: formData.website_url || undefined,
          address: formData.address || undefined
        };

        await autosalonService.updateAutosalon(autosalon.id, updateData);

        // Upload logo if file is selected
        if (images.length > 0) {
          setIsUploading(true);
          const featuredImage = images[featuredImageIndex] || images[0];
          await autosalonService.uploadLogo(autosalon.id, featuredImage);
          setIsUploading(false);
        }

        showToast(t('common.updated'), 'success');
      } else {
        // Create new autosalon
        const createData: CreateAutosalonRequest = {
          userData: {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            username: formData.email,
            password: formData.password,
            phone: formData.phone || undefined,
            gender: formData.gender
          },
          autosalonData: {
            company_name: formData.company_name,
            established_year: formData.established_year ? parseInt(formData.established_year) : undefined,
            website_url: formData.website_url || undefined,
            address: formData.address || undefined
            // logo_url is uploaded separately after autosalon creation
          }
        };
        console.log('Sending data to server:', JSON.stringify(createData, null, 2));
        const response = await autosalonService.createAutosalon(createData);

        // Upload logo if file is selected
        if (images.length > 0 && response.data) {
          setIsUploading(true);
          const featuredImage = images[featuredImageIndex] || images[0];
          await autosalonService.uploadLogo(response.data.id, featuredImage);
          setIsUploading(false);
        }

        showToast(t('common.created'), 'success');
      }

      onSubmit(true);
    } catch (error: any) {
      console.error('Form submission error:', error);
      showToast(error.message || t('common.error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      <div className="flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
        }`}>
          {step > 1 ? <Check className="w-5 h-5" /> : 1}
        </div>
        <div className={`w-16 h-1 ${step === 2 ? 'bg-primary' : 'bg-gray-200'}`} />
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          step === 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
        }`}>
          2
        </div>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <form onSubmit={handleContinue} className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">პირადი ინფორმაცია (კონტაქტი)</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              სახელი
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed"
              required
              placeholder="სახელი"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              გვარი
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed"
              required
              placeholder="გვარი"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            პერსონალური ტელეფონი
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed"
            required
            placeholder="+995"
            disabled={loading}
          />
        </div>
      </div>

      {/* Company Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">კომპანიის ინფორმაცია</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            კომპანიის სახელი <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed"
            required
            placeholder="კომპანიის სახელი"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            დაარსების წელი
          </label>
          <select
            name="established_year"
            value={formData.established_year}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed appearance-none"
            disabled={loading}
          >
            <option value="">აირჩიეთ წელი</option>
            {Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ვებ გვერდი
          </label>
          <input
            type="url"
            name="website_url"
            value={formData.website_url}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed"
            placeholder="https://example.com"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            მისამართი
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed resize-vertical"
            placeholder="მისამართი"
            disabled={loading}
          />
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ლოგო
          </label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="inline-flex items-center px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <Upload size={16} className="mr-2" />
                ლოგოს ატვირთვა
              </label>
            </div>
            {logoPreview && (
              <div className="w-16 h-16 border border-gray-300 rounded-xl overflow-hidden">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <button
          type="submit"
          className="w-full px-4 py-3 bg-primary text-white rounded-xl hover:bg-secondary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'მიმდინარეობს...' : 'გაგრძელება'}
        </button>
      </div>
    </form>
  );

  const renderStep2 = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          მომხმარებლის სახელი
        </label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed"
          required
          placeholder="მომხმარებლის სახელი"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ელ-ფოსტა
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed"
          required
          placeholder="შეიყვანეთ ელ-ფოსტა"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          პაროლი
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed"
          required
          placeholder="შეიყვანეთ პაროლი"
          disabled={loading}
        />
        {formData.password && (
          <>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getPasswordStrength(formData.password).color} transition-all duration-300`} 
                  style={{ 
                    width: `${((5 - validationErrors.length) / 5) * 100}%`
                  }}
                />
              </div>
              <span className="text-sm text-gray-600">{getPasswordStrength(formData.password).text}</span>
            </div>
            {validationErrors.length > 0 && (
              <ul className="mt-2 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-sm text-red-600">
                    {error}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          გაიმეორეთ პაროლი
        </label>
        <input
          type="password"
          name="confirm_password"
          value={formData.confirm_password}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed"
          required
          placeholder="გაიმეორეთ პაროლი"
          disabled={loading}
        />
      </div>

      <div className="mt-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            disabled={loading}
          />
          <span className="ml-2 text-sm text-gray-700">
            ვეთანხმები წესებს და პირობებს
          </span>
        </label>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setStep(1)}
          disabled={loading}
          className="flex-1 px-4 py-3 border border-primary text-primary hover:bg-primary/5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          უკან
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-primary text-white py-3 rounded-xl hover:bg-secondary transition-all duration-300 transform hover:scale-[1.02] shadow-sm hover:shadow-md font-medium text-base disabled:bg-gray-400 disabled:transform-none disabled:shadow-none flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              გთხოვთ მოიცადოთ...
            </>
          ) : (
            'შექმნა'
          )}
        </button>
      </div>
    </form>
  );

  const renderEditForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">ავტოსალონის ინფორმაცია</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            კომპანიის სახელი *
          </label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="კომპანიის სახელი"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ტელეფონი
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="+995XXXXXXXXX"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            დაარსების წელი
          </label>
          <select
            name="established_year"
            value={formData.established_year}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">აირჩიეთ წელი</option>
            {Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ვებ გვერდი
          </label>
          <input
            type="url"
            name="website_url"
            value={formData.website_url}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            მისამართი
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="მისამართი"
          />
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ლოგო
          </label>
          <DealerImageUpload
            files={images}
            onFilesChange={handleImageUpload}
            onFileRemove={removeImage}
            featuredIndex={featuredImageIndex}
            onFeaturedIndexChange={handleFeaturedImageChange}
            error={error && images.length === 0 ? 'გთხოვთ, ატვირთოთ ლოგო' : undefined}
            isUploading={isUploading}
            maxFiles={1}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          disabled={loading}
        >
          გაუქმება
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'მიმდინარეობს...' : 'განახლება'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">
            {autosalon ? t('autosalons.edit') : t('autosalons.create')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {autosalon ? (
            renderEditForm()
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">პირადი ინფორმაცია (კონტაქტი)</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      სახელი *
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed"
                      required
                      placeholder="სახელი"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      გვარი *
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed"
                      required
                      placeholder="გვარი"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    პერსონალური ტელეფონი *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed"
                    required
                    placeholder="+995XXXXXXXXX"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ელ-ფოსტა *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed"
                    required
                    placeholder="example@email.com"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    სქესი *
                  </label>
                  <div className="flex gap-4">
                    {['male', 'female'].map(gender => (
                      <label key={gender} className={`flex-1 relative cursor-pointer ${loading ? 'cursor-not-allowed opacity-50' : ''}`}>
                        <input
                          type="radio"
                          name="gender"
                          value={gender}
                          checked={formData.gender === gender}
                          onChange={handleInputChange}
                          className="absolute opacity-0 w-0 h-0"
                          disabled={loading}
                          required
                        />
                        <div className={`w-full text-center py-3 px-4 rounded-xl border ${formData.gender === gender
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-gray-300 hover:bg-gray-50'
                          } transition-all duration-200`}>
                          {gender === 'male' ? 'მამრობითი' : 'მდედრობითი'}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      პაროლი *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed"
                      required
                      placeholder="შეიყვანეთ პაროლი"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      გაიმეორეთ პაროლი *
                    </label>
                    <input
                      type="password"
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed"
                      required
                      placeholder="გაიმეორეთ პაროლი"
                      disabled={loading}
                    />
                  </div>
                </div>

                {formData.password && (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getPasswordStrength(formData.password).color} transition-all duration-300`} 
                          style={{ 
                            width: `${((5 - validationErrors.length) / 5) * 100}%`
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{getPasswordStrength(formData.password).text}</span>
                    </div>
                    {validationErrors.length > 0 && (
                      <ul className="space-y-1">
                        {validationErrors.map((error, index) => (
                          <li key={index} className="text-sm text-red-600">
                            {error}
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </div>

              {/* Company Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">კომპანიის ინფორმაცია</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    კომპანიის სახელი *
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed"
                    required
                    placeholder="კომპანიის სახელი"
                    disabled={loading}
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    დაარსების წელი
                  </label>
                  <select
                    name="established_year"
                    value={formData.established_year}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed appearance-none"
                    disabled={loading}
                  >
                    <option value="">აირჩიეთ წელი</option>
                    {Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ვებ გვერდი
                  </label>
                  <input
                    type="url"
                    name="website_url"
                    value={formData.website_url}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed"
                    placeholder="https://example.com"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    მისამართი
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed resize-vertical"
                    placeholder="მისამართი"
                    disabled={loading}
                  />
                </div>

                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ლოგო
                  </label>
                  <DealerImageUpload
                    files={images}
                    onFilesChange={handleImageUpload}
                    onFileRemove={removeImage}
                    featuredIndex={featuredImageIndex}
                    onFeaturedIndexChange={handleFeaturedImageChange}
                    error={error && images.length === 0 ? 'გთხოვთ, ატვირთოთ ლოგო' : undefined}
                    isUploading={isUploading}
                    maxFiles={1}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    disabled={loading}
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    ვეთანხმები წესებს და პირობებს
                  </span>
                </label>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50"
                  disabled={loading}
                >
                  გაუქმება
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-secondary disabled:opacity-50 flex items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      მიმდინარეობს...
                    </>
                  ) : (
                    'შექმნა'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutosalonForm;