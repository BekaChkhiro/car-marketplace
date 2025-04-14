import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Car, CarFilters, Category } from '../../api/types/car.types';
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
  const [categories, setCategories] = useState<Category[]>([]);
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
    const fetchData = async () => {
      try {
        setLoading(true);
        const [carsResponse, categoriesResponse] = await Promise.all([
          carService.getCars(filters),
          carService.getCategories()
        ]);
        setCars(carsResponse);
        setCategories(categoriesResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
        showToast('Failed to load data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
            <Filters 
              filters={filters} 
              onFilterChange={handleFilterChange}
              categories={categories}
            />
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