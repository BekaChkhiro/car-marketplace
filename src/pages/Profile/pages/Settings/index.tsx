import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';
import ProfileEdit from './components/ProfileEdit';
import PasswordChange from '../../components/PasswordChange';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  const tabs = [
    { id: 'profile', label: 'პროფილის რედაქტირება', icon: User },
    { id: 'password', label: 'პაროლის შეცვლა', icon: Lock }
  ];

  return (
    <div className="p-6">
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'profile' | 'password')}
              className={`flex items-center gap-2 px-4 py-2 -mb-px text-sm font-medium transition-all duration-200
                ${activeTab === tab.id 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-500 hover:text-gray-700'}`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'profile' ? <ProfileEdit /> : <PasswordChange />}
    </div>
  );
};

export default Settings;