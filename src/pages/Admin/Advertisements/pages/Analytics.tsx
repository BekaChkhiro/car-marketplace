import React from 'react';
import { useTranslation } from 'react-i18next';
import AdvertisementAnalyticsTable from '../components/AdvertisementAnalytics';

const AdvertisementAnalyticsPage: React.FC = () => {
  const { t } = useTranslation('admin');

  return (
    <div className="p-1 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t('advertisements.analytics.title')}</h1>
        <p className="text-gray-500 mt-1">
          {t('advertisements.analytics.description')}
        </p>
      </div>
      
      <AdvertisementAnalyticsTable />
    </div>
  );
};

export default AdvertisementAnalyticsPage;