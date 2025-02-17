import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'react-router-dom';
import FilterSidebar from './components/FilterSidebar';
import CarGrid from './components/CarGrid';
import SortingHeader from './components/SortingHeader';
import data from '../../data/cars.json';

const PageContainer = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

interface Filters {
  brand: string;
  model: string;
  priceRange: string;
  year: string;
  fuelType: string;
  transmission: string;
  location: string;
}

const CarListing: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<Filters>({
    brand: searchParams.get('brand') || '',
    model: searchParams.get('model') || '',
    priceRange: searchParams.get('priceRange') || '',
    year: searchParams.get('year') || '',
    fuelType: searchParams.get('fuelType') || '',
    transmission: searchParams.get('transmission') || '',
    location: searchParams.get('location') || ''
  });
  const [sortBy, setSortBy] = useState('newest');
  const [filteredCars, setFilteredCars] = useState(data.cars);

  useEffect(() => {
    let result = data.cars;

    // Apply filters
    if (filters.brand) {
      result = result.filter(car => car.make === filters.brand);
    }
    if (filters.model) {
      result = result.filter(car => car.model === filters.model);
    }
    if (filters.year) {
      result = result.filter(car => car.year.toString() === filters.year);
    }
    if (filters.fuelType) {
      result = result.filter(car => car.specifications.fuelType === filters.fuelType);
    }
    if (filters.transmission) {
      result = result.filter(car => car.specifications.transmission === filters.transmission);
    }
    if (filters.location) {
      result = result.filter(car => car.location.city === filters.location);
    }
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      result = result.filter(car => car.price >= min && (!max || car.price <= max));
    }

    // Apply sorting
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'year-desc':
          return b.year - a.year;
        case 'year-asc':
          return a.year - b.year;
        default: // 'newest'
          return Number(b.id) - Number(a.id);
      }
    });

    setFilteredCars(result);
  }, [filters, sortBy]);

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  return (
    <PageContainer>
      <FilterSidebar 
        filters={filters} 
        onFilterChange={handleFilterChange} 
      />
      <MainContent>
        <SortingHeader 
          total={filteredCars.length}
          sortBy={sortBy}
          onSortChange={handleSortChange}
        />
        <CarGrid cars={filteredCars} />
      </MainContent>
    </PageContainer>
  );
};

export default CarListing;