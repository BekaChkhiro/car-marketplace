import React from 'react';
import styled from 'styled-components';
import HeroSection from './components/HeroSection';
import FeaturedCategories from './components/FeaturedCategories';
import NewAdditions from './components/NewAdditions';
import DailyOffers from './components/DailyOffers';
import FeaturedSlider from './components/FeaturedSlider';
import VerticalSearchFilter from '../../components/VerticalSearchFilter';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const Home: React.FC = () => {
  return (
    <HomeContainer>
      <HeroSection />
      <FeaturedSlider />
      <VerticalSearchFilter />
      <NewAdditions />
      <FeaturedCategories />
      <DailyOffers />
    </HomeContainer>
  );
};

export default Home;