import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import partService, { Part, PartFilters as PartFilterOptions } from '../../api/services/partService';
import { Container, Loading } from '../../components/ui';
import Pagination from '../../components/ui/Pagination';
import { namespaces } from '../../i18n';
// Use relative paths for component imports
import PartGrid from './components/PartGrid';
import PartFilters from './components/PartFilters';
import SortingHeader from './components/SortingHeader';
import { useToast } from '../../context/ToastContext';

const PartListing: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation(namespaces.parts);
  const [parts, setParts] = useState<Part[]>([]);
  const [totalParts, setTotalParts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const listingTopRef = useRef<HTMLDivElement>(null);
  
  // Initialize filters with localStorage, URL params, or defaults
  const [filters, setFilters] = useState<PartFilterOptions>(() => {
    // Try to load saved filters from localStorage
    const savedFilters = localStorage.getItem('partFilters');
    let initialFilters: PartFilterOptions;

    if (savedFilters) {
      try {
        // Use saved filters if they exist
        initialFilters = JSON.parse(savedFilters);
        console.log('[PartListing] Loaded filters from localStorage:', initialFilters);
      } catch (error) {
        console.error('[PartListing] Error parsing saved filters:', error);
        initialFilters = {};
      }
    } else {
      initialFilters = {};
    }

    // Always override with URL parameters if they exist (URL takes precedence)
    initialFilters = {
      ...initialFilters,
      page: Number(searchParams.get('page')) || initialFilters.page || 1,
      limit: Number(searchParams.get('limit')) || initialFilters.limit || 12,
      sortBy: searchParams.get('sortBy') || initialFilters.sortBy || 'newest'
    };

    // Parse other filters from URL
    if (searchParams.get('brand_id')) initialFilters.brand_id = Number(searchParams.get('brand_id'));
    if (searchParams.get('category_id')) initialFilters.category_id = Number(searchParams.get('category_id'));
    if (searchParams.get('model_id')) initialFilters.model_id = Number(searchParams.get('model_id'));
    if (searchParams.get('condition')) initialFilters.condition = searchParams.get('condition') || undefined;
    if (searchParams.get('minPrice')) initialFilters.minPrice = Number(searchParams.get('minPrice'));
    if (searchParams.get('maxPrice')) initialFilters.maxPrice = Number(searchParams.get('maxPrice'));
    if (searchParams.get('searchTerm')) initialFilters.searchTerm = searchParams.get('searchTerm') || undefined;

    console.log('[PartListing] Initial filters:', initialFilters);
    return initialFilters;
  });

  // Load parts data
  const loadParts = useCallback(async () => {
    setLoading(true);
    try {
      // Save current filters to localStorage for persistence
      localStorage.setItem('partFilters', JSON.stringify(filters));
      try {
        const result = await partService.getParts(filters);
        setParts(result.parts);
        setTotalParts(result.totalCount);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error('[PartListing] Error loading parts:', error);
        showToast(t('error'), 'error');
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error('[PartListing] Error loading parts:', error);
      showToast(t('error'), 'error');
      setLoading(false);
    }
  }, [filters, showToast]);

  // Load reference data (brands, categories)
  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        // Load brands and categories in parallel
        try {
          const brandsData = await partService.getBrands();
          const categoriesData = await partService.getPartCategories();
          setBrands(brandsData);
          setCategories(categoriesData);
        } catch (error) {
          console.error('[PartListing] Error loading reference data:', error);
          showToast(t('error'), 'error');
        }
      } catch (error) {
        console.error('[PartListing] Error loading reference data:', error);
        showToast(t('error'), 'error');
      }
    };
    
    loadReferenceData();
  }, [showToast]);

  // Load parts whenever filters change
  useEffect(() => {
    loadParts();
  }, [loadParts]);

  // Handle filter changes
  const handleFilterChange = (newFilters: PartFilterOptions) => {
    // Reset page to 1 when changing filters
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || 1
    }));
    
    // Scroll to top when filters change
    if (listingTopRef.current) {
      listingTopRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle page changes
  const handlePageChange = (page: number) => {
    handleFilterChange({ page });
  };

  // Handle sorting changes
  const handleSortChange = (sortBy: string) => {
    handleFilterChange({ sortBy, page: 1 });
  };

  return (
    <Container>
      <div ref={listingTopRef} />
      <h1 className="text-3xl font-bold mb-6">Car Parts</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters sidebar */}
        <div className="lg:col-span-1">
          <PartFilters 
            filters={filters} 
            onFilterChange={handleFilterChange}
            brands={brands}
            categories={categories}
          />
        </div>
        
        {/* Main content */}
        <div className="lg:col-span-3">
          {/* Sorting header */}
          <SortingHeader 
            sortBy={filters.sortBy || 'newest'} 
            onSortChange={handleSortChange}
            totalCount={totalParts}
            loading={loading}
          />
          
          {/* Parts grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loading />
            </div>
          ) : (
            <>
              {parts.length > 0 ? (
                <PartGrid parts={parts} />
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-medium text-gray-600">No parts found matching your criteria</h3>
                  <p className="text-gray-500 mt-2">Try adjusting your filters or search term</p>
                </div>
              )}
            </>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination 
                currentPage={filters.page || 1} 
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default PartListing;
