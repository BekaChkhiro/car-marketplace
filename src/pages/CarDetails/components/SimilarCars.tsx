import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaGasPump, FaTachometerAlt, FaCog } from 'react-icons/fa';

const Container = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const CarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const CarCard = styled(Link)`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.large};
  }
`;

const ImageContainer = styled.div`
  position: relative;
  padding-top: 66.67%; // 3:2 aspect ratio
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
`;

const CarInfo = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const CarTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Price = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Specifications = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.lightGray};
`;

const Spec = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.secondary};
`;

const NoResults = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.fontSizes.large};
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
    return null;
  }

  return (
    <Container>
      <Title>Similar Cars You Might Like</Title>
      <CarsGrid>
        {cars.map((car) => (
          <CarCard key={car.id} to={`/cars/${car.id}`}>
            <ImageContainer>
              <CarImage imageUrl={car.images[0]} />
            </ImageContainer>
            
            <CarInfo>
              <CarTitle>
                {car.year} {car.make} {car.model}
              </CarTitle>
              <Price>${car.price.toLocaleString()}</Price>
              
              <Specifications>
                <Spec>
                  <FaGasPump />
                  {car.specifications.fuelType}
                </Spec>
                <Spec>
                  <FaTachometerAlt />
                  {car.specifications.mileage}km
                </Spec>
                <Spec>
                  <FaCog />
                  {car.specifications.transmission}
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