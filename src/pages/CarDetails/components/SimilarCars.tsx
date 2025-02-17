import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaGasPump, FaTachometerAlt, FaCog, FaArrowRight, FaHeart } from 'react-icons/fa';

const Container = styled.section`
  padding: ${({ theme }) => theme.spacing.section} 0;
  background: linear-gradient(to bottom, transparent, ${({ theme }) => theme.colors.lightGray}40);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  margin-top: ${({ theme }) => theme.spacing.xxl};
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 700px;
  margin: 0 auto ${({ theme }) => theme.spacing.xxl};
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xxlarge};
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

const CarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  padding: 0 ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
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
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.default};
  z-index: 1;
  
  &:hover {
    transform: scale(1.1);
    background: white;
  }
`;

const CarInfo = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
`;

const CarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CarTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  .arrow-icon {
    font-size: ${({ theme }) => theme.fontSizes.medium};
    opacity: 0;
    transition: ${({ theme }) => theme.transition.default};
  }
`;

const Price = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  background: ${({ theme }) => theme.colors.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Specifications = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const Spec = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  text-align: center;
  
  svg {
    font-size: ${({ theme }) => theme.fontSizes.large};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const SpecValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const SpecLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.secondary};
`;

const NoResults = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.secondary};
  
  h3 {
    font-size: ${({ theme }) => theme.fontSizes.xlarge};
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
  
  p {
    font-size: ${({ theme }) => theme.fontSizes.medium};
    line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  }
`;

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  images: string[];
  specifications: {
    fuelType: string;
    transmission: string;
    mileage: number;
  };
}

interface SimilarCarsProps {
  cars: Car[];
}

const SimilarCars: React.FC<SimilarCarsProps> = ({ cars }) => {
  if (!cars.length) {
    return (
      <NoResults>
        <h3>No Similar Cars Found</h3>
        <p>We couldn't find any similar cars at the moment. Please check back later.</p>
      </NoResults>
    );
  }

  return (
    <Container>
      <SectionHeader>
        <Title>Similar Cars You Might Like</Title>
        <Subtitle>
          Explore more vehicles that match your preferences and requirements
        </Subtitle>
      </SectionHeader>

      <CarsGrid>
        {cars.map((car) => (
          <CarCard key={car.id} to={`/cars/${car.id}`}>
            <ImageContainer>
              <CarImage className="car-image" imageUrl={car.images[0]} />
              <FavoriteButton onClick={(e) => {
                e.preventDefault();
                // Add favorite functionality here
              }}>
                <FaHeart />
              </FavoriteButton>
            </ImageContainer>
            
            <CarInfo>
              <CarHeader>
                <div>
                  <CarTitle>
                    {car.year} {car.make} {car.model}
                    <FaArrowRight className="arrow-icon" />
                  </CarTitle>
                </div>
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
                  <SpecValue>{car.specifications.mileage.toLocaleString()}km</SpecValue>
                  <SpecLabel>Mileage</SpecLabel>
                </Spec>
                <Spec>
                  <FaCog />
                  <SpecValue>{car.specifications.transmission}</SpecValue>
                  <SpecLabel>Transmission</SpecLabel>
                </Spec>
              </Specifications>
            </CarInfo>
          </CarCard>
        ))}
      </CarsGrid>
    </Container>
  );
};

export default SimilarCars;