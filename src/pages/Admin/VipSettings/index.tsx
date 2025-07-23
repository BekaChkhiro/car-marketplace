import React from 'react';
import { Settings, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import VipSettings from '../Settings/VipSettings';

const VipSettingsPage: React.FC = () => {
  const { t } = useTranslation('admin');
  
  return (
    <div className="py-6 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Award className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{t('navigation.vipPricing')}</h1>
      </div>
      
      <div className="flex flex-col gap-6">
        <VipSettings />
      </div>
    </div>
  );
};

export default VipSettingsPage;
