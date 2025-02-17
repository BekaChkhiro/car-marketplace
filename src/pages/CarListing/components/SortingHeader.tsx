import React from 'react';
import styled from 'styled-components';
import { FaSort, FaCar, FaChevronDown } from 'react-icons/fa';

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  transition: ${({ theme }) => theme.transition.default};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.large};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

const ResultCount = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text};

  svg {
    color: ${({ theme }) => theme.colors.primary};
    font-size: ${({ theme }) => theme.fontSizes.xlarge};
  }

  span {
    background: ${({ theme }) => theme.colors.gradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  }
`;

const SortingControl = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }
`;

const SortLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.secondary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const SelectWrapper = styled.div`
  position: relative;
  
  svg.chevron {
    position: absolute;
    right: ${({ theme }) => theme.spacing.lg};
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.primary};
    pointer-events: none;
    transition: ${({ theme }) => theme.transition.default};
  }
  
  &:hover svg.chevron {
    transform: translateY(-50%) rotate(180deg);
  }
`;

const Select = styled.select`
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  padding-right: ${({ theme }) => theme.spacing.xxl};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.background};
  cursor: pointer;
  appearance: none;
  transition: ${({ theme }) => theme.transition.default};
  min-width: 200px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}25;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
  }
`;

const ViewOptions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ViewButton = styled.button<{ active?: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  background: ${({ theme, active }) => 
    active ? theme.colors.primary : theme.colors.lightGray};
  color: ${({ theme, active }) => 
    active ? 'white' : theme.colors.secondary};
  transition: ${({ theme }) => theme.transition.default};
  
  &:hover {
    background: ${({ theme, active }) => 
      active ? theme.colors.primary : theme.colors.border};
    transform: translateY(-2px);
  }
`;

interface SortingHeaderProps {
  total: number;
  sortBy: string;
  onSortChange: (value: string) => void;
}

const SortingHeader: React.FC<SortingHeaderProps> = ({
  total,
  sortBy,
  onSortChange
}) => {
  return (
    <HeaderContainer>
      <ResultCount>
        <FaCar />
        Found <span>{total}</span> {total === 1 ? 'car' : 'cars'}
      </ResultCount>
      
      <SortingControl>
        <SortLabel>
          <FaSort /> Sort by
        </SortLabel>
        <SelectWrapper>
          <Select 
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="year-desc">Year: Newest First</option>
            <option value="year-asc">Year: Oldest First</option>
            <option value="mileage-asc">Mileage: Low to High</option>
            <option value="mileage-desc">Mileage: High to Low</option>
          </Select>
          <FaChevronDown className="chevron" />
        </SelectWrapper>
      </SortingControl>
    </HeaderContainer>
  );
};

export default SortingHeader;