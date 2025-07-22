import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../i18n';
import dealerService from '../../api/services/dealerService';
import { Dealer, DealerFilters } from '../../api/types/dealer.types';
import DealerGrid from './components/DealerGrid';
import DealerSortingHeader from './components/DealerSortingHeader';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DealerListing: React.FC = () => {
  const { t } = useTranslation([namespaces.dealerListing, namespaces.common]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalDealers, setTotalDealers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<DealerFilters>({
    page: 1,
    limit: 12,
    sortBy: 'created_at',
    sortOrder: 'DESC',
  });

  // Load filters from URL params on mount
  useEffect(() => {
    const urlFilters: DealerFilters = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '12'),
      search: searchParams.get('search') || undefined,
      established_year_min: searchParams.get('established_year_min') ? parseInt(searchParams.get('established_year_min')!) : undefined,
      sortBy: searchParams.get('sortBy') || 'created_at',
      sortOrder: (searchParams.get('sortOrder') as 'ASC' | 'DESC') || 'DESC',
    };

    setFilters(urlFilters);
    setCurrentPage(urlFilters.page || 1);
  }, [searchParams]);

  // Fetch dealers when filters change
  useEffect(() => {
    fetchDealers();
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

  const fetchDealers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await dealerService.getDealers(filters);
      console.log('Dealers response:', response);
      
      // Extract dealers from the correct location in the response
      let dealersData: Dealer[] = [];
      
      // Handle the new response structure where dealers is an object with data and meta properties
      if (response && typeof response === 'object') {
        // New structure: response.dealers.data is the array of dealers
        if (response.dealers && typeof response.dealers === 'object' && 'data' in response.dealers && Array.isArray(response.dealers.data)) {
          dealersData = response.dealers.data as Dealer[];
          
          // Use meta for pagination if available
          if ('meta' in response.dealers && response.dealers.meta && typeof response.dealers.meta === 'object') {
            const meta = response.dealers.meta as { total: number, totalPages: number };
            setTotalDealers(meta.total || 0);
            setTotalPages(meta.totalPages || 1);
          }
        }
        // Old structure: response.dealers is the array directly
        else if (Array.isArray(response.dealers)) {
          dealersData = response.dealers;
          setTotalDealers(response.total || 0);
          setTotalPages(response.totalPages || 1);
        }
        // If response itself is an array
        else if (Array.isArray(response)) {
          dealersData = response as Dealer[];
        }
      }
      
      console.log('Extracted dealers array:', dealersData);
      console.log('Array length:', dealersData.length);
      
      setDealers(dealersData);
    } catch (err: any) {
      setError(t('error.loadingFailed'));
      console.error('Error fetching dealers:', err);
      setDealers([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: DealerFilters) => {
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
          <DealerSortingHeader
            totalDealers={totalDealers}
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-700">{error}</p>
              <button
                onClick={fetchDealers}
                className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                {t('error.retry')}
              </button>
            </div>
          )}

          <DealerGrid dealers={dealers} loading={loading} />

          <Pagination />
        </div>
      </div>
    </div>
  );
};

export default DealerListing;