import React from 'react';
import { Container } from '../../../../components/ui';
import { Car as CarIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../../i18n';

const LoadingState: React.FC = () => {
  const { t } = useTranslation([namespaces.carDetails, namespaces.common]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <Container>
        <div className="flex flex-col justify-center items-center min-h-[70vh] py-20">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-green-200 border-t-primary rounded-full animate-spin"></div>
            <CarIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary w-6 h-6" />
          </div>
          <p className="mt-6 text-gray-700 font-medium text-lg">{t('common:loading')}</p>
          <div className="mt-4 w-64 h-2 bg-green-100 rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="w-24 h-24 bg-green-50 rounded-lg animate-pulse"></div>
            <div className="w-24 h-24 bg-green-50 rounded-lg animate-pulse delay-75"></div>
            <div className="w-24 h-24 bg-green-50 rounded-lg animate-pulse delay-150"></div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default LoadingState;
