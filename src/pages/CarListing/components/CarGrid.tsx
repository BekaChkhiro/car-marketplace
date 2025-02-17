import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaGasPump, FaTachometerAlt, FaCog, FaMapMarkerAlt } from 'react-icons/fa';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
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

const VipBadge = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm};
  right: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSizes.small};
`;

const CarInfo = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.fontSizes.small};
  margin-bottom: ${({ theme }) => theme.spacing.md};
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
  location: {
    city: string;
    region: string;
  };
  isVip: boolean;
}

interface CarGridProps {
  cars: Car[];
}

const CarGrid: React.FC<CarGridProps> = ({ cars }) => {
  return (
    <Grid>
      {cars.map((car) => (
        <CarCard key={car.id} to={`/cars/${car.id}`}>
          <ImageContainer>
            <CarImage imageUrl={car.images[0]} />
            {car.isVip && <VipBadge>VIP</VipBadge>}
          </ImageContainer>
          
          <CarInfo>
            <Title>{car.year} {car.make} {car.model}</Title>
            <Location>
              <FaMapMarkerAlt />
              {car.location.city}, {car.location.region}
            </Location>
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
    </Grid>
  );
};

export default CarGrid;