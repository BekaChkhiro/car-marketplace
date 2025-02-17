import React from 'react';
import styled from 'styled-components';
import { FaSort } from 'react-icons/fa';

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const ResultCount = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const SortingControl = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SortLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.text};
  background-color: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
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
        {total} {total === 1 ? 'car' : 'cars'} found
      </ResultCount>
      
      <SortingControl>
        <SortLabel>
          <FaSort /> Sort by:
        </SortLabel>
        <Select 
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="year-desc">Year: Newest First</option>
          <option value="year-asc">Year: Oldest First</option>
        </Select>
      </SortingControl>
    </HeaderContainer>
  );
};

export default SortingHeader;