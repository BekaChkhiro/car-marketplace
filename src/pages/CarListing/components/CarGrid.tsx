import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaGasPump, FaTachometerAlt, FaCog, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg} 0;
`;

const CarCard = styled(Link)`
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  overflow: hidden;
  transition: ${({ theme }) => theme.transition.default};
  position: relative;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: ${({ theme }) => theme.shadows.xl};

    img {
      transform: scale(1.05);
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

const VipBadge = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.gradient};
  color: white;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSizes.small};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  backdrop-filter: blur(4px);
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md};
  left: ${({ theme }) => theme.spacing.md};
  background: rgba(255, 255, 255, 0.9);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.default};
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
    font-size: ${({ theme }) => theme.fontSizes.large};
  }
  
  &:hover {
    background: white;
    transform: scale(1.1);
  }
`;

const CarInfo = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.fontSizes.small};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Price = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  background: ${({ theme }) => theme.colors.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Specifications = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const Spec = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.secondary};
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
    font-size: ${({ theme }) => theme.fontSizes.medium};
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
            <FavoriteButton onClick={(e) => {
              e.preventDefault();
              // Add favorite functionality here
            }}>
              <FaHeart />
            </FavoriteButton>
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