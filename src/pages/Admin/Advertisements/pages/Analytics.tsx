import React from 'react';
import AdvertisementAnalyticsTable from '../components/AdvertisementAnalytics';

const AdvertisementAnalyticsPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">რეკლამების ანალიტიკა</h1>
        <p className="text-gray-500 mt-1">
          რეკლამების ნახვებისა და დაკლიკების სტატისტიკა
        </p>
      </div>
      
      <AdvertisementAnalyticsTable />
    </div>
  );
};

export default AdvertisementAnalyticsPage;
