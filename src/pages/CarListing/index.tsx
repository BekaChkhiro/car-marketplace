import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Car, CarFilters } from '../../api/types/car.types';
import carService from '../../api/services/carService';
import { Container, Loading } from '../../components/ui';
import CarGrid from './components/CarGrid';
import Filters from './components/Filters';
import { useToast } from '../../context/ToastContext';

interface ExtendedCarFilters extends CarFilters {
  priceRange?: string;
  location?: string;
}

const CarListing: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  
  const [filters, setFilters] = useState<ExtendedCarFilters>({
    brand: searchParams.get('brand') || '',
    model: searchParams.get('model') || '',
    category: searchParams.get('category') || '',
    priceRange: searchParams.get('priceRange') || '',
    yearFrom: Number(searchParams.get('yearFrom')) || undefined,
    yearTo: Number(searchParams.get('yearTo')) || undefined,
    fuelType: searchParams.get('fuelType') || '',
    transmission: searchParams.get('transmission') || '',
    location: searchParams.get('location') || ''
  });

  useEffect(() => {
    const fetchCars = async () => {
      try {
        // Convert filters to API format
        const apiFilters: CarFilters = {
          brand: filters.brand,
          model: filters.model,
          category: filters.category,
          fuelType: filters.fuelType,
          transmission: filters.transmission
        };

        // Handle price range
        if (filters.priceRange) {
          const [min, max] = filters.priceRange.split('-');
          apiFilters.priceFrom = Number(min);
          apiFilters.priceTo = Number(max);
        }

        // Handle year range
        if (filters.yearFrom) apiFilters.yearFrom = filters.yearFrom;
        if (filters.yearTo) apiFilters.yearTo = filters.yearTo;

        const response = await carService.getCars(apiFilters);
        setCars(response);
      } catch (error) {
        console.error('Error fetching cars:', error);
        showToast('Failed to load cars', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [filters, showToast]);

  const handleFilterChange = (newFilters: Partial<ExtendedCarFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container>
      <div className="py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/4">
            <Filters filters={filters} onFilterChange={handleFilterChange} />
          </div>
          <div className="w-full lg:w-3/4">
            <CarGrid cars={cars} />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CarListing;