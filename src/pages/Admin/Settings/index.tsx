import React from 'react';
import { Settings as SettingsIcon, DollarSign, Bell, Shield, Mail } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">პარამეტრები</h1>

      <div className="grid grid-cols-1 gap-6">
        {/* VIP განცხადებები */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <DollarSign size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">VIP განცხადებების ფასი</h3>
              <p className="text-sm text-gray-600">განსაზღვრეთ VIP განცხადებების ფასი</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ფასი დღეში (₾)
              </label>
              <input
                type="number"
                min="0"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                defaultValue={5}
              />
            </div>
            <button className="w-full px-4 py-2 bg-primary text-white rounded-xl hover:bg-secondary transition-colors">
              შენახვა
            </button>
          </div>
        </div>

        {/* შეტყობინებების პარამეტრები */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Bell size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">შეტყობინებები</h3>
              <p className="text-sm text-gray-600">შეტყობინებების პარამეტრების მართვა</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">ელ-ფოსტის შეტყობინებები</p>
                <p className="text-sm text-gray-600">ელ-ფოსტის შეტყობინებების გაგზავნა ახალ განცხადებებზე</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer 
                  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] 
                  after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 
                  after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
                  peer-checked:bg-primary">
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* უსაფრთხოების პარამეტრები */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">უსაფრთხოება</h3>
              <p className="text-sm text-gray-600">სისტემის უსაფრთხოების პარამეტრები</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">ორფაქტორიანი აუტენტიფიკაცია</p>
                <p className="text-sm text-gray-600">ორფაქტორიანი აუტენტიფიკაციის ჩართვა ადმინებისთვის</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer 
                  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] 
                  after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 
                  after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
                  peer-checked:bg-primary">
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* SMTP პარამეტრები */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Mail size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">SMTP პარამეტრები</h3>
              <p className="text-sm text-gray-600">ელ-ფოსტის გაგზავნის პარამეტრები</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SMTP სერვერი
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="smtp.example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                პორტი
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="587"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                მომხმარებელი
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="username@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                პაროლი
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button className="w-full px-4 py-2 bg-primary text-white rounded-xl hover:bg-secondary transition-colors">
              შენახვა
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;