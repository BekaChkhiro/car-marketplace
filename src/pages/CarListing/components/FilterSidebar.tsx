import React, { useState } from 'react';
import styled from 'styled-components';
import { FaFilter, FaTimes, FaCar, FaGasPump, FaCog, FaCalendar, FaMapMarkerAlt, FaSearch, FaUndo } from 'react-icons/fa';
import data from '../../../data/cars.json';

const Overlay = styled.div<{ isOpen: boolean }>`
  display: none;
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 999;
    opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
    visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
    transition: ${({ theme }) => theme.transition.default};
  }
`;

const SidebarContainer = styled.aside<{ isOpen: boolean }>`
  background: ${({ theme }) => theme.colors.cardBg};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.large};
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.lightGray};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 4px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 320px;
    z-index: 1000;
    border-radius: 0;
    transform: translateX(${({ isOpen }) => (isOpen ? '0' : '-100%')});
    transition: ${({ theme }) => theme.transition.default};
  }
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const FilterTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const CloseButton = styled.button`
  display: none;
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  background: ${({ theme }) => theme.colors.lightGray};
  color: ${({ theme }) => theme.colors.text};
  transition: ${({ theme }) => theme.transition.default};
  
  &:hover {
    background: ${({ theme }) => theme.colors.border};
    transform: rotate(90deg);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const FilterSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const SelectWrapper = styled.div`
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: ${({ theme }) => theme.spacing.md};
    transform: translateY(-50%);
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid ${({ theme }) => theme.colors.secondary};
    pointer-events: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
  cursor: pointer;
  appearance: none;
  transition: ${({ theme }) => theme.transition.default};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}25;
  }
  
  &:disabled {
    background: ${({ theme }) => theme.colors.lightGray};
    cursor: not-allowed;
  }
  
  option {
    padding: ${({ theme }) => theme.spacing.sm};
  }
`;

const RangeContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const RangeInput = styled.input`
  width: 100%;
  height: 2px;
  background: ${({ theme }) => theme.colors.border};
  outline: none;
  appearance: none;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.gradient};
    cursor: pointer;
    transition: ${({ theme }) => theme.transition.default};
    
    &:hover {
      transform: scale(1.2);
    }
  }
`;

const RangeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.secondary};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const Button = styled.button`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  transition: ${({ theme }) => theme.transition.default};
  
  &.apply {
    background: ${({ theme }) => theme.colors.gradient};
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${({ theme }) => theme.shadows.medium};
    }
  }
  
  &.reset {
    background: ${({ theme }) => theme.colors.lightGray};
    color: ${({ theme }) => theme.colors.text};
    
    &:hover {
      background: ${({ theme }) => theme.colors.border};
    }
  }
`;

const MobileFilterButton = styled.button`
  display: none;
  position: fixed;
  bottom: ${({ theme }) => theme.spacing.xl};
  right: ${({ theme }) => theme.spacing.xl};
  width: 56px;
  height: 56px;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  background: ${({ theme }) => theme.colors.gradient};
  color: white;
  box-shadow: ${({ theme }) => theme.shadows.large};
  transition: ${({ theme }) => theme.transition.default};
  
  &:hover {
    transform: scale(1.1);
  }
  
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
  
  const handleReset = () => {
    onFilterChange({
      brand: '',
      model: '',
      priceRange: '',
      year: '',
      fuelType: '',
      transmission: '',
      location: ''
    });
  };

  return (
    <>
      <Overlay isOpen={isOpen} onClick={toggleSidebar} />
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
          <SectionTitle>
            <FaCar /> Brand & Model
          </SectionTitle>
          <SelectWrapper>
            <Select
              value={filters.brand}
              onChange={(e) => onFilterChange({ ...filters, brand: e.target.value, model: '' })}
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.name}>
                  {brand.name}
                </option>
              ))}
            </Select>
          </SelectWrapper>
          
          <SelectWrapper style={{ marginTop: '1rem' }}>
            <Select
              value={filters.model}
              onChange={(e) => onFilterChange({ ...filters, model: e.target.value })}
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
          </SelectWrapper>
        </FilterSection>

        <FilterSection>
          <SectionTitle>
            <FaCalendar /> Year
          </SectionTitle>
          <SelectWrapper>
            <Select
              value={filters.year}
              onChange={(e) => onFilterChange({ ...filters, year: e.target.value })}
            >
              <option value="">Any Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Select>
          </SelectWrapper>
        </FilterSection>

        <FilterSection>
          <SectionTitle>
            <FaGasPump /> Fuel Type
          </SectionTitle>
          <SelectWrapper>
            <Select
              value={filters.fuelType}
              onChange={(e) => onFilterChange({ ...filters, fuelType: e.target.value })}
            >
              <option value="">Any Fuel Type</option>
              {fuelTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </SelectWrapper>
        </FilterSection>

        <FilterSection>
          <SectionTitle>
            <FaCog /> Transmission
          </SectionTitle>
          <SelectWrapper>
            <Select
              value={filters.transmission}
              onChange={(e) => onFilterChange({ ...filters, transmission: e.target.value })}
            >
              <option value="">Any Transmission</option>
              {transmissions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </SelectWrapper>
        </FilterSection>

        <ActionButtons>
          <Button className="reset" onClick={handleReset}>
            <FaUndo /> Reset
          </Button>
          <Button className="apply" onClick={toggleSidebar}>
            <FaSearch /> Apply
          </Button>
        </ActionButtons>
      </SidebarContainer>
      
      <MobileFilterButton onClick={toggleSidebar}>
        <FaFilter />
      </MobileFilterButton>
    </>
  );
};

export default FilterSidebar;