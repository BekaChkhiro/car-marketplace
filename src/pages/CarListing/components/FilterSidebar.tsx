import React, { useState } from 'react';
import styled from 'styled-components';
import { FaFilter, FaTimes } from 'react-icons/fa';
import data from '../../../data/cars.json';

const SidebarContainer = styled.aside<{ isOpen: boolean }>`
  background: white;
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.medium};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 300px;
    z-index: 1000;
    transform: translateX(${({ isOpen }) => (isOpen ? '0' : '-100%')});
    transition: transform 0.3s ease;
  }
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FilterTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CloseButton = styled.button`
  display: none;
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.text};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
  }
`;

const FilterSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const PriceRangeContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const PriceInput = styled.input`
  width: 50%;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const MobileFilterButton = styled.button`
  display: none;
  position: fixed;
  bottom: ${({ theme }) => theme.spacing.lg};
  right: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 50%;
  box-shadow: ${({ theme }) => theme.shadows.large};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

interface FilterSidebarProps {
  filters: {
    brand: string;
    model: string;
    priceRange: string;
    year: string;
    fuelType: string;
    transmission: string;
    location: string;
  };
  onFilterChange: (filters: any) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { brands } = data;

  const years = Array.from({ length: 35 }, (_, i) => 2024 - i);
  const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
  const transmissions = ['Automatic', 'Manual'];
  const priceRanges = [
    '0-5000',
    '5000-10000',
    '10000-20000',
    '20000-30000',
    '30000-50000',
    '50000+'
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <SidebarContainer isOpen={isOpen}>
        <FilterHeader>
          <FilterTitle>
            <FaFilter /> Filters
          </FilterTitle>
          <CloseButton onClick={toggleSidebar}>
            <FaTimes />
          </CloseButton>
        </FilterHeader>

        <FilterSection>
          <SectionTitle>Brand</SectionTitle>
          <Select
            value={filters.brand}
            onChange={(e) => onFilterChange({ brand: e.target.value })}
          >
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.name}>
                {brand.name}
              </option>
            ))}
          </Select>
        </FilterSection>

        <FilterSection>
          <SectionTitle>Model</SectionTitle>
          <Select
            value={filters.model}
            onChange={(e) => onFilterChange({ model: e.target.value })}
            disabled={!filters.brand}
          >
            <option value="">All Models</option>
            {filters.brand && 
              brands
                .find(b => b.name === filters.brand)
                ?.models.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))
            }
          </Select>
        </FilterSection>

        <FilterSection>
          <SectionTitle>Price Range</SectionTitle>
          <Select
            value={filters.priceRange}
            onChange={(e) => onFilterChange({ priceRange: e.target.value })}
          >
            <option value="">Any Price</option>
            {priceRanges.map((range) => (
              <option key={range} value={range}>
                ${range}
              </option>
            ))}
          </Select>
        </FilterSection>

        <FilterSection>
          <SectionTitle>Year</SectionTitle>
          <Select
            value={filters.year}
            onChange={(e) => onFilterChange({ year: e.target.value })}
          >
            <option value="">Any Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
        </FilterSection>

        <FilterSection>
          <SectionTitle>Fuel Type</SectionTitle>
          <Select
            value={filters.fuelType}
            onChange={(e) => onFilterChange({ fuelType: e.target.value })}
          >
            <option value="">Any Fuel Type</option>
            {fuelTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </FilterSection>

        <FilterSection>
          <SectionTitle>Transmission</SectionTitle>
          <Select
            value={filters.transmission}
            onChange={(e) => onFilterChange({ transmission: e.target.value })}
          >
            <option value="">Any Transmission</option>
            {transmissions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </FilterSection>
      </SidebarContainer>

      <MobileFilterButton onClick={toggleSidebar}>
        <FaFilter />
      </MobileFilterButton>
    </>
  );
};

export default FilterSidebar;