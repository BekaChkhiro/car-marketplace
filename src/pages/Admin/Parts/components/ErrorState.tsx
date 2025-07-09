import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">ნაწილები</h1>
        <p className="text-gray-500 mt-1">მანქანის ნაწილების მართვა</p>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 p-8 text-center">
        <div className="flex flex-col items-center">
          <div className="mb-4 p-4 bg-red-50 rounded-full">
            <AlertCircle size={48} className="text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">შეცდომა მონაცემების ჩატვირთვისას</h3>
          <p className="text-gray-500 mb-6 max-w-md">
            {error || 'მოხდა შეცდომა ნაწილების მონაცემების ჩატვირთვისას. გთხოვთ, სცადოთ თავიდან.'}
          </p>
          <button 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
            onClick={onRetry}
          >
            <RefreshCw size={16} /> თავიდან სცადეთ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
