import { useState } from 'react';
import Modal from './Modal';
import { useAuth } from '../../../../context/AuthContext';
import { Check } from 'lucide-react';
import { validatePassword, validateEmail } from '../../../../utils/validation';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const StepIndicator = ({ currentStep }: { currentStep: number }) => (
  <div className="flex items-center justify-center mb-8">
    <div className="flex items-center">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
        currentStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
      }`}>
        {currentStep > 1 ? <Check className="w-5 h-5" /> : 1}
      </div>
      <div className={`w-16 h-1 ${currentStep === 2 ? 'bg-primary' : 'bg-gray-200'}`} />
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
        currentStep === 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
      }`}>
        2
      </div>
    </div>
  </div>
);

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) => {
  const { register, isLoading } = useAuth();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
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
    } else {
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

        onClose();
        setFormData({
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          password: '',
          confirmPassword: '',
          age: '',
          gender: ''
        });
        setStep(1);
      } catch (err: any) {
        const message = err.message || 'რეგისტრაცია ვერ მოხერხდა. გთხოვთ, სცადოთ თავიდან';
        setError(message);
      }
    }
  };

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

  const renderStep1 = () => (
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
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="რეგისტრაცია">
      <StepIndicator currentStep={step} />
      
      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
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
      
      <div className="mt-6 text-center">
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
    </Modal>
  );
};

export default RegisterModal;