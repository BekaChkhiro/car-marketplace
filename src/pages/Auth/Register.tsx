import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Check, Mail, Lock, User, Phone, EyeOff, Eye } from 'lucide-react';
import { validatePassword, validateEmail } from '../../utils/validation';

const Register: React.FC = () => {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
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
      if (!formData.firstName || !formData.lastName || !formData.phone || !formData.age || !formData.gender) {
        setError('გთხოვთ, შეავსოთ ყველა სავალდებულო ველი');
        return;
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
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('გთხოვთ, შეავსოთ ყველა სავალდებულო ველი');
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
      
      await register(username, formData.email, formData.password, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        age: parseInt(formData.age),
        gender: formData.gender as 'male' | 'female' | 'other',
        phone: formData.phone
      });
      
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            სახელი
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed"
              required
              placeholder="სახელი"
              disabled={isLoading}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            გვარი
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed"
              required
              placeholder="გვარი"
              disabled={isLoading}
            />
          </div>
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
          <label className="flex items-center">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={formData.gender === 'male'}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
              required
              disabled={isLoading}
            />
            <span className="ml-2 text-sm text-gray-700">მამრობითი</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="gender"
              value="female"
              checked={formData.gender === 'female'}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
              disabled={isLoading}
            />
            <span className="ml-2 text-sm text-gray-700">მდედრობითი</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="gender"
              value="other"
              checked={formData.gender === 'other'}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
              disabled={isLoading}
            />
            <span className="ml-2 text-sm text-gray-700">სხვა</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ტელეფონის ნომერი
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed"
            required
            placeholder="+995"
            disabled={isLoading}
          />
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
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed"
            required
            placeholder="შეიყვანეთ ელ-ფოსტა"
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          პაროლი
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full pl-10 pr-10 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed"
            required
            placeholder="შეიყვანეთ პაროლი"
            disabled={isLoading}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
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
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed"
            required
            placeholder="გაიმეორეთ პაროლი"
            disabled={isLoading}
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="button"
          className="w-1/3 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
          onClick={() => setStep(1)}
          disabled={isLoading}
        >
          უკან
        </button>
        <button
          type="submit"
          className="w-2/3 px-4 py-3 bg-primary text-white rounded-xl hover:bg-secondary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'მიმდინარეობს...' : 'რეგისტრაცია'}
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