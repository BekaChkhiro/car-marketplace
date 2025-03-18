import React from 'react';

interface DescriptionProps {
  description_en?: string;
  description_ka?: string;
  description_ru?: string;
  onChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

const Description: React.FC<DescriptionProps> = ({ 
  description_en = '',
  description_ka = '',
  description_ru = '', 
  onChange,
  errors
}) => {
  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold text-gray-dark border-b pb-4">
        აღწერა
      </h2>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="description_ka" className="block text-sm font-medium text-gray-700 mb-2">
            აღწერა (ქართულად) *
          </label>
          <textarea
            id="description_ka"
            rows={6}
            value={description_ka}
            onChange={(e) => onChange('description_ka', e.target.value)}
            className={`w-full px-4 py-2 border-2 rounded-lg text-base ${
              errors?.description_ka
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-100 focus:border-primary focus:ring-primary/20'
            } focus:outline-none focus:ring-2 transition-colors resize-none`}
            placeholder="დაწერეთ დეტალური ინფორმაცია მანქანის შესახებ..."
          />
          {errors?.description_ka && (
            <p className="mt-1 text-sm text-red-600">{errors.description_ka}</p>
          )}
        </div>

        <div>
          <label htmlFor="description_en" className="block text-sm font-medium text-gray-700 mb-2">
            Description (in English)
          </label>
          <textarea
            id="description_en"
            rows={6}
            value={description_en}
            onChange={(e) => onChange('description_en', e.target.value)}
            className={`w-full px-4 py-2 border-2 rounded-lg text-base ${
              errors?.description_en
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-100 focus:border-primary focus:ring-primary/20'
            } focus:outline-none focus:ring-2 transition-colors resize-none`}
            placeholder="Write detailed information about the car..."
          />
          {errors?.description_en && (
            <p className="mt-1 text-sm text-red-600">{errors.description_en}</p>
          )}
        </div>

        <div>
          <label htmlFor="description_ru" className="block text-sm font-medium text-gray-700 mb-2">
            Описание (на русском)
          </label>
          <textarea
            id="description_ru"
            rows={6}
            value={description_ru}
            onChange={(e) => onChange('description_ru', e.target.value)}
            className={`w-full px-4 py-2 border-2 rounded-lg text-base ${
              errors?.description_ru
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-100 focus:border-primary focus:ring-primary/20'
            } focus:outline-none focus:ring-2 transition-colors resize-none`}
            placeholder="Напишите подробную информацию об автомобиле..."
          />
          {errors?.description_ru && (
            <p className="mt-1 text-sm text-red-600">{errors.description_ru}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Description;