import React from 'react';
import { Settings } from 'lucide-react';

interface TransmissionSwitcherProps {
  value: 'manual' | 'automatic' | undefined;
  onChange: (value: 'manual' | 'automatic') => void;
  className?: string;
}

const TransmissionSwitcher: React.FC<TransmissionSwitcherProps> = ({ value, onChange, className = '' }) => {
  return (
    <div className={`flex items-center justify-between gap-2 ${className}`}>
      <button
        type="button"
        className={`flex-1 py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
          value === 'manual'
            ? 'bg-primary text-white shadow-sm font-medium'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        onClick={() => onChange('manual')}
      >
        <Settings size={16} className={value === 'manual' ? 'text-white' : 'text-gray-500'} />
        <span>მექანიკური</span>
      </button>
      <button
        type="button"
        className={`flex-1 py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
          value === 'automatic'
            ? 'bg-primary text-white shadow-sm font-medium'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        onClick={() => onChange('automatic')}
      >
        <Settings size={16} className={value === 'automatic' ? 'text-white' : 'text-gray-500'} />
        <span>ავტომატური</span>
      </button>
    </div>
  );
};

export default TransmissionSwitcher;
