import React, { lazy, Suspense } from 'react';
import { Award } from 'lucide-react';

// Use lazy loading with exports from the components index file
const VipListingsList = lazy(() => import('./components').then(module => ({ default: module.VipListingsList })));
const VipListingsAnalytics = lazy(() => import('./components').then(module => ({ default: module.VipListingsAnalytics })));

// Loading component for suspense fallback
const Loading = () => (
  <div className="p-6 rounded-lg bg-white shadow border border-gray-100 flex items-center justify-center">
    <div className="flex flex-col items-center py-8">
      <div className="flex space-x-2 justify-center items-center mb-4">
        <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
      <p className="text-gray-500">იტვირთება...</p>
    </div>
  </div>
);

const VipListingsPage: React.FC = () => {
  return (
    <div className="py-6 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Award className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">VIP განცხადებების მართვა</h1>
      </div>
      
      <div className="flex flex-col gap-6">
        {/* Analytics section - takes up full width at the top */}
        <Suspense fallback={<Loading />}>
          <VipListingsAnalytics />
        </Suspense>
        
        {/* VIP Listings list section - takes up full width below analytics */}
        <Suspense fallback={<Loading />}>
          <VipListingsList />
        </Suspense>
      </div>
    </div>
  );
};

export default VipListingsPage;
