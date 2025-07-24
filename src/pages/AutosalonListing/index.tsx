import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../i18n';
import autosalonService from '../../api/services/autosalonService';
import { Autosalon } from '../../api/types/autosalon.types';
import AutosalonGrid from './components/AutosalonGrid';
import AutosalonSortingHeader from './components/AutosalonSortingHeader';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AutosalonFilters {
  page?: number;
  limit?: number;
  search?: string;
  established_year_min?: number;
  established_year_max?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

const AutosalonListing: React.FC = () => {
  const { t } = useTranslation([namespaces.autosalonListing]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [autosalons, setAutosalons] = useState<Autosalon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalAutosalons, setTotalAutosalons] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<AutosalonFilters>({
    page: 1,
    limit: 12,
    sortBy: 'created_at',
    sortOrder: 'DESC',
  });

  // Load filters from URL params on mount
  useEffect(() => {
    const urlFilters: AutosalonFilters = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '12'),
      search: searchParams.get('search') || undefined,
      established_year_min: searchParams.get('established_year_min') ? parseInt(searchParams.get('established_year_min')!) : undefined,
      established_year_max: searchParams.get('established_year_max') ? parseInt(searchParams.get('established_year_max')!) : undefined,
      sortBy: searchParams.get('sortBy') || 'created_at',
      sortOrder: (searchParams.get('sortOrder') as 'ASC' | 'DESC') || 'DESC',
    };

    setFilters(urlFilters);
    setCurrentPage(urlFilters.page || 1);
  }, [searchParams]);

  // Fetch autosalons when filters change
  useEffect(() => {
    fetchAutosalons();
  }, [filters]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, value.toString());
      }
    });

    setSearchParams(params);
  }, [filters, setSearchParams]);

  const fetchAutosalons = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await autosalonService.getAutosalons(filters);
      setAutosalons(response.autosalons);
      setTotalAutosalons(response.total);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      setError(t('error'));
      console.error('Error fetching autosalons:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: AutosalonFilters) => {
    setFilters({
      ...newFilters,
      page: 1, // Reset to first page when filters change
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setFilters({ ...filters, page });
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const Pagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const showPages = 5;
    const halfShow = Math.floor(showPages / 2);
    
    let startPage = Math.max(1, currentPage - halfShow);
    let endPage = Math.min(totalPages, startPage + showPages - 1);
    
    if (endPage - startPage < showPages - 1) {
      startPage = Math.max(1, endPage - showPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex justify-center items-center gap-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}
        
        {pages.map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-2 rounded-lg border ${
              page === currentPage
                ? 'bg-primary text-white border-primary'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        <div className="space-y-6">
          <AutosalonSortingHeader
            totalAutosalons={totalAutosalons}
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-700">{error}</p>
              <button
                onClick={fetchAutosalons}
                className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                {t('retry')}
              </button>
            </div>
          )}

          <AutosalonGrid autosalons={autosalons} loading={loading} />

          <Pagination />
        </div>
      </div>
    </div>
  );
};

export default AutosalonListing;