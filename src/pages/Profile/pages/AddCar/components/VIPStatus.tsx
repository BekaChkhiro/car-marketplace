import React from 'react';
import { Star } from 'lucide-react';

interface VIPStatusProps {
  vipStatus: 'none' | 'vip' | 'vip_plus' | 'super_vip';
  onChange: (field: string, value: any) => void;
}

const VIPStatus: React.FC<VIPStatusProps> = ({ vipStatus, onChange }) => {
  const handleStatusChange = (status: 'none' | 'vip' | 'vip_plus' | 'super_vip') => {
    onChange('vip_status', status);
  };

  return (
    <div className="bg-white rounded-xl p-6 border">
      <div className="flex items-center mb-4">
        <Star className="text-yellow-500 mr-2" size={20} />
        <h3 className="text-lg font-medium">VIP სტატუსი</h3>
      </div>
      
      <p className="text-sm text-gray-500 mb-4">
        აირჩიეთ VIP სტატუსი თქვენი განცხადებისთვის. VIP სტატუსი გაზრდის თქვენი განცხადების ხილვადობას.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div 
          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
            vipStatus === 'none' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'
          }`}
          onClick={() => handleStatusChange('none')}
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">სტანდარტული</h4>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">უფასო</span>
          </div>
          <p className="text-xs text-gray-500">სტანდარტული განთავსება</p>
        </div>
        
        <div 
          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
            vipStatus === 'vip' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'
          }`}
          onClick={() => handleStatusChange('vip')}
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">VIP</h4>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">10₾</span>
          </div>
          <p className="text-xs text-gray-500">გაზრდილი ხილვადობა</p>
        </div>
        
        <div 
          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
            vipStatus === 'vip_plus' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'
          }`}
          onClick={() => handleStatusChange('vip_plus')}
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">VIP+</h4>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">20₾</span>
          </div>
          <p className="text-xs text-gray-500">მაღალი ხილვადობა და გამორჩეული ბეჯი</p>
        </div>
        
        <div 
          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
            vipStatus === 'super_vip' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'
          }`}
          onClick={() => handleStatusChange('super_vip')}
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">SUPER VIP</h4>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">30₾</span>
          </div>
          <p className="text-xs text-gray-500">მაქსიმალური ხილვადობა და პრემიუმ ბეჯი</p>
        </div>
      </div>
    </div>
  );
};

export default VIPStatus;
