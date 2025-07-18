import React from 'react';
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
  const handleSortChange = (sortBy: string, sortOrder: 'ASC' | 'DESC') => {
    onFiltersChange({
      ...filters,
      sortBy,
      sortOrder,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">
            დილერები ({totalDealers})
          </h2>
        </div>

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
  );
};

export default DealerSortingHeader;