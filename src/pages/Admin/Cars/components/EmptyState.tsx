import React from 'react';
import { Car as CarIcon, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const EmptyState: React.FC = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-10 text-center">
      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <CarIcon size={32} className="text-blue-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('cars.noCarsFound')}</h3>
    </div>
  );
};

export default EmptyState;