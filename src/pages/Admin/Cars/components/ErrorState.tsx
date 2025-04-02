import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">მანქანები</h1>
        <p className="text-gray-500 mt-1">თქვენი მანქანების მართვა</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-10 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} className="text-red-500" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-3">მონაცემების ჩატვირთვის შეცდომა</h3>
        
        <div className="max-w-lg mx-auto">
          <div className="p-4 bg-red-50 rounded-lg text-left mb-6">
            <p className="text-red-700 font-medium">შეცდომის დეტალები:</p>
            <p className="text-red-600 text-sm mt-1 font-mono break-all">{error}</p>
          </div>
          
          <p className="text-gray-500 mb-8">
            შეიძლება იყოს ქსელის პრობლემა ან სერვერი დროებით მიუწვდომელია. გთხოვთ სცადოთ ხელახლა.
          </p>
          
          <div className="flex justify-center">
            <button 
              onClick={onRetry}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
            >
              <RefreshCw size={18} /> სცადეთ ხელახლა
            </button>
          </div>
        </div>
        
        <div className="mt-8 text-left border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-500 font-medium mb-2">სასარგებლო რჩევები:</p>
          <ul className="text-sm text-gray-500 space-y-1 list-disc list-inside">
            <li>შეამოწმეთ თქვენი ინტერნეტ კავშირი</li>
            <li>განაახლეთ გვერდი რამდენიმე წუთში</li>
            <li>თუ პრობლემა გრძელდება, დაუკავშირდით მხარდაჭერას</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;