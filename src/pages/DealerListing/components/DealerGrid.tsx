import React from 'react';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../i18n';
import { Dealer } from '../../../api/types/dealer.types';
import DealerCard from './DealerCard';

interface DealerGridProps {
  dealers: Dealer[];
  loading: boolean;
}

const DealerGrid: React.FC<DealerGridProps> = ({ dealers, loading }) => {
  const { t } = useTranslation(namespaces.dealerListing);
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gray-300 rounded-xl flex-shrink-0"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4 mb-3"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                </div>
                <div className="flex gap-3 mt-4">
                  <div className="flex-1 h-8 bg-gray-300 rounded-lg"></div>
                  <div className="flex-1 h-8 bg-gray-300 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (dealers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🏪</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('empty.title')}</h3>
        <p className="text-gray-600 text-center max-w-md">
          {t('empty.message')}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.isArray(dealers) ? dealers.map((dealer) => (
        <DealerCard key={dealer.id} dealer={dealer} />
      )) : (
        <div className="col-span-2 text-center py-8 text-gray-500">
          {t('error.noData')}
        </div>
      )}
    </div>
  );
};

export default DealerGrid;