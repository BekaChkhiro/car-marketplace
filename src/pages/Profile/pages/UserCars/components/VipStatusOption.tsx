import React from 'react';
import { Crown } from 'lucide-react';
import { VipStatus } from '../../../../../api/services/vipService';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../../../i18n';

interface VipStatusOptionProps {
  status: VipStatus;
  selectedStatus: VipStatus;
  price: number;
  label: string;
  description: string;
  onClick: (status: VipStatus) => void;
}

const VipStatusOption: React.FC<VipStatusOptionProps> = ({
  status,
  selectedStatus,
  price,
  label,
  description,
  onClick
}) => {
  const { t } = useTranslation([namespaces.common]);
  // სტატუსის ფერის მიღება
  const getStatusColor = () => {
    switch (status) {
      case 'vip':
        return { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-600' };
      case 'vip_plus':
        return { bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-600' };
      case 'super_vip':
        return { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-600' };
      default:
        return { bg: 'bg-gray-50', border: 'border-gray-300', text: 'text-gray-600' };
    }
  };

  const colors = getStatusColor();

  return (
    <div 
      className={`p-4 rounded-lg cursor-pointer transition-all flex flex-col items-center ${
        selectedStatus === status 
          ? `${colors.bg} border-2 ${colors.border} shadow-sm` 
          : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
      }`}
      onClick={() => onClick(status)}
    >
      <Crown 
        className={`w-6 h-6 ${colors.text} mb-2`} 
        fill={selectedStatus === status ? 'currentColor' : 'none'} 
      />
      <span className={`font-medium ${colors.text}`}>{label}</span>
      <span className="text-xs text-gray-500 mt-1">{description}</span>
      <span className={`text-sm font-medium ${colors.text} mt-2`}>{price} ₾/{t('common:perDay')}</span>
    </div>
  );
};

export default VipStatusOption;
