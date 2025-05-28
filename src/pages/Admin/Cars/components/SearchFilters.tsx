import React from 'react';
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../../i18n';

interface SearchFiltersProps {
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  isExpanded = false,
  onToggleExpand = () => {}
}) => {
  const { t } = useTranslation([namespaces.admin]);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder={t('admin:searchCar')}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        
        <div className="relative min-w-[160px]">
          <select 
            className="w-full appearance-none pl-4 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white shadow-sm"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
          >
            <option value="all">{t('admin:allStatuses')}</option>
            <option value="available">{t('admin:available')}</option>
            <option value="sold">{t('admin:sold')}</option>
            <option value="pending">{t('admin:pending')}</option>
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        
        <button
          className="px-3 py-2.5 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
          onClick={onToggleExpand}
          aria-expanded={isExpanded}
          title={t('admin:additionalFilters')}
        >
          <Filter size={18} className="text-gray-500" />
          <span className="text-gray-700">{t('admin:filters')}</span>
          {isExpanded ? 
            <ChevronUp size={16} className="text-gray-500" /> : 
            <ChevronDown size={16} className="text-gray-500" />
          }
        </button>
      </div>
      
      {isExpanded && (
        <div className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="yearFrom" className="block text-sm font-medium text-gray-700 mb-1">{t('admin:yearFrom')}</label>
            <input
              type="number"
              id="yearFrom"
              placeholder="2010"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div>
            <label htmlFor="yearTo" className="block text-sm font-medium text-gray-700 mb-1">{t('admin:yearTo')}</label>
            <input
              type="number"
              id="yearTo"
              placeholder="2023"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div>
            <label htmlFor="priceFrom" className="block text-sm font-medium text-gray-700 mb-1">{t('admin:priceFrom')}</label>
            <input
              type="number"
              id="priceFrom"
              placeholder="5000"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div>
            <label htmlFor="priceTo" className="block text-sm font-medium text-gray-700 mb-1">{t('admin:priceTo')}</label>
            <input
              type="number"
              id="priceTo"
              placeholder="50000"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div>
            <label htmlFor="transmission" className="block text-sm font-medium text-gray-700 mb-1">{t('admin:transmission')}</label>
            <select
              id="transmission"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
            >
              <option value="">{t('admin:all')}</option>
              <option value="manual">{t('admin:manual')}</option>
              <option value="automatic">{t('admin:automatic')}</option>
            </select>
          </div>
          <div>
            <label htmlFor="driveType" className="block text-sm font-medium text-gray-700 mb-1">{t('admin:driveType')}</label>
            <select
              id="driveType"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
            >
              <option value="">{t('admin:all')}</option>
              <option value="FWD">{t('admin:front')}</option>
              <option value="RWD">{t('admin:rear')}</option>
              <option value="AWD">{t('admin:full')}</option>
              <option value="4WD">{t('admin:fourByFour')}</option>
            </select>
          </div>
          
          <div className="sm:col-span-2 md:col-span-3 flex justify-end mt-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              {t('admin:applyFilter')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;