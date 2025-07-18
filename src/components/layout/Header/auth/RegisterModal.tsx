import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getLanguageFromUrl } from '../../../../i18n';
import Modal from './Modal';
import { useAuth } from '../../../../context/AuthContext';
import { Check, Building } from 'lucide-react';
import { validatePassword, validateEmail } from '../../../../utils/validation';
import ImageUploadWithFeatured from '../../../ImageUploadWithFeatured';
import DealerImageUpload from 'components/DealerImageUpload';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const StepIndicator = ({ currentStep }: { currentStep: number }) => (
  <div className="flex items-center justify-center mb-4">
    <div className="flex items-center">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
        }`}>
        {currentStep > 1 ? <Check className="w-4 h-4" /> : <span className="text-sm">1</span>}
      </div>
      <div className={`w-12 h-0.5 ${currentStep === 2 ? 'bg-primary' : 'bg-gray-200'}`} />
      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${currentStep === 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
        }`}>
        <span className="text-sm">2</span>
      </div>
    </div>
  </div>
);

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) => {
  const { register, isLoading } = useAuth();
  const location = useLocation();
  const [currentLang, setCurrentLang] = useState(getLanguageFromUrl());
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<File[]>([]);
  const [featuredImageIndex, setFeaturedImageIndex] = useState(-1);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
    agreeToTerms: false,
    userType: 'user',
    dealerData: {
      company_name: '',
      phone: '',
      established_year: '',
      website_url: '',
      social_media_url: '',
      address: ''
    }
  });
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.phone || !formData.age || !formData.gender) {
        setError('გთხოვთ, შეავსოთ ყველა სავალდებულო ველი');
        return;
      }

      // Additional validation for dealer
      if (formData.userType === 'dealer') {
        if (!formData.dealerData.company_name) {
          setError('გთხოვთ, შეიყვანოთ კომპანიის სახელი');
          return;
        }

        // Require at least one image for dealer
        if (images.length === 0) {
          setError('გთხოვთ, ატვირთოთ მინიმუმ ერთი სურათი');
          return;
        }
      }

      const age = parseInt(formData.age);
      if (isNaN(age) || age < 18 || age > 100) {
        setError('ასაკი უნდა იყოს 18-დან 100-მდე');
        return;
      }

      if (!formData.phone.match(/^(\+995|0)\d{9}$/)) {
        setError('გთხოვთ, შეიყვანოთ ტელეფონის სწორი ფორმატი: +995XXXXXXXXX ან 0XXXXXXXXX');
        return;
      }

      setError(null);
      setStep(2);
    } else {
      if (!formData.email || !formData.password || !formData.confirmPassword) {
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

      if (formData.password !== formData.confirmPassword) {
        setError('პაროლები არ ემთხვევა');
        return;
      }

      const { isValid, errors } = validatePassword(formData.password);
      if (!isValid) {
        setValidationErrors(errors);
        return;
      }

      try {
        const username = `${formData.firstName} ${formData.lastName}`;

        const registrationData = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          age: parseInt(formData.age),
          gender: formData.gender as 'male' | 'female' | 'other',
          phone: formData.phone,
          isDealer: formData.userType === 'dealer',
          dealerData: formData.userType === 'dealer' ? {
            company_name: formData.dealerData.company_name,
            established_year: formData.dealerData.established_year ? parseInt(formData.dealerData.established_year) : undefined,
            website_url: formData.dealerData.website_url || undefined,
            social_media_url: formData.dealerData.social_media_url || undefined,
            address: formData.dealerData.address || undefined,
            images: images,
            featuredImageIndex: featuredImageIndex
          } : undefined
        };

        await register(username, formData.email, formData.password, registrationData);

        // Only close modal automatically if not a dealer with images (so we can see debug logs)
        if (!(formData.userType === 'dealer' && images.length > 0)) {
          onClose();
        } else {
          console.log('🔄 Modal staying open to show upload progress...');
          // Close modal after 10 seconds to allow viewing logs
          setTimeout(() => {
            console.log('⏰ Auto-closing modal after delay');
            onClose();
          }, 10000);
        }
        setFormData({
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          password: '',
          confirmPassword: '',
          age: '',
          gender: '',
          agreeToTerms: false,
          userType: 'user',
          dealerData: {
            company_name: '',
            phone: '',
            established_year: '',
            website_url: '',
            social_media_url: '',
            address: ''
          }
        });
        setStep(1);
      } catch (err: any) {
        const message = err.message || 'რეგისტრაცია ვერ მოხერხდა. გთხოვთ, სცადოთ თავიდან';
        setError(message);
      }
    }
  };

  // Update language when location changes
  useEffect(() => {
    setCurrentLang(getLanguageFromUrl());
  }, [location.pathname]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    // Handle dealer data nested fields
    if (name.startsWith('dealerData.')) {
      const fieldName = name.replace('dealerData.', '');
      setFormData(prev => ({
        ...prev,
        dealerData: {
          ...prev.dealerData,
          [fieldName]: newValue
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: newValue
      }));
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

  const getPasswordStrength = (password: string): { color: string; text: string } => {
    if (!password) return { color: 'bg-gray-200', text: '\u10e1\u10d8\u10eb\u10da\u10d8\u10d4\u10e0\u10d4' };

    const { errors } = validatePassword(password);
    const remainingChecks = errors.length;

    if (remainingChecks === 0) return { color: 'bg-green-500', text: '\u10eb\u10da\u10d8\u10d4\u10e0\u10d8' };
    if (remainingChecks <= 2) return { color: 'bg-yellow-500', text: '\u10e1\u10d0\u10e8\u10e3\u10d0\u10da\u10dd' };
    return { color: 'bg-red-500', text: '\u10e1\u10e3\u10e1\u10e2\u10d8' };
  };

  // Image handling functions
  const handleImageUpload = (newImages: File[]) => {
    setImages(newImages);
    setIsUploading(true);
    // Simulate upload completion after 2 seconds
    setTimeout(() => {
      setIsUploading(false);
    }, 2000);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    // Adjust featuredImageIndex if needed
    if (index === featuredImageIndex) {
      setFeaturedImageIndex(-1);
    } else if (index < featuredImageIndex) {
      setFeaturedImageIndex(featuredImageIndex - 1);
    }
  };

  const renderStep1 = () => (
    <>
      {/* User Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">მომხმარებლის ტიპი</label>
        <div className="flex gap-4">
          <label className={`flex-1 relative cursor-pointer ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}>
            <input
              type="radio"
              name="userType"
              value="user"
              checked={formData.userType === 'user'}
              onChange={handleInputChange}
              className="absolute opacity-0 w-0 h-0"
              required
              disabled={isLoading}
            />
            <div className={`w-full text-center py-3 px-4 rounded-xl border ${formData.userType === 'user'
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-gray-300 hover:bg-gray-50'
              }`}>
              რეგულარული მომხმარებელი
            </div>
          </label>

          <label className={`flex-1 relative cursor-pointer ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}>
            <input
              type="radio"
              name="userType"
              value="dealer"
              checked={formData.userType === 'dealer'}
              onChange={handleInputChange}
              className="absolute opacity-0 w-0 h-0"
              disabled={isLoading}
            />
            <div className={`w-full text-center py-3 px-4 rounded-xl border ${formData.userType === 'dealer'
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-gray-300 hover:bg-gray-50'
              }`}>
              დილერი
            </div>
          </label>
        </div>
      </div>

      {/* Responsive Layout Wrapper */}
      <div className={`mt-4 ${formData.userType === 'dealer' ? 'flex flex-col lg:flex-row gap-6' : ''}`}>
        {/* Main Form (Left Side) */}
        <div className="flex-1 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">სახელი</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200"
                required
                placeholder="სახელი"
                disabled={isLoading}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">გვარი</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200"
                required
                placeholder="გვარი"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ასაკი</label>
            <select
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 appearance-none"
              required
              disabled={isLoading}
            >
              <option value="">აირჩიეთ ასაკი</option>
              {Array.from({ length: 83 }, (_, i) => i + 18).map(age => (
                <option key={age} value={age}>{age} წელი</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">სქესი</label>
            <div className="flex gap-4">
              {['male', 'female'].map(gender => (
                <label key={gender} className={`flex-1 relative cursor-pointer ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}>
                  <input
                    type="radio"
                    name="gender"
                    value={gender}
                    checked={formData.gender === gender}
                    onChange={handleInputChange}
                    className="absolute opacity-0 w-0 h-0"
                    disabled={isLoading}
                  />
                  <div className={`w-full text-center py-3 px-4 rounded-xl border ${formData.gender === gender
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-300 hover:bg-gray-50'
                    }`}>
                    {gender === 'male' ? 'მამრობითი' : 'მდედრობითი'}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ტელეფონი</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200"
              required
              placeholder="+995"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Dealer Info Section - Combined */}
        {formData.userType === 'dealer' && (
          <div className="lg:w-[45%] mt-4 lg:mt-0">
            <div className="border rounded-xl p-4 bg-gradient-to-br from-gray-50 to-white shadow-sm">
              <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building size={18} className="text-primary" />
                </div>
                დილერის ინფორმაცია
              </h3>

              <div className="space-y-4">
                {/* Company Info Fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">კომპანიის სახელი <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="dealerData.company_name"
                    value={formData.dealerData.company_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-800 bg-white hover:bg-gray-50 focus:bg-white disabled:bg-gray-200"
                    required
                    placeholder="კომპანიის სახელი"
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">დაარსების წელი</label>
                    <select
                      name="dealerData.established_year"
                      value={formData.dealerData.established_year}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-800 bg-white hover:bg-gray-50 focus:bg-white disabled:bg-gray-200 appearance-none"
                      disabled={isLoading}
                    >
                      <option value="">აირჩიეთ წელი</option>
                      {Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (_, i) => new Date().getFullYear() - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ვებ გვერდი</label>
                    <input
                      type="url"
                      name="dealerData.website_url"
                      value={formData.dealerData.website_url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-800 bg-white hover:bg-gray-50 focus:bg-white disabled:bg-gray-200"
                      placeholder="https://example.com"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">მისამართი</label>
                  <textarea
                    name="dealerData.address"
                    value={formData.dealerData.address}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-800 bg-white hover:bg-gray-50 focus:bg-white disabled:bg-gray-200 resize-none"
                    placeholder="მისამართი"
                    disabled={isLoading}
                  />
                </div>

                {/* Image Upload Section */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <label className="block mb-3 text-sm font-medium text-gray-700">
                    კომპანიის ლოგო <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    <DealerImageUpload
                      files={images}
                      onFilesChange={handleImageUpload}
                      onFileRemove={removeImage}
                      featuredIndex={featuredImageIndex}
                      onFeaturedIndexChange={setFeaturedImageIndex}
                      error={error && images.length === 0 ? 'გთხოვთ, ატვირთოთ ლოგო' : undefined}
                      isUploading={isUploading}
                      maxFiles={1}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </>
  );

  const renderStep2 = () => (
    <>
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
          disabled={isLoading}
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
          disabled={isLoading}
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
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed"
          required
          placeholder="გაიმეორეთ პაროლი"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            disabled={isLoading}
          />
          <span className="ml-2 text-sm text-gray-700">
            ვეთანხმები <a href={`/${currentLang}/terms`} target="_blank" className="text-primary hover:text-secondary font-medium transition-colors">წესებს და პირობებს</a>
          </span>
        </label>
      </div>
    </>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="რეგისტრაცია"
      maxWidth={formData.userType === 'dealer' && step === 1 ? 'max-w-5xl' : 'max-w-2xl'}
    >
      <div className={formData.userType === 'dealer' && step === 1 ? 'max-h-[70vh] overflow-y-auto' : ''}>
        <StepIndicator currentStep={step} />

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={formData.userType === 'dealer' && step === 1 ? "space-y-4" : "space-y-6"}>
          {step === 1 ? renderStep1() : renderStep2()}

        <div className="flex items-center justify-between gap-4">
          {step === 2 && (
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setError(null);
              }}
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-primary text-primary hover:bg-primary/5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              უკან
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-primary text-white py-3 rounded-xl hover:bg-secondary transition-all duration-300 transform hover:scale-[1.02] shadow-sm hover:shadow-md font-medium text-base disabled:bg-gray-400 disabled:transform-none disabled:shadow-none flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                გთხოვთ მოიცადოთ...
              </>
            ) : (
              step === 1 ? 'შემდეგი' : 'რეგისტრაცია'
            )}
          </button>
        </div>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          უკვე გაქვთ ანგარიში?{' '}
          <button
            onClick={onSwitchToLogin}
            disabled={isLoading}
            className="text-primary hover:text-secondary font-medium transition-colors hover:underline disabled:text-gray-400"
          >
            შესვლა
          </button>
        </p>
      </div>
      </div>
    </Modal>
  );
};

export default RegisterModal;