import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../i18n';
import { DealerFilters } from '../../../api/types/dealer.types';

interface DealerSortingHeaderProps {
  totalDealers: number;
  filters: DealerFilters;
  onFiltersChange: (filters: DealerFilters) => void;
}

const DealerSortingHeader: React.FC<DealerSortingHeaderProps> = ({
  totalDealers,
  filters,
  onFiltersChange,
}) => {
  const { t } = useTranslation(namespaces.dealerListing);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({
      ...filters,
      search: searchTerm || undefined,
      page: 1,
    });
  };

  const handleSortChange = (sortBy: string, sortOrder: 'ASC' | 'DESC') => {
    onFiltersChange({
      ...filters,
      sortBy,
      sortOrder,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {t('totalDealers')} ({totalDealers})
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 lg:flex-none">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('search.placeholder')}
                className="w-full lg:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-sm"
              />
            </div>
          </form>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{t('sorting.label')}</span>
            <select
              value={`${filters.sortBy || 'created_at'}_${filters.sortOrder || 'DESC'}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('_');
                handleSortChange(sortBy, sortOrder as 'ASC' | 'DESC');
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-sm"
            >
              <option value="created_at_DESC">{t('sorting.options.newestFirst')}</option>
              <option value="created_at_ASC">{t('sorting.options.oldestFirst')}</option>
              <option value="company_name_ASC">{t('sorting.options.nameAsc')}</option>
              <option value="company_name_DESC">{t('sorting.options.nameDesc')}</option>
              <option value="established_year_DESC">{t('sorting.options.yearDesc')}</option>
              <option value="established_year_ASC">{t('sorting.options.yearAsc')}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerSortingHeader;