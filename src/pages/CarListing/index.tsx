import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Car, CarFilters, Category } from '../../api/types/car.types';
import carService from '../../api/services/carService';
import { Container, Loading } from '../../components/ui';
import CarGrid from './components/CarGrid';
import Filters from './components/Filters';
import AdvertisementDisplay from '../../components/Advertisement/AdvertisementDisplay';
import { useToast } from '../../context/ToastContext';

const CarListing: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [cars, setCars] = useState<Car[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  
  const [filters, setFilters] = useState<CarFilters>({
    brand_id: searchParams.get('brand_id') || '',
    model: searchParams.get('model') || ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Log filters being applied with more details
        console.log('[CarListing] Applying filters:', JSON.stringify(filters));
        
        // შევქმნათ სუფთა ობიექტი ვალიდური მნიშვნელობებით
        const cleanFilters: CarFilters = {};
        
        if (filters.brand_id && filters.brand_id !== '') {
          cleanFilters.brand_id = filters.brand_id;
          console.log('[CarListing] Added brand_id filter:', filters.brand_id);
        }
        
        if (filters.model && filters.model !== '') {
          cleanFilters.model = filters.model;
          console.log('[CarListing] Added model filter:', filters.model);
        }
        
        console.log('[CarListing] Clean filters for API call:', JSON.stringify(cleanFilters));
        
        // Get cars and categories with clean filters
        const [carsResponse, categoriesResponse] = await Promise.all([
          carService.getCars(cleanFilters),
          carService.getCategories()
        ]);
        
        console.log('[CarListing] Cars returned from API:', carsResponse.length);
        setCars(carsResponse);
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

  const handleFilterChange = (newFilters: Partial<CarFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container>
      {/* Top Advertisement - responsive */}
      <div className="w-full flex justify-center my-4">
        <AdvertisementDisplay 
          placement="car_listing_top" 
          className="w-full md:w-[728px] h-[90px] md:h-[140px] rounded-lg shadow-md max-w-full overflow-hidden transition-all duration-300" 
        />
      </div>
      
      <div className="py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/4">
            <Filters 
              filters={filters} 
              onFilterChange={handleFilterChange}
              categories={categories}
            />
            {/* Sidebar advertisement removed as requested */}
          </div>
          <div className="w-full lg:w-3/4">
            <CarGrid cars={cars} categories={categories} />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CarListing;