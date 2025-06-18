import React from 'react';
import { Settings, Award } from 'lucide-react';
import VipSettings from '../Settings/VipSettings';

const VipSettingsPage: React.FC = () => {
  return (
    <div className="py-6 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Award className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">VIP სტატუსების ფასების მართვა</h1>
      </div>
      
      <div className="flex flex-col gap-6">
        <VipSettings />
      </div>
    </div>
  );
};

export default VipSettingsPage;
