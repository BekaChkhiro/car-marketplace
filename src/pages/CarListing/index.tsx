import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterSidebar from './components/FilterSidebar';
import CarGrid from './components/CarGrid';
import SortingHeader from './components/SortingHeader';
import { getCars } from '../../api/services/carService';
import { useLoading } from '../../context/LoadingContext';
import { useToast } from '../../context/ToastContext';
import { Car } from '../../types/car';

interface Filters {
  brand: string;
  model: string;
  category: string;
  priceRange: string;
  year: string;
  fuelType: string;
  transmission: string;
  location: string;
}

interface PaginatedResponse {
  cars: Car[];
  total: number;
  currentPage: number;
  totalPages: number;
}

const CarListing: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { showLoading, hideLoading } = useLoading();
  const { showToast } = useToast();
  
  const [filters, setFilters] = useState<Filters>({
    brand: searchParams.get('brand') || '',
    model: searchParams.get('model') || '',
    category: searchParams.get('category') || '',
    priceRange: searchParams.get('priceRange') || '',
    year: searchParams.get('year') || '',
    fuelType: searchParams.get('fuelType') || '',
    transmission: searchParams.get('transmission') || '',
    location: searchParams.get('location') || ''
  });
  
  const [cars, setCars] = useState<Car[] | null>(null);
  const [totalCars, setTotalCars] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
    fetchCars();
  }, [filters, sortBy]);

  useEffect(() => {
    fetchCars();
  }, [currentPage]);

  const fetchCars = async () => {
    try {
      showLoading();
      setIsLoading(true);

      const params = {
        page: currentPage,
        limit: 12,
        sort: sortBy === 'newest' ? 'created_at' : sortBy,
        order: 'DESC' as const,
        brand_id: filters.brand ? Number(filters.brand) : undefined,
        category_id: filters.category ? Number(filters.category) : undefined,
        price_min: filters.priceRange ? Number(filters.priceRange.split('-')[0]) : undefined,
        price_max: filters.priceRange ? Number(filters.priceRange.split('-')[1]) : undefined,
        year_min: filters.year ? Number(filters.year) : undefined,
        year_max: filters.year ? Number(filters.year) : undefined
      };

      const response = await getCars(params);
      const data = response;
      
      setCars(data.cars || []);
      setTotalCars(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (error: any) {
      console.error('Error fetching cars:', error);
      showToast(error.message || 'მანქანების ჩატვირთვა ვერ მოხერხდა', 'error');
      setCars(null);
      setTotalCars(0);
      setTotalPages(1);
    } finally {
      hideLoading();
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full mx-auto px-4 py-6">
      <div className="w-full flex justify-between gap-7">
        <div className="w-1/4 md:sticky md:top-[100px] md:h-[calc(100vh-2rem)]">
          <FilterSidebar 
            filters={filters} 
            onFilterChange={handleFilterChange} 
          />
        </div>
        
        <div className="w-3/4 flex flex-col min-h-[800px] gap-4">
          <SortingHeader 
            total={totalCars}
            sortBy={sortBy}
            onSortChange={handleSortChange}
          />
          
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <CarGrid cars={cars} />
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-primary text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarListing;