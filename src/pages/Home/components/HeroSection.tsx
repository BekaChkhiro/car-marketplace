import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaSearch, FaCar, FaCalendar, FaDollarSign } from 'react-icons/fa';
import data from '../../../data/cars.json';

const HeroContainer = styled.section`
  position: relative;
  min-height: 600px;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.9), rgba(30, 64, 175, 0.85)),
              url('/images/hero-bg.jpg') center/cover no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.section};
  color: white;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(to bottom, transparent, ${({ theme }) => theme.colors.background});
  }
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.hero};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSizes.xxlarge};
  }
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  opacity: 0.9;
  max-width: 600px;
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSizes.large};
  }
`;

const SearchContainer = styled.div`
  width: 100%;
  max-width: 900px;
  background: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  backdrop-filter: blur(10px);
  transform: translateY(0);
  transition: ${({ theme }) => theme.transition.default};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }
`;

const SearchForm = styled.form`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const SelectWrapper = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    left: ${({ theme }) => theme.spacing.md};
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.primary};
    font-size: ${({ theme }) => theme.fontSizes.medium};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  padding-left: ${({ theme }) => theme.spacing.xxl};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  background-color: ${({ theme }) => theme.colors.background};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.default};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}25;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.lightGray};
    cursor: not-allowed;
  }
`;

const SearchButton = styled.button`
  grid-column: 1 / -1;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.gradient};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.default};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.large};
  }

  svg {
    font-size: ${({ theme }) => theme.fontSizes.xlarge};
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
      <Title>Find Your Dream Car in Georgia</Title>
      <Subtitle>Browse through our extensive collection of quality vehicles and find the perfect match for your needs</Subtitle>
      
      <SearchContainer>
        <SearchForm onSubmit={handleSubmit}>
          <SelectWrapper>
            <FaCar />
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
            <FaCar />
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
            <FaDollarSign />
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
            <FaCalendar />
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
            <FaSearch /> Find Your Car
          </SearchButton>
        </SearchForm>
      </SearchContainer>
    </HeroContainer>
  );
};

export default HeroSection;