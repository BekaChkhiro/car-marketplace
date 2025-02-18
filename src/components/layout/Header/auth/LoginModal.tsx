import { useState } from 'react';
import Modal from './Modal';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
  };

  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    console.log(`Login with ${provider}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="შესვლა">
      <div className="space-y-6">
        <div className="flex justify-between items-center gap-4">
          <button
            type="button"
            onClick={() => handleSocialLogin('google')}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <img src="/images/google-icon.svg" alt="Google" className="w-5 h-5" />
            Google
          </button>
          
          <button
            type="button"
            onClick={() => handleSocialLogin('facebook')}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <img src="/images/facebook-icon.svg" alt="Facebook" className="w-5 h-5" />
            Facebook
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">ან</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ელ-ფოსტა
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white"
              required
              placeholder="თქვენი ელ-ფოსტა"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              პაროლი
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-gray-800 bg-gray-50 hover:bg-gray-100 focus:bg-white"
              required
              placeholder="თქვენი პაროლი"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="remember" className="ml-2 block text-gray-700">
                დამიმახსოვრე
              </label>
            </div>
            <button
              type="button"
              className="text-primary hover:text-secondary transition-colors"
            >
              დაგავიწყდა პაროლი?
            </button>
          </div>
          
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-xl hover:bg-secondary transition-all duration-300 transform hover:scale-[1.02] shadow-sm hover:shadow-md font-medium text-base"
          >
            შესვლა
          </button>
        </form>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          არ გაქვთ ანგარიში?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-primary hover:text-secondary font-medium transition-colors hover:underline"
          >
            რეგისტრაცია
          </button>
        </p>
      </div>
    </Modal>
  );
};

export default LoginModal;