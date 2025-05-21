import React, { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import Modal from './Modal';
import ForgotPasswordModal from './ForgotPasswordModal';
import GoogleLoginButton from '../../../auth/GoogleLoginButton';
import FacebookLoginButton from '../../../auth/FacebookLoginButton';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onShowRegister }) => {
  const { login, isLoading } = useAuth();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState<string | null>(null);

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
      onClose();
      setFormData({ email: '', password: '', rememberMe: false });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
  };

  if (showForgotPassword) {
    return (
      <ForgotPasswordModal
        isOpen={isOpen}
        onClose={onClose}
        onShowLogin={handleBackToLogin}
      />
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="შესვლა">
      <div className="p-3 sm:p-5">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              ელ-ფოსტა
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              პაროლი
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="rememberMe" className="ml-1.5 sm:ml-2 block text-xs sm:text-sm text-gray-900">
                დამიმახსოვრე
              </label>
            </div>
            
            <button
              type="button"
              onClick={handleForgotPasswordClick}
              className="text-primary hover:text-secondary text-xs sm:text-sm"
            >
              დაგავიწყდა პაროლი?
            </button>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-primary text-white rounded-lg sm:rounded-xl hover:bg-secondary transition-colors disabled:bg-gray-400"
            >
              {isLoading ? 'გთხოვთ მოიცადოთ...' : 'შესვლა'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-2 bg-white text-gray-500">
                ან გაიარეთ ავტორიზაცია
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <GoogleLoginButton onSuccess={() => onClose()} />
            <FacebookLoginButton onSuccess={() => onClose()} />
          </div>
        </div>

        <div className="mt-4 sm:mt-6 text-center">
          <span className="text-xs sm:text-sm text-gray-600">არ გაქვთ ანგარიში?</span>
          <button
            type="button"
            onClick={onShowRegister}
            className="ml-1.5 sm:ml-2 text-primary hover:text-secondary text-xs sm:text-sm"
          >
            რეგისტრაცია
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;