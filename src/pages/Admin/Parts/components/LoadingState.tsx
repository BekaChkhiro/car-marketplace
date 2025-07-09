import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="h-8 bg-gray-200 rounded-md w-48 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded-md w-64 mt-2 animate-pulse"></div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="p-4">
          <div className="animate-pulse">
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="flex py-5 space-x-4 border-b border-gray-100 last:border-0">
                <div className="h-20 w-20 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="flex space-x-2 items-start">
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="flex space-x-2">
              <div className="h-8 w-20 bg-gray-200 rounded"></div>
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
              <div className="h-8 w-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
