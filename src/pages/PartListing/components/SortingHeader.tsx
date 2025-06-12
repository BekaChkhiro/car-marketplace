import React from 'react';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../i18n';

interface SortingHeaderProps {
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  totalCount: number;
  loading: boolean;
}

const SortingHeader: React.FC<SortingHeaderProps> = ({ 
  sortBy, 
  onSortChange, 
  totalCount,
  loading 
}) => {
  const { t } = useTranslation(namespaces.parts);
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 bg-gray-50 p-3 rounded-md">
      <div className="mb-2 md:mb-0">
        <span className="text-gray-600">
          {loading ? t('loading') : `${totalCount} ${totalCount === 1 ? t('partFound') : t('partsFound')}`}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600 hidden md:inline">{t('sortBy')}:</span>
        <div className="flex">
          <button
            onClick={() => onSortChange('newest')}
            className={`px-3 py-1 text-sm rounded-l-md ${
              sortBy === 'newest'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            } border border-gray-300`}
          >
            {t('newest')}
          </button>
          <button
            onClick={() => onSortChange('price_asc')}
            className={`px-3 py-1 text-sm ${
              sortBy === 'price_asc'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            } border-t border-b border-gray-300`}
          >
            {t('priceLowToHigh')}
          </button>
          <button
            onClick={() => onSortChange('price_desc')}
            className={`px-3 py-1 text-sm rounded-r-md ${
              sortBy === 'price_desc'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            } border border-gray-300`}
          >
            {t('priceHighToLow')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SortingHeader;
