import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaGasPump, FaTachometerAlt, FaCog } from 'react-icons/fa';
import data from '../../../data/cars.json';

const Container = styled.section`
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xxlarge};
  color: ${({ theme }) => theme.colors.text};
`;

const ViewAll = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  
  &:hover {
    text-decoration: underline;
  }
`;

const CarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
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

const CarImage = styled.div<{ imageUrl: string }>`
  width: 100%;
  height: 200px;
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
`;

const CarInfo = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
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

const NewAdditions: React.FC = () => {
  // Get latest 4 cars from mock data
  const newCars = data.cars.slice(0, 4);

  return (
    <Container>
      <SectionHeader>
        <Title>New Additions</Title>
        <ViewAll to="/cars?sort=newest">View All</ViewAll>
      </SectionHeader>

      <CarsGrid>
        {newCars.map((car) => (
          <CarCard key={car.id} to={`/cars/${car.id}`}>
            <CarImage imageUrl={car.images[0]} />
            <CarInfo>
              <CarTitle>{car.year} {car.make} {car.model}</CarTitle>
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

export default NewAdditions;