import React, { useState } from 'react';
import { User, Mail, Phone, UserCircle, Calendar, UserCheck } from 'lucide-react';
import { useAuth } from '../../../../../context/AuthContext';
import { useToast } from '../../../../../context/ToastContext';
import { useTranslation } from 'react-i18next';

const ProfileEdit: React.FC = () => {
  const { t } = useTranslation(['profile']);
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    age: user?.age || 18,
    gender: user?.gender || 'other'
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      // Create a new object without the email field
      const { email, ...updateData } = formData;
      await updateProfile(updateData);
      const successMsg = t('profileEdit.success');
      setSuccess(successMsg);
      showToast(successMsg, 'success');
    } catch (error: any) {
      const errorMsg = error.message || t('profileEdit.error');
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-5 sm:space-y-6">
      {success && (
        <div className="p-3 sm:p-4 bg-green-50 text-green-700 text-sm sm:text-base rounded-xl flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          {success}
        </div>
      )}

      {error && (
        <div className="p-3 sm:p-4 bg-red-50 text-red-700 text-sm sm:text-base rounded-xl flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          {error}
        </div>
      )}

      <div className="flex items-center gap-4 p-4 sm:p-6 bg-gray-50 rounded-xl mb-6">
       
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">{t('profileEdit.title')}</h2>
          <p className="text-gray-500 text-sm sm:text-base mt-1">{t('profileEdit.personalInfo')}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
            {t('profileEdit.username')}
          </label>
          <div className="relative">
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={e => setFormData({ ...formData, username: e.target.value })}
              className="w-full pl-11 pr-4 py-3.5 sm:py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none"
              required
              autoComplete="name"
            />
            <User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
            {t('profileEdit.email')}
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full pl-11 pr-12 py-3.5 sm:py-3 text-base border border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed"
              required
              autoComplete="email"
              inputMode="email"
            />
            <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <span className="text-xs text-gray-500">{t('profileEdit.cannotEdit', 'Cannot edit')}</span>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
            {t('profileEdit.phone')}
          </label>
          <div className="relative">
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="w-full pl-11 pr-12 py-3.5 sm:py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none"
              autoComplete="tel"
              inputMode="tel"
            />
            <Phone className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div>
          <label htmlFor="first_name" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
            {t('profileEdit.firstName', 'First Name')}
          </label>
          <div className="relative">
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={e => setFormData({ ...formData, first_name: e.target.value })}
              className="w-full pl-11 pr-4 py-3.5 sm:py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none"
              required
              autoComplete="given-name"
            />
            <UserCircle className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div>
          <label htmlFor="last_name" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
            {t('profileEdit.lastName', 'Last Name')}
          </label>
          <div className="relative">
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={e => setFormData({ ...formData, last_name: e.target.value })}
              className="w-full pl-11 pr-4 py-3.5 sm:py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none"
              required
              autoComplete="family-name"
            />
            <UserCircle className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div>
          <label htmlFor="age" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
            {t('profileEdit.age', 'Age')}
          </label>
          <div className="relative">
            <input
              type="number"
              id="age"
              name="age"
              min="18"
              max="120"
              value={formData.age}
              onChange={e => setFormData({ ...formData, age: parseInt(e.target.value) || 18 })}
              className="w-full pl-11 pr-4 py-3.5 sm:py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none"
              required
            />
            <Calendar className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
            {t('profileEdit.gender', 'Gender')}
          </label>
          <div className="relative">
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={e => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' | 'other' })}
              className="w-full pl-11 pr-4 py-3.5 sm:py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none appearance-none"
              required
            >
              <option value="male">{t('profileEdit.genderMale', 'Male')}</option>
              <option value="female">{t('profileEdit.genderFemale', 'Female')}</option>
              <option value="other">{t('profileEdit.genderOther', 'Other')}</option>
            </select>
            <UserCheck className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-white py-3.5 sm:py-3 text-base rounded-xl hover:bg-secondary transition-all duration-300 transform hover:scale-[1.02] shadow-sm hover:shadow-md disabled:bg-gray-400 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
      >        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {t('common.pleaseWait')}
          </>
        ) : (
          <>
            <User size={18} />
            {t('common.save')}
          </>
        )}
      </button>
    </form>
    </div>
  );
};

export default ProfileEdit;