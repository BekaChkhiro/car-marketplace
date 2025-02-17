import React from 'react';
import styled from 'styled-components';
import HeroSection from './components/HeroSection';
import FeaturedCategories from './components/FeaturedCategories';
import NewAdditions from './components/NewAdditions';
import DailyOffers from './components/DailyOffers';

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
      <FeaturedCategories />
      <NewAdditions />
      <DailyOffers />
    </HomeContainer>
  );
};

export default Home;