import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
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
      <VipListings />
      <div className="w-full flex justify-center my-4">
        <AdvertisementDisplay 
          placement="home_after_vip" 
          className="w-full md:w-[720px] h-[90px] md:h-[140px] rounded-lg shadow-md max-w-full overflow-hidden transition-all duration-300" 
        />
      </div>
      <NewAdditions />
    </HomeContainer>
  );
};

export default Home;