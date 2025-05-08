import React from 'react';
import { Calendar } from 'lucide-react';

interface ExpirationDateDisplayProps {
  expirationDate: string;
  daysCount: number;
}

const ExpirationDateDisplay: React.FC<ExpirationDateDisplayProps> = ({ 
  expirationDate,
  daysCount
}) => {
  return (
    <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        <Calendar size={18} className="text-primary" />
        <span className="text-gray-700 font-medium">VIP სტატუსის ვადა</span>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-gray-600">ვადის გასვლის თარიღი:</span>
        <span className="font-semibold text-gray-800">{expirationDate}</span>
      </div>
      
      <div className="flex justify-between items-center mt-1">
        <span className="text-gray-600">აქტიური დღეები:</span>
        <span className="font-semibold text-primary">{daysCount} დღე</span>
      </div>
    </div>
  );
};

export default ExpirationDateDisplay;
