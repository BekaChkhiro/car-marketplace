import React from 'react';
import { Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../../../i18n';

interface ExpirationDateDisplayProps {
  expirationDate: string;
  daysCount: number;
}

const ExpirationDateDisplay: React.FC<ExpirationDateDisplayProps> = ({ 
  expirationDate,
  daysCount
}) => {
  const { t } = useTranslation([namespaces.profile, namespaces.common]);
  return (
    <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        <Calendar size={18} className="text-primary" />
        <span className="text-gray-700 font-medium">{t('profile:cars.vip.modal.vipTerm')}</span>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-gray-600">{t('profile:cars.vip.modal.expirationDate')}:</span>
        <span className="font-semibold text-gray-800">{expirationDate}</span>
      </div>
      
      <div className="flex justify-between items-center mt-1">
        <span className="text-gray-600">{t('profile:cars.vip.modal.activeDays')}:</span>
        <span className="font-semibold text-primary">{daysCount} {t('common:days')}</span>
      </div>
    </div>
  );
};

export default ExpirationDateDisplay;
