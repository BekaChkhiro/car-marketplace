import React from 'react';

interface CylinderSwitcherProps {
  value: number | undefined;
  onChange: (value: number) => void;
  className?: string;
}

// Common cylinder options
const CYLINDER_OPTIONS = [1, 2, 3, 4, 5, 6, 8, 10, 12];

// const CylinderSwitcher: React.FC<CylinderSwitcherProps> = ({ value, onChange, className = '' }) => {
//   return (
//     <div className={`inline-flex items-center p-1 bg-gray-100 rounded-lg ${className}`}>
//       {CYLINDER_OPTIONS.map((cylNumber) => (
//         <button
//           key={cylNumber}
//           type="button"
//           className={`px-1 sm:px-3 py-1 text-sm font-medium rounded-md transition-all ${
//             value === cylNumber
//               ? 'bg-white text-primary shadow-sm'
//               : 'text-gray-600 hover:text-gray-800'
//           }`}
//           onClick={() => onChange(cylNumber)}
//         >
//           {cylNumber}
//         </button>
//       ))}
//     </div>
//   );
// };
const CylinderSwitcher: React.FC<CylinderSwitcherProps> = ({ value, onChange, className = '' }) => {
  return (
    <div className={className}>
      {/* Select dropdown on small devices */}
      <div className="block sm:hidden">
        <select
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full px-4 px-2 rounded-md border border-gray-300 text-sm "
        >
          {CYLINDER_OPTIONS.map((cylNumber) => (
            <option className='cursor-pointer' key={cylNumber} value={cylNumber}>
              {cylNumber}
            </option>
          ))}
        </select>
      </div>

      {/* Button group on sm+ devices */}
      <div className="hidden sm:inline-flex items-center p-1 bg-gray-100 rounded-lg">
        {CYLINDER_OPTIONS.map((cylNumber) => (
          <button
            key={cylNumber}
            type="button"
            className={`px-1 sm:px-3 py-1 text-sm font-medium rounded-md transition-all ${
              value === cylNumber
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => onChange(cylNumber)}
          >
            {cylNumber}
          </button>
        ))}
      </div>
    </div>
  );
};


export default CylinderSwitcher;
