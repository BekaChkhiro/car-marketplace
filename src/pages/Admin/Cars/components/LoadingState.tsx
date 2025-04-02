import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mt-2"></div>
        </div>
        <div className="flex gap-4">
          <div className="h-10 w-48 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-left">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                </th>
                <th className="px-6 py-4 text-left">
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                </th>
                <th className="px-6 py-4 text-left">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                </th>
                <th className="px-6 py-4 text-right">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse ml-auto"></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-14 w-14 bg-gray-200 rounded-lg animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="flex gap-2">
                          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Skeleton */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 bg-gray-50">
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-9 w-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-9 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;