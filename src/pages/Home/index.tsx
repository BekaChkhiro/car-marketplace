import React from 'react';
import styled from 'styled-components';
import HeroSection from './components/HeroSection';
import NewAdditions from './components/NewAdditions';
import VipListings from './components/VipListings';
import AdvertisementDisplay from '../../components/Advertisement/AdvertisementDisplay';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  @media (min-width: 640px) {
    gap: ${({ theme }) => theme.spacing.lg};
  }
  @media (min-width: 768px) {
    gap: ${({ theme }) => theme.spacing.xl};
  }
  padding-bottom: ${({ theme }) => theme.spacing.xl};
  @media (min-width: 768px) {
    padding-bottom: ${({ theme }) => theme.spacing.xxl};
  }
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
`;

const Home: React.FC = () => {
  return (
    <HomeContainer>
      <HeroSection />
      <AdvertisementDisplay 
        placement="home_banner" 
        className="w-[95%] sm:w-[90%] md:w-full h-36 sm:h-40 md:h-48 lg:h-64 mx-auto my-4 sm:my-6 rounded-lg shadow-md" 
      />
      <VipListings />
      <NewAdditions />
    </HomeContainer>
  );
};

export default Home;