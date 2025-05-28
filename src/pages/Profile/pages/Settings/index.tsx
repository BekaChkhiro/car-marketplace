import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';
import ProfileEdit from './components/ProfileEdit';
import PasswordChange from '../../components/PasswordChange';
import { useTranslation } from 'react-i18next';

const Settings: React.FC = () => {
  const { t } = useTranslation(['profile']);
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  const tabs = [
    { id: 'profile', label: t('settings.editProfile'), icon: User },
    { id: 'password', label: t('settings.changePassword'), icon: Lock }
  ];
  return (
    <div className="p-4 sm:p-6"><div className="mb-6 border-b border-gray-200">
        <div className="flex w-full justify-around sm:justify-start sm:gap-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'profile' | 'password')}
              className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 sm:px-4 py-3 sm:py-2 -mb-px text-xs sm:text-sm font-medium transition-all duration-200 flex-1 sm:flex-initial
                ${activeTab === tab.id 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'}`}
            >
              <tab.icon size={activeTab === tab.id ? 22 : 18} className="mb-1 sm:mb-0" />
              <span className="text-center sm:text-left whitespace-nowrap">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'profile' ? <ProfileEdit /> : <PasswordChange />}
    </div>
  );
};

export default Settings;