import React from 'react';
import { Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../../../i18n';

interface BalanceDisplayProps {
  balance: number | null;
  loading: boolean;
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ balance, loading }) => {
  const { t } = useTranslation([namespaces.profile, namespaces.common]);
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Wallet className="w-5 h-5 text-primary mr-2" />
          <span className="text-gray-700">{t('profile:cars.vip.modal.yourBalance')}</span>
        </div>
        {loading ? (
          <span className="text-gray-500">{t('common:loading')}</span>
        ) : (
          <span className="font-bold text-primary text-lg">{balance} ₾</span>
        )}
      </div>
    </div>
  );
};

export default BalanceDisplay;
