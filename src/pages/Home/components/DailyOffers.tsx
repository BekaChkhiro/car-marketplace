import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaGasPump, FaTachometerAlt, FaCog, FaTag } from 'react-icons/fa';
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

const OffersContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const OfferCard = styled(Link)`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.large};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const OfferImage = styled.div<{ imageUrl: string }>`
  width: 100%;
  height: 100%;
  min-height: 250px;
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    height: 200px;
  }
`;

const OfferInfo = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
`;

const OfferTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const OfferPrice = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const CurrentPrice = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xxlarge};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;
`;

const OldPrice = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.secondary};
  text-decoration: line-through;
`;

const Discount = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.error};
  color: white;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-weight: bold;
`;

const Specifications = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: auto;
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
    mileage: number;
    transmission: string;
  };
}

interface OfferCar extends Car {
  oldPrice: number;
  discount: number;
}

const DailyOffers: React.FC = () => {
  // Simulate daily offers by adding discounts to the first 2 cars
  const offerCars: OfferCar[] = data.cars.slice(0, 2).map(car => ({
    ...car,
    oldPrice: car.price,
    price: Math.round(car.price * 0.85), // 15% discount
    discount: 15
  }));

  return (
    <Container>
      <SectionHeader>
        <Title>Daily Special Offers</Title>
      </SectionHeader>

      <OffersContainer>
        {offerCars.map((car) => (
          <OfferCard key={car.id} to={`/cars/${car.id}`}>
            <OfferImage imageUrl={car.images[0]} />
            <OfferInfo>
              <OfferTitle>{car.year} {car.make} {car.model}</OfferTitle>
              <OfferPrice>
                <CurrentPrice>${car.price.toLocaleString()}</CurrentPrice>
                <OldPrice>${car.oldPrice.toLocaleString()}</OldPrice>
              </OfferPrice>
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
              <Discount>
                <FaTag /> {car.discount}% OFF
              </Discount>
            </OfferInfo>
          </OfferCard>
        ))}
      </OffersContainer>
    </Container>
  );
};

export default DailyOffers;