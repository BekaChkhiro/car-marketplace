import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  const { t } = useTranslation('admin');
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{t('cars.title')}</h1>
        <p className="text-gray-500 mt-1">{t('cars.management')}</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-10 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} className="text-red-500" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-3">{t('cars.loadError')}</h3>
        
        <div className="max-w-lg mx-auto">
          <div className="p-4 bg-red-50 rounded-lg text-left mb-6">
            <p className="text-red-700 font-medium">{t('common.errorDetails')}:</p>
            <p className="text-red-600 text-sm mt-1 font-mono break-all">{error}</p>
          </div>
          
          <p className="text-gray-500 mb-8">
            {t('common.networkError')}
          </p>
          
          <div className="flex justify-center">
            <button 
              onClick={onRetry}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
            >
              <RefreshCw size={18} /> {t('common.retry')}
            </button>
          </div>
        </div>
        
        <div className="mt-8 text-left border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-500 font-medium mb-2">{t('common.troubleshooting')}:</p>
          <ul className="text-sm text-gray-500 space-y-1 list-disc list-inside">
            <li>{t('common.checkConnection')}</li>
            <li>{t('common.refreshPage')}</li>
            <li>{t('common.contactSupport')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;