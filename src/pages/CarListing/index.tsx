import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Car, CarFilters, Category } from '../../api/types/car.types';
import carService from '../../api/services/carService';
import { Container, Loading } from '../../components/ui';
import Pagination from '../../components/ui/Pagination';
import CarGrid from './components/CarGrid';
import Filters from './components/Filters';
import SortingHeader from './components/SortingHeader';
import AdvertisementDisplay from '../../components/Advertisement/AdvertisementDisplay';
import { useToast } from '../../context/ToastContext';

const CarListing: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [cars, setCars] = useState<Car[]>([]);
  const [totalCars, setTotalCars] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const listingTopRef = useRef<HTMLDivElement>(null);
  
  // Initialize filters with localStorage, URL params, or defaults
  const [filters, setFilters] = useState<CarFilters>(() => {
    // Try to load saved filters from localStorage
    const savedFilters = localStorage.getItem('carFilters');
    let initialFilters: CarFilters;

    if (savedFilters) {
      try {
        // Use saved filters if they exist
        initialFilters = JSON.parse(savedFilters);
        console.log('[CarListing] Loaded filters from localStorage:', initialFilters);
      } catch (error) {
        console.error('[CarListing] Error parsing saved filters:', error);
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
      sortBy: searchParams.get('sortBy') || initialFilters.sortBy || 'newest',
      order: (searchParams.get('order') as 'asc' | 'desc') || initialFilters.order || 'desc'
    };

    // Add all potential filter fields from URL parameters
    const possibleFilters = [
      'brand_id', 'model', 'category_id', 'yearFrom', 'yearTo', 
      'priceFrom', 'priceTo', 'location', 'transmission', 'drive_type',
      'fuel_type', 'mileageFrom', 'mileageTo', 'steering_wheel', 'interior_color',
      'exterior_color', 'interior_material', 'engine_volume', 'airbags'
    ];

    // Add all non-empty values from URL parameters
    possibleFilters.forEach(key => {
      const value = searchParams.get(key);
      if (value !== null && value !== '') {
        if (['yearFrom', 'yearTo', 'priceFrom', 'priceTo', 'mileageFrom', 'mileageTo'].includes(key)) {
          // Convert to number for numeric filters
          (initialFilters as Record<string, any>)[key] = Number(value);
        } else if (key === 'category_id') {
          // Handle category_id specially
          initialFilters.category = value;
          (initialFilters as Record<string, any>)['category_id'] = value;
          console.log(`[CarListing] Loaded category from URL: ${value}`);
        } else {
          (initialFilters as Record<string, any>)[key] = value;
        }
        console.log(`[CarListing] Loaded ${key} from URL:`, value);
      }
    });

    return initialFilters;
  });
  
  // Save filters to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('carFilters', JSON.stringify(filters));
      console.log('[CarListing] Saved filters to localStorage');
    } catch (error) {
      console.error('[CarListing] Error saving filters to localStorage:', error);
    }
  }, [filters]);

  // Fetch car data with filters
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Log filters being applied
        console.log('[CarListing] Applying filters:', JSON.stringify(filters));
        
        // Create clean filters object with only valid values
        const cleanFilters: CarFilters = { 
          page: filters.page || 1,
          limit: filters.limit || 12,
          sortBy: filters.sortBy,
          order: filters.order
        };
        
        // Add all non-empty filter values
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== '' && !['page', 'limit', 'sortBy', 'order'].includes(key)) {
            // Type-safe assignment using type assertion
            (cleanFilters as Record<string, any>)[key] = value;
            console.log(`[CarListing] Added ${key} filter:`, value);
          }
        });
        
        console.log('[CarListing] Clean filters for API call:', JSON.stringify(cleanFilters));
        
        // Get cars and categories with clean filters
        const [carsResponse, categoriesResponse] = await Promise.all([
          carService.getCars(cleanFilters),
          carService.getCategories()
        ]);
        
        // Update state with response data
        console.log('[CarListing] Cars returned from API:', carsResponse.cars.length);
        setCars(carsResponse.cars);
        setTotalCars(carsResponse.meta.total); // Use the total from metadata
        setCategories(categoriesResponse);
      } catch (error) {
        console.error('[CarListing] Error fetching data:', error);
        showToast('მონაცემების ჩატვირთვა ვერ მოხერხდა', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, showToast]);

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<CarFilters>) => {
    // Reset to page 1 when filters change
    if (Object.keys(newFilters).some(key => key !== 'page' && key !== 'limit')) {
      newFilters.page = 1;
    }
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    handleFilterChange({ page });
    scrollToTop();
  };

  // Handle sort change
  const handleSortChange = (sortValue: string) => {
    // Parse the sort value to extract sortBy and order
    let sortBy: string = 'newest';
    let order: 'asc' | 'desc' = 'desc';

    if (sortValue === 'newest') {
      sortBy = 'created_at';
      order = 'desc';
    } else if (sortValue.startsWith('price')) {
      sortBy = 'price';
      order = sortValue.endsWith('asc') ? 'asc' : 'desc';
    } else if (sortValue.startsWith('year')) {
      sortBy = 'year';
      order = sortValue.endsWith('asc') ? 'asc' : 'desc';
    } else if (sortValue.startsWith('mileage')) {
      sortBy = 'mileage';
      order = sortValue.endsWith('asc') ? 'asc' : 'desc';
    }

    handleFilterChange({ sortBy, order, page: 1 });
  };

  // Scroll to top function
  const scrollToTop = () => {
    if (listingTopRef.current) {
      listingTopRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Apply filters
  const applyFilters = () => {
    // This function is passed to the Filters component
    // The actual filtering happens in the useEffect when filters state changes
    scrollToTop();
  };

  // Use the total pages from the API metadata
  const totalPages = Math.ceil(totalCars / (filters.limit || 12));

  if (loading) {
    return <Loading />;
  }

  return (
    <Container>
      {/* Reference div for scroll to top */}
      <div ref={listingTopRef} className="scroll-mt-16"></div>
      
      {/* Top Advertisement - responsive */}
      <div className="w-full flex justify-center my-4">
        <AdvertisementDisplay 
          placement="car_listing_top" 
          className="w-full md:w-[728px] h-[90px] md:h-[140px] rounded-lg shadow-md max-w-full overflow-hidden transition-all duration-300" 
        />
      </div>
      
      <div className="py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <div className="w-full lg:w-1/4">
            <Filters 
              filters={filters} 
              onFilterChange={handleFilterChange}
              categories={categories}
              totalCars={totalCars}
              onApplyFilters={applyFilters}
              onScrollToTop={scrollToTop}
            />
          </div>
          
          {/* Main content area */}
          <div className="w-full lg:w-3/4 space-y-6">
            {/* Sorting header with total count */}
            <SortingHeader 
              total={totalCars} 
              sortBy={filters.sortBy === 'created_at' && filters.order === 'desc' ? 'newest' : 
                `${filters.sortBy}-${filters.order}`} 
              onSortChange={handleSortChange}
            />
            
            {/* Car grid */}
            <CarGrid cars={cars} categories={categories} />
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination 
                  currentPage={filters.page || 1} 
                  totalPages={totalPages} 
                  onPageChange={handlePageChange}
                  className="py-4"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CarListing;