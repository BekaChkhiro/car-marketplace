import React from 'react';
import { Car as CarIcon, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmptyState: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-10 text-center">
      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <CarIcon size={32} className="text-blue-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">მანქანები ვერ მოიძებნა</h3>
      <p className="text-gray-500 max-w-md mx-auto mb-8">
        ცარიელი სიის მიზეზი შეიძლება იყოს ძიების პარამეტრები ან თქვენს ანგარიშზე ჯერ არ გაქვთ დამატებული მანქანები.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          onClick={() => navigate('/profile/cars/add')} 
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
        >
          <CarIcon size={18} /> დაამატეთ მანქანა
        </button>
        <button 
          onClick={() => window.location.href = window.location.pathname} 
          className="px-5 py-2.5 border border-gray-200 bg-white text-gray-700 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <AlertCircle size={18} /> გაასუფთავეთ ფილტრი
        </button>
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg max-w-lg mx-auto">
        <p className="text-sm text-blue-700">
          <strong>რჩევა:</strong> თუ ეძებთ კონკრეტულ მოდელს, სცადეთ ნაწილობრივი ძიება. მაგალითად, "BMW" ან "Mer" ყველა BMW-ს ან Mercedes-ს მოძებნის.
        </p>
      </div>
    </div>
  );
};

export default EmptyState;