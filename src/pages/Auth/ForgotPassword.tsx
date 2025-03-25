import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';

const ForgotPassword: React.FC = () => {
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
      setSuccess('პაროლის აღდგენის ინსტრუქცია გამოგზავნილია თქვენს ელფოსტაზე');
      setEmail('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">პაროლის აღდგენა</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            შეიყვანეთ თქვენი ელფოსტის მისამართი და ჩვენ გამოგიგზავნით პაროლის აღდგენის ინსტრუქციას
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none"
                placeholder="თქვენი ელ-ფოსტა"
                disabled={isLoading || !!success}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
              disabled={isLoading || !!success}
            >
              {isLoading ? 'მიმდინარეობს...' : 'გაგზავნა'}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <Link 
            to="/auth/login" 
            className="inline-flex items-center text-primary hover:text-secondary text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            დაბრუნება შესვლის გვერდზე
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;