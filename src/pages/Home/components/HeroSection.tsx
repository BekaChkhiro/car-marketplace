import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import data from '../../../data/cars.json';

const HeroContainer = styled.section`
  position: relative;
  height: 500px;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
              url('/images/hero-bg.jpg') center/cover no-repeat;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: white;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSizes.medium};
  }
`;

const SearchContainer = styled.div`
  width: 100%;
  max-width: 800px;
  background: white;
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.large};
`;

const SearchForm = styled.form`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const SelectWrapper = styled.div`
  position: relative;
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: white;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SearchButton = styled.button`
  grid-column: 1 / -1;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.success};
  }
`;

interface SearchFormData {
  brand: string;
  model: string;
  priceRange: string;
  year: string;
}

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { brands } = data;
  
  const [formData, setFormData] = useState<SearchFormData>({
    brand: '',
    model: '',
    priceRange: '',
    year: ''
  });
  
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  
  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBrand = e.target.value;
    const brandData = brands.find(brand => brand.name === selectedBrand);
    setFormData({
      ...formData,
      brand: selectedBrand,
      model: ''
    });
    setAvailableModels(brandData?.models || []);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });
    navigate(`/cars?${params.toString()}`);
  };
  
  const years = Array.from({ length: 35 }, (_, i) => 2024 - i);
  const priceRanges = [
    '0-5000',
    '5000-10000',
    '10000-20000',
    '20000-30000',
    '30000-50000',
    '50000+'
  ];

  return (
    <HeroContainer>
      <Title>Find Your Perfect Car</Title>
      <Subtitle>Search from thousands of cars in Georgia</Subtitle>
      
      <SearchContainer>
        <SearchForm onSubmit={handleSubmit}>
          <SelectWrapper>
            <Select
              value={formData.brand}
              onChange={handleBrandChange}
            >
              <option value="">Select Brand</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.name}>
                  {brand.name}
                </option>
              ))}
            </Select>
          </SelectWrapper>
          
          <SelectWrapper>
            <Select
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              disabled={!formData.brand}
            >
              <option value="">Select Model</option>
              {availableModels.map(model => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </Select>
          </SelectWrapper>
          
          <SelectWrapper>
            <Select
              value={formData.priceRange}
              onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
            >
              <option value="">Price Range</option>
              {priceRanges.map(range => (
                <option key={range} value={range}>
                  ${range}
                </option>
              ))}
            </Select>
          </SelectWrapper>
          
          <SelectWrapper>
            <Select
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            >
              <option value="">Year</option>
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Select>
          </SelectWrapper>
          
          <SearchButton type="submit">
            Search Cars
          </SearchButton>
        </SearchForm>
      </SearchContainer>
    </HeroContainer>
  );
};

export default HeroSection;