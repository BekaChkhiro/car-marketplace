import React from 'react';

interface DescriptionProps {
  description?: string;
  onChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

const Description: React.FC<DescriptionProps> = ({ description = '', onChange, errors }) => {
  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold text-gray-dark border-b pb-4">
        აღწერა
      </h2>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          დეტალური აღწერა *
        </label>
        <textarea
          id="description"
          rows={6}
          value={description}
          onChange={(e) => onChange('description', e.target.value)}
          className={`w-full px-4 py-2 border-2 rounded-lg text-base ${
            errors?.description
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-100 focus:border-primary focus:ring-primary/20'
          } focus:outline-none focus:ring-2 transition-colors resize-none`}
          placeholder="დაწერეთ დეტალური ინფორმაცია მანქანის შესახებ..."
        />
        {errors?.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>
    </div>
  );
};

export default Description;