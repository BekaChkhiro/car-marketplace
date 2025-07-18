import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface AutosalonFilters {
  page?: number;
  limit?: number;
  search?: string;
  established_year_min?: number;
  established_year_max?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

interface AutosalonSortingHeaderProps {
  totalAutosalons: number;
  filters: AutosalonFilters;
  onFiltersChange: (filters: AutosalonFilters) => void;
}

const AutosalonSortingHeader: React.FC<AutosalonSortingHeaderProps> = ({
  totalAutosalons,
  filters,
  onFiltersChange,
}) => {
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
            ავტოსალონები ({totalAutosalons})
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
                placeholder="ძიება ავტოსალონების მიხედვით..."
                className="w-full lg:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-sm"
              />
            </div>
          </form>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">დახარისხება:</span>
            <select
              value={`${filters.sortBy || 'created_at'}_${filters.sortOrder || 'DESC'}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('_');
                handleSortChange(sortBy, sortOrder as 'ASC' | 'DESC');
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none text-sm"
            >
              <option value="created_at_DESC">უახლესი პირველი</option>
              <option value="created_at_ASC">ძველი პირველი</option>
              <option value="company_name_ASC">კომპანია (ა-ზ)</option>
              <option value="company_name_DESC">კომპანია (ზ-ა)</option>
              <option value="established_year_DESC">დაარსების წელი (ახალი)</option>
              <option value="established_year_ASC">დაარსების წელი (ძველი)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutosalonSortingHeader;