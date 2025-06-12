import React, { useState } from 'react';

interface MultiLanguageDescriptionProps {
  descriptions: {
    description: string;
    description_en: string;
    description_ka: string;
  };
  onChange: (field: string, value: string) => void;
  errors: {[key: string]: string};
}

const MultiLanguageDescription: React.FC<MultiLanguageDescriptionProps> = ({
  descriptions,
  onChange,
  errors
}) => {
  const [activeTab, setActiveTab] = useState<'default' | 'english' | 'georgian'>('default');

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Description
      </label>
      
      {/* Language Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab('default')}
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === 'default'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Default
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('english')}
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === 'english'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          English
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('georgian')}
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === 'georgian'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Georgian
        </button>
      </div>
      
      {/* Description Textareas */}
      <div className="mt-2">
        {/* Default Language */}
        {activeTab === 'default' && (
          <div>
            <textarea
              rows={5}
              value={descriptions.description}
              onChange={(e) => onChange('description', e.target.value)}
              placeholder="Enter description in the default language"
              className={`w-full p-2 border rounded-md ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              This is the primary description that will be shown when no specific language is selected.
            </p>
          </div>
        )}
        
        {/* English Language */}
        {activeTab === 'english' && (
          <div>
            <textarea
              rows={5}
              value={descriptions.description_en}
              onChange={(e) => onChange('description_en', e.target.value)}
              placeholder="Enter description in English"
              className={`w-full p-2 border rounded-md ${
                errors.description_en ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.description_en && (
              <p className="mt-1 text-sm text-red-500">{errors.description_en}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              This description will be shown when English language is selected.
            </p>
          </div>
        )}
        
        {/* Georgian Language */}
        {activeTab === 'georgian' && (
          <div>
            <textarea
              rows={5}
              value={descriptions.description_ka}
              onChange={(e) => onChange('description_ka', e.target.value)}
              placeholder="Enter description in Georgian"
              className={`w-full p-2 border rounded-md ${
                errors.description_ka ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.description_ka && (
              <p className="mt-1 text-sm text-red-500">{errors.description_ka}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              This description will be shown when Georgian language is selected.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiLanguageDescription;
