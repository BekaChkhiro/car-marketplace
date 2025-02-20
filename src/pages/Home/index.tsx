import React from 'react';
import styled from 'styled-components';
import HeroSection from './components/HeroSection';
import NewAdditions from './components/NewAdditions';
import FeaturedSlider from './components/FeaturedSlider';
import VerticalSearchFilter from '../../components/VerticalSearchFilter';
import VipListings from './components/VipListings';

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
      <VipListings />
      <NewAdditions />
    </HomeContainer>
  );
};

export default Home;