import React from 'react';
import styled from 'styled-components';
import HeroSection from './components/HeroSection';
import NewAdditions from './components/NewAdditions';
import VipListings from './components/VipListings';
import AdvertisementDisplay from '../../components/Advertisement/AdvertisementDisplay';

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
      <AdvertisementDisplay placement="home_banner" className="w-full h-48 md:h-64 my-6 rounded-lg shadow-md" />
      <VipListings />
      <NewAdditions />
    </HomeContainer>
  );
};

export default Home;