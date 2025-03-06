import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Lock, Eye, EyeOff, KeyRound } from 'lucide-react';

const PasswordChange = () => {
  const { updatePassword, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setError('პაროლები არ ემთხვევა');
      return;
    }

    try {
      await updatePassword(formData.currentPassword, formData.newPassword);
      setSuccess('პაროლი წარმატებით შეიცვალა');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'პაროლის შეცვლა ვერ მოხერხდა');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {success && (
        <div className="p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          {success}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          {error}
        </div>
      )}

      <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-xl mb-8">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white shadow-lg">
          <KeyRound size={32} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">პაროლის შეცვლა</h2>
          <p className="text-gray-500 mt-1">შეიყვანეთ მიმდინარე და ახალი პაროლი</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
            მიმდინარე პაროლი
          </label>
          <div className="relative">
            <input
              type={showPasswords.current ? 'text' : 'password'}
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none"
              required
            />
            <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
            ახალი პაროლი
          </label>
          <div className="relative">
            <input
              type={showPasswords.new ? 'text' : 'password'}
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none"
              required
            />
            <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            გაიმეორეთ ახალი პაროლი
          </label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
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
              {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
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
  );
};

export default PasswordChange;