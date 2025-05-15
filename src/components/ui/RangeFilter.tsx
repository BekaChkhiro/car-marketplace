import React from 'react';

interface RangeFilterProps {
  name: string;
  fromValue: string;
  toValue: string;
  placeholder: {
    from: string;
    to: string;
  };
  onChange: (name: string, value: { from: string; to: string }) => void;
  className?: string;
}

const RangeFilter: React.FC<RangeFilterProps> = ({
  name,
  fromValue,
  toValue,
  placeholder,
  onChange,
  className = '',
}) => {
  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(name, { from: e.target.value, to: toValue });
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(name, { from: fromValue, to: e.target.value });
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input
        type="text"
        value={fromValue}
        onChange={handleFromChange}
        placeholder={placeholder.from}
        className="w-full border border-gray-300 rounded-md p-2 text-sm"
      />
      <span className="text-gray-500">-</span>
      <input
        type="text"
        value={toValue}
        onChange={handleToChange}
        placeholder={placeholder.to}
        className="w-full border border-gray-300 rounded-md p-2 text-sm"
      />
    </div>
  );
};

export default RangeFilter;
