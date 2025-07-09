import React from 'react';
import { Package } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm border border-gray-100 text-center">
      <div className="mb-4 p-4 bg-blue-50 rounded-full">
        <Package size={48} className="text-blue-500" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">ნაწილები ვერ მოიძებნა</h3>
      <p className="text-gray-500 mb-6 max-w-md">
        ჯერჯერობით არ არის დამატებული ნაწილები. დაამატეთ ახალი ნაწილი, რომ გამოჩნდეს ამ სიაში.
      </p>
      <button 
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
        onClick={() => window.location.href = '/admin/parts/new'}
      >
        ნაწილის დამატება
      </button>
    </div>
  );
};

export default EmptyState;
