import React from 'react';
import { Wallet } from 'lucide-react';

interface BalanceDisplayProps {
  balance: number | null;
  loading: boolean;
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ balance, loading }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Wallet className="w-5 h-5 text-primary mr-2" />
          <span className="text-gray-700">თქვენი ბალანსი:</span>
        </div>
        {loading ? (
          <span className="text-gray-500">იტვირთება...</span>
        ) : (
          <span className="font-bold text-primary text-lg">{balance} ₾</span>
        )}
      </div>
    </div>
  );
};

export default BalanceDisplay;
