
import React from 'react';
import { Award } from 'lucide-react';
import VipSettings from './VipSettings';

const SettingsPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">პარამეტრები</h1>

      <div className="w-full sm:w-2/3 mx-auto mb-8">
        {/* VIP განცხადებები */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Award size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">VIP განცხადებების ფასების მართვა</h2>
              <p className="text-sm text-gray-600">მართეთ VIP სტატუსების ფასები და ხანგრძლივობა</p>
            </div>
          </div>
          
          <VipSettings />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;