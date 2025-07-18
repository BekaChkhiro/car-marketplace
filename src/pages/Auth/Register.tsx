import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Check, Mail, Lock, User, Phone, EyeOff, Eye } from 'lucide-react';
import { validatePassword, validateEmail } from '../../utils/validation';

const Register: React.FC = () => {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const [step, setStep] = useState(1);
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
      established_year: '',
      website_url: '',
      social_media_url: '',
      address: ''
    }
  });
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);

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
    if (!password) return { color: 'bg-gray-200', text: 'სიძლიერე' };

    const { errors } = validatePassword(password);
    const remainingChecks = errors.length;

    if (remainingChecks === 0) return { color: 'bg-green-500', text: 'ძლიერი' };
    if (remainingChecks <= 2) return { color: 'bg-yellow-500', text: 'საშუალო' };
    return { color: 'bg-red-500', text: 'სუსტი' };
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      // Basic validation for both user types
      if (!formData.firstName || !formData.lastName || !formData.phone) {
        setError('გთხოვთ, შეავსოთ ყველა სავალდებულო ველი');
        return;
      }

      if (formData.userType === 'user') {
        // Additional validation for regular users
        if (!formData.age || !formData.gender) {
          setError('გთხოვთ, შეავსოთ ყველა სავალდებულო ველი');
          return;
        }

        const age = parseInt(formData.age);
        if (isNaN(age) || age < 18 || age > 100) {
          setError('ასაკი უნდა იყოს 18-დან 100-მდე');
          return;
        }
      } else if (formData.userType === 'dealer') {
        // Additional validation for dealers
        if (!formData.dealerData.company_name) {
          setError('გთხოვთ, შეიყვანოთ კომპანიის სახელი');
          return;
        }
      }

      // Phone validation for personal phone (both user types)
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
        age: formData.userType === 'user' ? parseInt(formData.age) : null,
        gender: formData.userType === 'user' ? formData.gender as 'male' | 'female' | 'other' : null,
        phone: formData.phone,
        isDealer: formData.userType === 'dealer',
        dealerData: formData.userType === 'dealer' ? {
          company_name: formData.dealerData.company_name,
          established_year: formData.dealerData.established_year ? parseInt(formData.dealerData.established_year) : undefined,
          website_url: formData.dealerData.website_url || undefined,
          social_media_url: formData.dealerData.social_media_url || undefined,
          address: formData.dealerData.address || undefined
        } : undefined
      };
      
      await register(username, formData.email, formData.password, registrationData);
      
      navigate('/'); // Redirect to home page after successful registration
    } catch (err: any) {
      setError(err.message);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
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
      {/* User Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          მომხმარებლის ტიპი
        </label>
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
            <div className={`w-full text-center py-3 px-4 rounded-xl border ${
              formData.userType === 'user' 
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
            <div className={`w-full text-center py-3 px-4 rounded-xl border ${
              formData.userType === 'dealer' 
                ? 'border-primary bg-primary/5 text-primary' 
                : 'border-gray-300 hover:bg-gray-50'
            }`}>
              დილერი
            </div>
          </label>
        </div>
      </div>

      {/* Fields for Regular Users */}
      {formData.userType === 'user' && (
        <>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                სახელი
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed"
                required
                placeholder="სახელი"
                disabled={isLoading}
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                გვარი
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed"
                required
                placeholder="გვარი"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ასაკი
            </label>
            <select
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed appearance-none"
              required
              disabled={isLoading}
            >
              <option value="">აირჩიეთ ასაკი</option>
              {Array.from({ length: 83 }, (_, i) => i + 18).map(age => (
                <option key={age} value={age}>
                  {age} წელი
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              სქესი
            </label>
            <div className="flex gap-4">
              <label className={`flex-1 relative cursor-pointer ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={handleInputChange}
                  className="absolute opacity-0 w-0 h-0"
                  required
                  disabled={isLoading}
                />
                <div className={`w-full text-center py-3 px-4 rounded-xl border ${
                  formData.gender === 'male' 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}>
                  მამრობითი
                </div>
              </label>
              
              <label className={`flex-1 relative cursor-pointer ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={handleInputChange}
                  className="absolute opacity-0 w-0 h-0"
                  disabled={isLoading}
                />
                <div className={`w-full text-center py-3 px-4 rounded-xl border ${
                  formData.gender === 'female' 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}>
                  მდედრობითი
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ტელეფონი
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed"
              required
              placeholder="+995"
              disabled={isLoading}
            />
          </div>
        </>
      )}

      {/* Fields for Dealers */}
      {formData.userType === 'dealer' && (
        <>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                სახელი (კონტაქტი)
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed"
                required
                placeholder="სახელი"
                disabled={isLoading}
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                გვარი (კონტაქტი)
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed"
                required
                placeholder="გვარი"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              კომპანიის სახელი <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="dealerData.company_name"
              value={formData.dealerData.company_name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed"
              required
              placeholder="კომპანიის სახელი"
              disabled={isLoading}
            />
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
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              დაარსების წელი
            </label>
            <select
              name="dealerData.established_year"
              value={formData.dealerData.established_year}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed appearance-none"
              disabled={isLoading}
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
              ვებ გვერდი / სოციალური ქსელი
            </label>
            <input
              type="url"
              name="dealerData.website_url"
              value={formData.dealerData.website_url}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed"
              placeholder="https://example.com"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              სოციალური ქსელის ლინკი
            </label>
            <input
              type="url"
              name="dealerData.social_media_url"
              value={formData.dealerData.social_media_url}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed"
              placeholder="https://facebook.com/yourpage"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              მისამართი
            </label>
            <textarea
              name="dealerData.address"
              value={formData.dealerData.address}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed resize-vertical"
              placeholder="მისამართი"
              disabled={isLoading}
            />
          </div>
        </>
      )}

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <button
          type="submit"
          className="w-full px-4 py-3 bg-primary text-white rounded-xl hover:bg-secondary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'მიმდინარეობს...' : 'გაგრძელება'}
        </button>
      </div>
    </form>
  );

  const renderStep2 = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <div className="mt-4">
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
            ვეთანხმები <Link to={`/${lang}/terms`} className="text-primary hover:text-secondary font-medium transition-colors">წესებს და პირობებს</Link>
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
          disabled={isLoading}
          className="flex-1 px-4 py-3 border border-primary text-primary hover:bg-primary/5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          უკან
        </button>
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
            'რეგისტრაცია'
          )}
        </button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">რეგისტრაცია</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            შექმენით ანგარიში მარტივად
          </p>
        </div>

        <StepIndicator />
        
        {step === 1 ? renderStep1() : renderStep2()}
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            უკვე გაქვთ ანგარიში?{' '}
            <Link to="/auth/login" className="text-primary hover:text-secondary font-medium transition-colors">
              შესვლა
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;