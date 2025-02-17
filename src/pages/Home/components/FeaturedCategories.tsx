import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaCar, FaDollarSign, FaStar } from 'react-icons/fa';
import data from '../../../data/cars.json';

const Container = styled.section`
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xxlarge};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const CategoryCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.large};
  }
`;

const IconWrapper = styled.div`
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const CategoryTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  text-align: center;
`;

const CategoryDescription = styled.p`
  color: ${({ theme }) => theme.colors.secondary};
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.medium};
`;

const categories = [
  {
    id: 'new',
    title: 'New Cars',
    description: 'Latest models with the best features',
    icon: <FaCar />,
    link: '/cars?category=new'
  },
  {
    id: 'budget',
    title: 'Budget Cars',
    description: 'Great deals that fit your budget',
    icon: <FaDollarSign />,
    link: '/cars?category=budget'
  },
  {
    id: 'popular',
    title: 'Popular Brands',
    description: 'Most trusted car brands',
    icon: <FaStar />,
    link: '/cars?category=popular'
  }
];

const FeaturedCategories: React.FC = () => {
  return (
    <Container>
      <Title>Browse by Category</Title>
      <CategoriesGrid>
        {categories.map((category) => (
          <CategoryCard key={category.id} to={category.link}>
            <IconWrapper>{category.icon}</IconWrapper>
            <CategoryTitle>{category.title}</CategoryTitle>
            <CategoryDescription>{category.description}</CategoryDescription>
          </CategoryCard>
        ))}
      </CategoriesGrid>
    </Container>
  );
};

export default FeaturedCategories;