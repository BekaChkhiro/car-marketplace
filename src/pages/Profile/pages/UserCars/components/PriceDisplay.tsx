import React from 'react';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../../../i18n';

interface PriceDisplayProps {
  totalPrice: number;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ totalPrice }) => {
  const { t } = useTranslation([namespaces.profile, namespaces.common]);
  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center">
        <span className="text-gray-700">{t('profile:cars.vip.modal.totalPrice')}</span>
        <span className="font-bold text-primary text-lg">{totalPrice} ₾</span>
      </div>
    </div>
  );
};

export default PriceDisplay;
