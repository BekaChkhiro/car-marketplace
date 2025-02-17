import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaCar, FaDollarSign, FaStar, FaArrowRight, FaClock, FaTrophy, FaShieldAlt } from 'react-icons/fa';

const Container = styled.section`
  padding: ${({ theme }) => theme.spacing.section} 0;
  background: linear-gradient(to bottom, ${({ theme }) => theme.colors.background}, ${({ theme }) => theme.colors.lightGray});
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 700px;
  margin: 0 auto ${({ theme }) => theme.spacing.xxl};
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.hero};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  background: ${({ theme }) => theme.colors.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.xl};
`;

const CategoryCard = styled(Link)`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.xxl};
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  transition: ${({ theme }) => theme.transition.default};
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ theme }) => theme.colors.gradient};
    transform: scaleX(0);
    transition: ${({ theme }) => theme.transition.default};
  }
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
    
    &::before {
      transform: scaleX(1);
    }
    
    ${({ theme }) => `
      .icon-wrapper {
        transform: scale(1.1);
        background: ${theme.colors.gradient};
        
        svg {
          color: white;
        }
      }
      
      .arrow {
        transform: translateX(5px);
        opacity: 1;
      }
    `}
  }
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  background: ${({ theme }) => `${theme.colors.primary}15`};
  border-radius: ${({ theme }) => theme.borderRadius.round};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  transition: ${({ theme }) => theme.transition.default};
  
  svg {
    font-size: 2.5rem;
    color: ${({ theme }) => theme.colors.primary};
    transition: ${({ theme }) => theme.transition.default};
  }
`;

const CategoryTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .arrow {
    font-size: ${({ theme }) => theme.fontSizes.medium};
    opacity: 0;
    transition: ${({ theme }) => theme.transition.default};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const CategoryDescription = styled.p`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Stats = styled.div`
  margin-top: auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
`;

const Stat = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  
  .value {
    font-size: ${({ theme }) => theme.fontSizes.large};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }
  
  .label {
    font-size: ${({ theme }) => theme.fontSizes.small};
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const categories = [
  {
    id: 'new',
    title: 'New Cars',
    description: 'Explore the latest models with cutting-edge features and modern design',
    icon: <FaCar />,
    link: '/cars?category=new',
    stats: [
      { value: '2024', label: 'Models' },
      { value: '100+', label: 'Available' }
    ]
  },
  {
    id: 'budget',
    title: 'Budget Friendly',
    description: 'Find reliable cars that offer the best value for your money',
    icon: <FaDollarSign />,
    link: '/cars?category=budget',
    stats: [
      { value: '500+', label: 'Cars' },
      { value: '30%', label: 'Savings' }
    ]
  },
  {
    id: 'luxury',
    title: 'Premium Cars',
    description: 'Experience luxury and performance with top-tier vehicles',
    icon: <FaTrophy />,
    link: '/cars?category=luxury',
    stats: [
      { value: '50+', label: 'Brands' },
      { value: '4.9', label: 'Rating' }
    ]
  }
];

const FeaturedCategories: React.FC = () => {
  return (
    <Container>
      <SectionHeader>
        <Title>Find Your Perfect Match</Title>
        <Subtitle>
          Explore our carefully curated categories to find the vehicle that perfectly suits your needs and preferences
        </Subtitle>
      </SectionHeader>
      
      <CategoriesGrid>
        {categories.map((category) => (
          <CategoryCard key={category.id} to={category.link}>
            <IconWrapper className="icon-wrapper">
              {category.icon}
            </IconWrapper>
            <CategoryTitle>
              {category.title}
              <FaArrowRight className="arrow" />
            </CategoryTitle>
            <CategoryDescription>
              {category.description}
            </CategoryDescription>
            <Stats>
              {category.stats.map((stat, index) => (
                <Stat key={index}>
                  <div className="value">{stat.value}</div>
                  <div className="label">{stat.label}</div>
                </Stat>
              ))}
            </Stats>
          </CategoryCard>
        ))}
      </CategoriesGrid>
    </Container>
  );
};

export default FeaturedCategories;