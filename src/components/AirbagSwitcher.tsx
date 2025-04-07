import React from 'react';

interface AirbagSwitcherProps {
  value: number | undefined;
  onChange: (value: number) => void;
  className?: string;
}

// Airbag count options
const AIRBAG_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const AirbagSwitcher: React.FC<AirbagSwitcherProps> = ({ value, onChange, className = '' }) => {
  return (
    <div className={`overflow-x-auto pb-2 ${className}`}>
      <div className="inline-flex items-center p-1 bg-gray-100 rounded-lg whitespace-nowrap min-w-full">
        {AIRBAG_OPTIONS.map((airbagCount) => (
          <button
            key={airbagCount}
            type="button"
            className={`px-3 py-1 text-sm font-medium rounded-md transition-all mx-0.5 ${
              value === airbagCount
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => onChange(airbagCount)}
          >
            {airbagCount}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AirbagSwitcher;
