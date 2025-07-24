import React, { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';

// Use lazy loading with exports from the index file
const TransactionList = lazy(() => import('./components').then(module => ({ default: module.TransactionList })));
const TransactionAnalytics = lazy(() => import('./components').then(module => ({ default: module.TransactionAnalytics })));

// Loading component for suspense fallback
const Loading = () => {
  const { t } = useTranslation('admin');
  return (
    <div className="flex items-center justify-center p-10">
      <p className="text-gray-500">{t('transactions.loading')}</p>
    </div>
  );
};

const AdminTransactions: React.FC = () => {
  const { t } = useTranslation('admin');
  return (
    <div className="p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">{t('transactions.title')}</h1>
      
      <div className="flex flex-col gap-6">
        {/* Analytics section - takes up full width at the top */}
        <div className="w-full">
          <Suspense fallback={<Loading />}>
            <TransactionAnalytics />
          </Suspense>
        </div>
        
        {/* Transactions list section - takes up full width below analytics */}
        <div className="w-full">
          <Suspense fallback={<Loading />}>
            <TransactionList />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default AdminTransactions;