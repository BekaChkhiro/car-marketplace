import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { User, Mail, Shield, Calendar, Hash, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../i18n';
import { useParams } from 'react-router-dom';

interface User {
  id: number;
  username: string;
  email: string;
  role?: string;
  phone: string;
  first_name: string;
  last_name: string;
  age: number;
  gender: 'male' | 'female';
  created_at?: string;
}

interface ProfileInfoProps {
  user: User | null;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ user }) => {
  const { updateProfile, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { t } = useTranslation([namespaces.profile, namespaces.common]);
  const { lang } = useParams<{ lang: string }>();
  
  // Get current language from URL params or use default
  const currentLang = lang || 'ka';

  if (!user) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await updateProfile({
        username: formData.username,
        email: formData.email
      });
      setSuccess(t('profile:settings.profileUpdated'));
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || t('profile:settings.updateFailed', 'პროფილის განახლება ვერ მოხერხდა'));
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return t('profile:common.notAvailable', 'არ არის ხელმისაწვდომი');
    
    const localeMap: Record<string, string> = {
      'en': 'en-US',
      'ka': 'ka-GE',
      'ru': 'ru-RU'
    };
    
    return new Date(dateString).toLocaleDateString(localeMap[currentLang] || 'ka-GE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
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

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-xl">
            <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white text-3xl shadow-lg">
              <User size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{formData.username}</h2>
              <p className="text-gray-500 mt-1">{formData.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                {t('profile:profileInfo.username')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none"
                  required
                />
                <User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('profile:profileInfo.email')}
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none"
                  required
                />
                <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:space-x-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.02]"
            >
              გაუქმება
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-primary text-white py-3 rounded-xl hover:bg-secondary transition-all duration-300 transform hover:scale-[1.02] disabled:bg-gray-400 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                'შენახვა'
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-8">
          <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-xl">
            <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white text-3xl shadow-lg transform hover:scale-105 transition-all duration-300">
              <User size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user.first_name} {user.last_name}</h2>
              <p className="text-gray-500 mt-1">{user.email}</p>
              {user.role && (
                <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  <Shield size={14} />
                  <span className="capitalize">{user.role}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-6 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 text-gray-500 mb-3">
                <Hash size={18} />
                <h3 className="font-medium">ID</h3>
              </div>
              <p className="text-lg text-gray-900">{user.id}</p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 text-gray-500 mb-3">
                <User size={18} />
                <h3 className="font-medium">{t('profile:profileInfo.username')}</h3>
              </div>
              <p className="text-lg text-gray-900">{user.username}</p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 text-gray-500 mb-3">
                <Calendar size={18} />
                <h3 className="font-medium">{t('profile:profileInfo.age', 'ასაკი')}</h3>
              </div>
              <p className="text-lg text-gray-900">{user.age} {currentLang === 'ka' ? 'წლის' : currentLang === 'ru' ? 'лет' : 'years'}</p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 text-gray-500 mb-3">
                <Mail size={18} />
                <h3 className="font-medium">{t('profile:profileInfo.email')}</h3>
              </div>
              <p className="text-lg text-gray-900">{user.email}</p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 text-gray-500 mb-3">
                <Phone size={18} />
                <h3 className="font-medium">{t('profile:profileInfo.phone')}</h3>
              </div>
              <p className="text-lg text-gray-900">{user.phone}</p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 text-gray-500 mb-3">
                <User size={18} />
                <h3 className="font-medium">{t('profile:profileInfo.gender', 'სქესი')}</h3>
              </div>
              <p className="text-lg text-gray-900">
                {user.gender === 'female' ? t('profile:profileInfo.female', 'მდედრობითი') : t('profile:profileInfo.male', 'მამრობითი')}
              </p>
            </div>

            {user.created_at && (
              <div className="p-6 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 text-gray-500 mb-3">
                  <Calendar size={18} />
                  <h3 className="font-medium">{t('profile:profileInfo.joinedDate')}</h3>
                </div>
                <p className="text-lg text-gray-900">{formatDate(user.created_at)}</p>
              </div>
            )}
          </div>
          
          <div>
            <a
              href={`/${currentLang}/profile/settings`}
              className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-secondary transition-all duration-300 transform hover:scale-[1.02] shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <User size={18} />
              {t('profile:common.edit')}
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;