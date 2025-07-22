import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Save, X } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import authService from '../../../api/services/authService';
import { useToast } from '../../../context/ToastContext';

const SettingsPage = () => {
  const { t } = useTranslation('admin');
  const { user, refreshUserData } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    age: '',
    gender: 'male' as 'male' | 'female' | 'other'
  });

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) {
        setIsRefreshing(true);
        try {
          await refreshUserData();
        } catch (error) {
          console.error('Failed to refresh user data:', error);
        } finally {
          setIsRefreshing(false);
        }
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        age: user.age?.toString() || '',
        gender: user.gender || 'male'
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updateData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : undefined
      };

      await authService.updateProfile(updateData);
      await refreshUserData(); // Refresh user data after successful update
      showToast(t('settings.profile.updateSuccess'), 'success');
    } catch (error: any) {
      showToast(error.message || t('settings.profile.updateError'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        age: user.age?.toString() || '',
        gender: user.gender || 'male'
      });
    }
  };

  if (isRefreshing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#009c6d] mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#009c6d] mb-2">
            {t('settings.title')}
          </h1>
          <p className="text-gray-600">{t('settings.manageAccount')}</p>
        </div>

        <div className="w-full sm:w-2/3 mx-auto mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-[#009c6d] flex items-center justify-center shadow-lg">
                <User size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#009c6d]">
                  {t('settings.profile.title')}
                </h2>
                <p className="text-gray-600 mt-1">{t('settings.profile.subtitle')}</p>
              </div>
            </div>
          
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {t('settings.profile.username')}
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009c6d] focus:border-transparent transition-all duration-200 group-hover:border-[#009c6d]"
                    required
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {t('settings.profile.email')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009c6d] focus:border-transparent transition-all duration-200 group-hover:border-[#009c6d]"
                    required
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {t('settings.profile.firstName')}
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009c6d] focus:border-transparent transition-all duration-200 group-hover:border-[#009c6d]"
                    required
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {t('settings.profile.lastName')}
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009c6d] focus:border-transparent transition-all duration-200 group-hover:border-[#009c6d]"
                    required
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {t('settings.profile.phone')}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009c6d] focus:border-transparent transition-all duration-200 group-hover:border-[#009c6d]"
                    required
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {t('settings.profile.age')}
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    min="18"
                    max="120"
                    className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009c6d] focus:border-transparent transition-all duration-200 group-hover:border-[#009c6d]"
                  />
                </div>

                <div className="md:col-span-2 group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {t('settings.profile.gender')}
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/70 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009c6d] focus:border-transparent transition-all duration-200 group-hover:border-[#009c6d]"
                  >
                    <option value="male">{t('settings.profile.male')}</option>
                    <option value="female">{t('settings.profile.female')}</option>
                    <option value="other">{t('settings.profile.other')}</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-6 pt-8">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-3 px-8 py-4 bg-[#009c6d] text-white rounded-2xl hover:bg-[#007a56] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] font-semibold"
                >
                  <Save size={20} />
                  {isLoading ? t('settings.profile.saving') : t('settings.save')}
                </button>
                
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-2xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] font-semibold"
                >
                  <X size={20} />
                  {t('settings.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;