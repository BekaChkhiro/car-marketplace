import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import GoogleLoginButton from '../../components/auth/GoogleLoginButton';
import FacebookLoginButton from '../../components/auth/FacebookLoginButton';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(formData.email, formData.password, formData.rememberMe);
      navigate('/'); // Redirect to home page after successful login
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSocialSuccess = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">შესვლა</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            შედით თქვენს ანგარიშში თანდართული ფორმის გამოყენებით
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                ელ-ფოსტა
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none"
                  placeholder="თქვენი ელ-ფოსტა"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                პაროლი
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-10 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none"
                  placeholder="თქვენი პაროლი"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                დამიმახსოვრე
              </label>
            </div>

            <Link
              to="/auth/forgot-password"
              className="text-primary hover:text-secondary text-sm transition-colors"
            >
              პაროლი დაგავიწყდათ?
            </Link>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
              disabled={isLoading}
            >
              {isLoading ? 'მიმდინარეობს...' : 'შესვლა'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                ან გაიარეთ ავტორიზაცია
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <GoogleLoginButton onSuccess={handleSocialSuccess} />
            <FacebookLoginButton onSuccess={handleSocialSuccess} />
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            არ გაქვთ ანგარიში?{' '}
            <Link to="/auth/register" className="text-primary hover:text-secondary font-medium transition-colors">
              რეგისტრაცია
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;