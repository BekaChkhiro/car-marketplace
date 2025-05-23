import React, { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import Modal from './Modal';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowLogin: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose, onShowLogin }) => {
  const { forgotPassword, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await forgotPassword(email);
      setSuccess('პაროლის აღდგენის ინსტრუქცია გამოგზავნილია თქვენს ელ-ფოსტაზე');
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'პაროლის აღდგენა ვერ მოხერხდა');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="პაროლის აღდგენა">
      <div className="p-3 sm:p-5">
        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg">
            {success}
          </div>
        )}

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-primary text-white rounded-lg sm:rounded-xl hover:bg-secondary transition-colors disabled:bg-gray-400"
            >
              {isLoading ? 'გთხოვთ მოიცადოთ...' : 'პაროლის აღდგენა'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={onShowLogin}
              className="text-primary hover:text-secondary text-xs sm:text-sm"
            >
              დაბრუნება ავტორიზაციაზე
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ForgotPasswordModal;