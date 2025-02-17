import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaGasPump, FaTachometerAlt, FaCog, FaArrowRight, FaHeart, FaClock } from 'react-icons/fa';
import data from '../../../data/cars.json';

const Container = styled.section`
  padding: ${({ theme }) => theme.spacing.section} 0;
  background: linear-gradient(to bottom, ${({ theme }) => theme.colors.background}, ${({ theme }) => theme.colors.lightGray}15);
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.xl};
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
    text-align: center;
  }
`;

const HeaderContent = styled.div`
  max-width: 600px;
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xxlarge};
  background: ${({ theme }) => theme.colors.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

const ViewAll = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  border: 2px solid ${({ theme }) => theme.colors.primary}30;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  transition: ${({ theme }) => theme.transition.default};
  
  svg {
    transition: ${({ theme }) => theme.transition.default};
  }
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary}10;
    transform: translateY(-2px);
    
    svg {
      transform: translateX(4px);
    }
  }
`;

const CarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
`;

const CarCard = styled(Link)`
  position: relative;
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  overflow: hidden;
  transition: ${({ theme }) => theme.transition.default};
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
    
    .car-image {
      transform: scale(1.05);
    }
    
    .arrow-icon {
      transform: translateX(4px);
      opacity: 1;
    }
  }
`;

const ImageContainer = styled.div`
  position: relative;
  padding-top: 66.67%; // 3:2 aspect ratio
  overflow: hidden;
`;

const CarImage = styled.div<{ imageUrl: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
  transition: ${({ theme }) => theme.transition.default};
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.default};
  z-index: 1;
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
  
  &:hover {
    transform: scale(1.1);
    background: white;
  }
`;

const NewBadge = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md};
  left: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  background: ${({ theme }) => theme.colors.gradient};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  z-index: 1;
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const CarInfo = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
`;

const CarHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CarTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  
  .arrow-icon {
    font-size: ${({ theme }) => theme.fontSizes.medium};
    opacity: 0;
    transition: ${({ theme }) => theme.transition.default};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Price = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  background: ${({ theme }) => theme.colors.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const Specifications = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const Spec = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
    font-size: ${({ theme }) => theme.fontSizes.large};
  }
`;

const SpecValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.text};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const SpecLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.secondary};
`;

const NewAdditions: React.FC = () => {
  // Get latest 4 cars from mock data
  const newCars = data.cars.slice(0, 4);

  return (
    <Container>
      <ContentWrapper>
        <SectionHeader>
          <HeaderContent>
            <Title>Latest Additions</Title>
            <Subtitle>
              Discover our newest vehicles added to the marketplace
            </Subtitle>
          </HeaderContent>
          <ViewAll to="/cars?sort=newest">
            View All Listings <FaArrowRight />
          </ViewAll>
        </SectionHeader>

        <CarsGrid>
          {newCars.map((car) => (
            <CarCard key={car.id} to={`/cars/${car.id}`}>
              <ImageContainer>
                <CarImage className="car-image" imageUrl={car.images[0]} />
                <NewBadge>
                  <FaClock /> Just Added
                </NewBadge>
                <FavoriteButton onClick={(e) => {
                  e.preventDefault();
                  // Add favorite functionality here
                }}>
                  <FaHeart />
                </FavoriteButton>
              </ImageContainer>

              <CarInfo>
                <CarHeader>
                  <CarTitle>
                    {car.year} {car.make} {car.model}
                    <FaArrowRight className="arrow-icon" />
                  </CarTitle>
                  <Price>${car.price.toLocaleString()}</Price>
                </CarHeader>

                <Specifications>
                  <Spec>
                    <FaGasPump />
                    <SpecValue>{car.specifications.fuelType}</SpecValue>
                    <SpecLabel>Fuel Type</SpecLabel>
                  </Spec>
                  <Spec>
                    <FaTachometerAlt />
                    <SpecValue>{car.specifications.mileage}km</SpecValue>
                    <SpecLabel>Mileage</SpecLabel>
                  </Spec>
                  <Spec>
                    <FaCog />
                    <SpecValue>{car.specifications.transmission}</SpecValue>
                    <SpecLabel>Trans.</SpecLabel>
                  </Spec>
                </Specifications>
              </CarInfo>
            </CarCard>
          ))}
        </CarsGrid>
      </ContentWrapper>
    </Container>
  );
};

export default NewAdditions;