import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { validatePassword } from '../../utils/validation';

const ResetPassword = () => {
  const auth = useAuth();
  if (!auth) throw new Error('Auth context is not available');
  
  const { resetPassword, isLoading } = auth;
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirm: false
  });

  // Get token from URL
  const token = new URLSearchParams(location.search).get('token');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') {
      const { errors } = validatePassword(value);
      setValidationErrors(errors);
    }
  };

  const togglePasswordVisibility = (field: 'password' | 'confirm') => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('არასწორი ან ვადაგასული ბმული');
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
      await resetPassword(token, formData.password);
      navigate('/login', { state: { message: 'პაროლი წარმატებით შეიცვალა. გთხოვთ გაიაროთ ავტორიზაცია.' } });
    } catch (err: any) {
      setError(err.message || 'პაროლის შეცვლა ვერ მოხერხდა. გთხოვთ, სცადოთ თავიდან');
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          პაროლის აღდგენა
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                ახალი პაროლი
              </label>
              <div className="mt-1 relative">
                <input
                  type={showPassword.password ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none"
                  required
                />
                <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('password')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword.password ? <EyeOff size={20} /> : <Eye size={20} />}
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
                    <span className="text-sm text-gray-600">
                      {getPasswordStrength(formData.password).text}
                    </span>
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
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                გაიმეორეთ პაროლი
              </label>
              <div className="mt-1 relative">
                <input
                  type={showPassword.confirm ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none"
                  required
                />
                <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-3 rounded-xl hover:bg-secondary transition-all duration-300 transform hover:scale-[1.02] shadow-sm hover:shadow-md disabled:bg-gray-400 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  გთხოვთ მოიცადოთ...
                </>
              ) : (
                <>
                  <Lock size={18} />
                  პაროლის შეცვლა
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;