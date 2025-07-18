import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { dealerService } from '../../api/services/dealerService';
import carService from '../../api/services/carService';
import { Dealer } from '../../api/types/dealer.types';
import { Car, CarFilters } from '../../api/types/car.types';
import { Container, Loading } from '../../components/ui';
import Pagination from '../../components/ui/Pagination';
import CarGrid from '../CarListing/components/CarGrid';
import SortingHeader from '../CarListing/components/SortingHeader';
import Filters from '../CarListing/components/Filters';
import { useToast } from '../../context/ToastContext';
import { MapPin, Phone, Globe, Calendar, Car as CarIcon, Building } from 'lucide-react';

// No conversion needed - using main cars API directly

const DealerProfile: React.FC = () => {
  const { dealerId } = useParams<{ dealerId: string }>();
  const [dealer, setDealer] = useState<Dealer | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCars, setTotalCars] = useState(0);
  const [categories, setCategories] = useState<any[]>([]);
  const { showToast } = useToast();
  
  console.log('DealerProfile - dealerId:', dealerId);
  console.log('DealerProfile - dealer:', dealer);
  console.log('DealerProfile - cars:', cars);
  console.log('DealerProfile - loading:', loading);
  
  const [filters, setFilters] = useState<CarFilters>({
    page: 1,
    limit: 12,
    sortBy: 'newest',
    order: 'desc'
  });
  
  // Update filters when dealerId changes
  useEffect(() => {
    if (dealerId) {
      setFilters(prev => ({
        ...prev,
        seller_id: parseInt(dealerId),
        page: 1 // Reset to first page when dealer changes
      }));
    }
  }, [dealerId]);

  // Fetch dealer profile and cars separately
  useEffect(() => {
    const fetchDealerData = async () => {
      if (!dealerId) {
        console.log('No dealerId provided');
        return;
      }
      
      try {
        console.log('Fetching dealer with ID:', dealerId);
        setLoading(true);
        
        // Fetch dealer profile
        const dealerData = await dealerService.getDealerById(parseInt(dealerId));
        console.log('Dealer data received:', dealerData);
        setDealer(dealerData);
        
        // Fetch categories for filters
        try {
          const categoriesData = await carService.getCategories();
          setCategories(categoriesData);
        } catch (categoriesError) {
          console.error('Error fetching categories:', categoriesError);
        }
        
        // Fetch dealer cars using main cars API with filters
        try {
          const carsResponse = await carService.getCars(filters);
          console.log('Cars response:', carsResponse);
          
          if (carsResponse && carsResponse.cars) {
            console.log('Cars found:', carsResponse.cars);
            
            // Filter cars to only show ones from this dealer (workaround for backend issue)
            const dealerCars = carsResponse.cars.filter(car => car.seller_id === parseInt(dealerId));
            console.log('Filtered dealer cars:', dealerCars);
            
            setCars(dealerCars);
            setTotalCars(dealerCars.length);
          }
        } catch (carError) {
          console.error('Error fetching dealer cars:', carError);
          // Don't show error toast for cars - just show empty state
          setCars([]);
          setTotalCars(0);
        }
      } catch (error) {
        console.error('Error fetching dealer:', error);
        showToast('დილერის მონაცემების ჩატვირთვა ვერ მოხერხდა', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDealerData();
  }, [dealerId, filters, showToast]);

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<CarFilters>) => {
    if (Object.keys(newFilters).some(key => key !== 'page' && key !== 'limit')) {
      newFilters.page = 1;
    }
    // Always ensure seller_id is included in filters
    const updatedFilters = { 
      ...newFilters, 
      seller_id: dealerId ? parseInt(dealerId) : undefined 
    };
    setFilters(prev => ({ ...prev, ...updatedFilters }));
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    handleFilterChange({ page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle sort change
  const handleSortChange = (sortValue: string) => {
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

  const totalPages = Math.ceil(totalCars / (filters.limit || 12));

  // Add a debug return to check if component is rendering
  console.log('DealerProfile render - about to check loading state');
  
  if (loading) {
    console.log('Showing loading state');
    return <Loading />;
  }

  if (!dealer) {
    console.log('No dealer found - showing not found message');
    return (
      <Container>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏪</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">დილერი ვერ მოიძებნა</h3>
          <p className="text-gray-600 text-center max-w-md">
            მოთხოვნილი დილერი ვერ მოიძებნა.
          </p>
          <p className="text-sm text-gray-500 mt-4">Debug: dealerId = {dealerId}</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        {/* Dealer Header - More compact and integrated */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Dealer Logo */}
            <div className="w-full md:w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 self-center">
              {dealer.logo_url ? (
                <img 
                  src={dealer.logo_url} 
                  alt={`${dealer.company_name} logo`}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="w-full h-full bg-primary/10 rounded-xl flex items-center justify-center">
                  <Building className="w-12 h-12 text-primary" />
                </div>
              )}
            </div>

            {/* Dealer Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                {dealer.company_name}
              </h1>
              
              <div className="grid grid-cols-2 grid-rows-2 gap-4 mb-4">
                {dealer.established_year && (
                  <div className="flex items-center p-3 bg-green-50/50 rounded-xl transition-all hover:bg-green-50 border border-green-100 gap-2 text-gray-600 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>დაარსდა {dealer.established_year} წელს</span>
                  </div>
                )}
                
                {dealer.user?.phone && (
                  <div className="flex items-center p-3 bg-green-50/50 rounded-xl transition-all hover:bg-green-50 border border-green-100 gap-2 text-gray-600 text-sm">
                    <Phone className="w-4 h-4" />
                    <span>{dealer.user.phone}</span>
                  </div>
                )}
                
                {dealer.address && (
                  <div className="flex items-center p-3 bg-green-50/50 rounded-xl transition-all hover:bg-green-50 border border-green-100 gap-2 text-gray-600 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{dealer.address}</span>
                  </div>
                )}
                
                {dealer.website_url && (
                  <div className="flex items-center p-3 bg-green-50/50 rounded-xl transition-all hover:bg-green-50 border border-green-100 gap-2 text-gray-600 text-sm">
                    <Globe className="w-4 h-4" />
                    <a 
                      href={dealer.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-secondary transition-colors"
                    >
                      ვებ გვერდი
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Cars Section - Styled exactly like CarListing page with filters */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <Filters 
              filters={filters}
              onFilterChange={handleFilterChange}
              categories={categories}
            />
          </div>
          
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Sorting header with dealer context */}
            <SortingHeader 
              total={totalCars} 
              sortBy={filters.sortBy === 'created_at' && filters.order === 'desc' ? 'newest' : 
                `${filters.sortBy}-${filters.order}`} 
              onSortChange={handleSortChange}
            />
            
            {/* Cars grid - exactly like CarListing page */}
            {cars.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🚗</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {dealer.company_name}-ს მანქანები ვერ მოიძებნა
                </h3>
                <p className="text-gray-600 text-center max-w-md">
                  ამ დილერს ამჟამად არ აქვს მანქანები გამოსატანი ან არ აკმაყოფილებს თქვენს ფილტრებს.
                </p>
              </div>
            ) : (
              <CarGrid cars={cars} categories={categories} />
            )}
            
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

export default DealerProfile;