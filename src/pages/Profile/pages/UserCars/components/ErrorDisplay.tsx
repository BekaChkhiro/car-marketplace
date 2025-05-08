import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  error: string | null;
  insufficientBalance: boolean;
  onAddFunds: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  error, 
  insufficientBalance, 
  onAddFunds 
}) => {
  if (!error) return null;
  
  return (
    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm flex items-start">
      <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
      <div>
        <p>{error}</p>
        {insufficientBalance && (
          <button 
            type="button"
            onClick={onAddFunds}
            className="mt-2 text-primary hover:underline text-sm font-medium"
          >
            ბალანსის შევსება
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
