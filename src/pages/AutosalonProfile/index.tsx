import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../i18n';
import autosalonService from '../../api/services/autosalonService';
import carService from '../../api/services/carService';
import { Autosalon } from '../../api/types/autosalon.types';
import { Car, CarFilters } from '../../api/types/car.types';
import { Container, Loading } from '../../components/ui';
import Pagination from '../../components/ui/Pagination';
import CarGrid from '../CarListing/components/CarGrid';
import SortingHeader from '../CarListing/components/SortingHeader';
import Filters from '../CarListing/components/Filters';
import { useToast } from '../../context/ToastContext';
import { MapPin, Phone, Globe, Calendar, Building } from 'lucide-react';

const AutosalonProfile: React.FC = () => {
  const { t } = useTranslation([namespaces.autosalonProfile]);
  const { autosalonId } = useParams<{ autosalonId: string }>();
  const [autosalon, setAutosalon] = useState<Autosalon | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCars, setTotalCars] = useState(0);
  const [categories, setCategories] = useState<any[]>([]);
  const { showToast } = useToast();
  
  console.log('AutosalonProfile - autosalonId:', autosalonId);
  console.log('AutosalonProfile - autosalon:', autosalon);
  console.log('AutosalonProfile - cars:', cars);
  console.log('AutosalonProfile - loading:', loading);
  
  const [filters, setFilters] = useState<CarFilters>({
    page: 1,
    limit: 12,
    sortBy: 'newest',
    order: 'desc'
  });

  // Fetch autosalon profile data
  useEffect(() => {
    const fetchAutosalonProfile = async () => {
      if (!autosalonId) {
        console.log('No autosalonId provided');
        return;
      }
      
      try {
        console.log('Fetching autosalon with ID:', autosalonId);
        setLoading(true);
        
        // Fetch autosalon profile
        const autosalonData = await autosalonService.getAutosalonProfile(parseInt(autosalonId));
        console.log('Autosalon response:', autosalonData);
        
        if (autosalonData) {
          setAutosalon(autosalonData);
        } else {
          throw new Error('Autosalon not found');
        }
        
        // Fetch categories for filters
        try {
          const categoriesData = await carService.getCategories();
          setCategories(categoriesData);
        } catch (categoriesError) {
          console.error('Error fetching categories:', categoriesError);
        }
      } catch (error) {
        console.error('Error fetching autosalon:', error);
        showToast(t('errorLoadingData'), 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAutosalonProfile();
  }, [autosalonId, showToast]);

  // Fetch autosalon cars when filters change
  useEffect(() => {
    const fetchAutosalonCars = async () => {
      if (!autosalonId) return;
      
      try {
        const carsResponse = await autosalonService.getAutosalonCars(parseInt(autosalonId), {
          page: filters.page || 1,
          limit: filters.limit || 12
        });
        console.log('Autosalon cars response:', carsResponse);
        
        if (carsResponse && carsResponse.cars) {
          console.log('Autosalon cars found:', carsResponse.cars);
          setCars(carsResponse.cars);
          setTotalCars(carsResponse.total);
        }
      } catch (carError) {
        console.error('Error fetching autosalon cars:', carError);
        // Don't show error toast for cars - just show empty state
        setCars([]);
        setTotalCars(0);
      }
    };

    fetchAutosalonCars();
  }, [autosalonId, filters.page, filters.limit]);

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<CarFilters>) => {
    if (Object.keys(newFilters).some(key => key !== 'page' && key !== 'limit')) {
      newFilters.page = 1;
    }
    setFilters(prev => ({ ...prev, ...newFilters }));
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
  console.log('AutosalonProfile render - about to check loading state');
  
  if (loading) {
    console.log('Showing loading state');
    return <Loading />;
  }

  if (!autosalon) {
    console.log('No autosalon found - showing not found message');
    return (
      <Container>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏪</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('notFound')}</h3>
          <p className="text-gray-600 text-center max-w-md">
            {t('notFoundDescription')}
          </p>
          <p className="text-sm text-gray-500 mt-4">Debug: autosalonId = {autosalonId}</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        {/* Autosalon Header - More compact and integrated */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Autosalon Logo */}
            <div className="w-full md:w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 self-center">
              {autosalon.logo_url ? (
                <img 
                  src={autosalon.logo_url} 
                  alt={`${autosalon.company_name} logo`}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="w-full h-full bg-primary/10 rounded-xl flex items-center justify-center">
                  <Building className="w-12 h-12 text-primary" />
                </div>
              )}
            </div>

            {/* Autosalon Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                {autosalon.company_name}
              </h1>
              
              <div className="grid grid-cols-2 grid-rows-2 gap-4 mb-4">
                {autosalon.established_year && (
                  <div className="flex items-center p-3 bg-green-50/50 rounded-xl transition-all hover:bg-green-50 border border-green-100 gap-2 text-gray-600 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{t('establishedYear', { year: autosalon.established_year })}</span>
                  </div>
                )}
                
                {(autosalon.user?.phone || (autosalon as any).phone) && (
                  <div className="flex items-center p-3 bg-green-50/50 rounded-xl transition-all hover:bg-green-50 border border-green-100 gap-2 text-gray-600 text-sm">
                    <Phone className="w-4 h-4" />
                    <span>{autosalon.user?.phone || (autosalon as any).phone}</span>
                  </div>
                )}
                
                {autosalon.address && (
                  <div className="flex items-center p-3 bg-green-50/50 rounded-xl transition-all hover:bg-green-50 border border-green-100 gap-2 text-gray-600 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{autosalon.address}</span>
                  </div>
                )}
                
                {autosalon.website_url && (
                  <div className="flex items-center p-3 bg-green-50/50 rounded-xl transition-all hover:bg-green-50 border border-green-100 gap-2 text-gray-600 text-sm">
                    <Globe className="w-4 h-4" />
                    <a 
                      href={autosalon.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-secondary transition-colors"
                    >
                      {autosalon.website_url}
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
            {/* Sorting header with autosalon context */}
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
                  {t('noCarsFound', { companyName: autosalon.company_name })}
                </h3>
                <p className="text-gray-600 text-center max-w-md">
                  {t('noCarsDescription')}
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

export default AutosalonProfile;