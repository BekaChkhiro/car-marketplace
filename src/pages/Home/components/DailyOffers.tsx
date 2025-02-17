import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaGasPump, FaTachometerAlt, FaCog, FaTag, FaHeart, FaArrowRight, FaClock } from 'react-icons/fa';
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
  text-align: center;
  max-width: 700px;
  margin: 0 auto ${({ theme }) => theme.spacing.xxl};
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.hero};
  background: ${({ theme }) => theme.colors.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

const Timer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const TimeUnit = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ theme }) => theme.colors.cardBg};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  min-width: 80px;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  
  .value {
    font-size: ${({ theme }) => theme.fontSizes.xxlarge};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.primary};
  }
  
  .label {
    font-size: ${({ theme }) => theme.fontSizes.small};
    color: ${({ theme }) => theme.colors.secondary};
    text-transform: uppercase;
  }
`;

const OffersContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const OfferCard = styled(Link)`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  overflow: hidden;
  transition: ${({ theme }) => theme.transition.default};
  position: relative;
  
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
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
`;

const OfferImage = styled.div<{ imageUrl: string }>`
  width: 100%;
  height: 100%;
  min-height: 300px;
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
  transition: ${({ theme }) => theme.transition.default};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    height: 250px;
  }
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

const OfferInfo = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
`;

const OfferTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
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

const OfferPriceContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const OfferPrice = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const CurrentPrice = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xxlarge};
  background: ${({ theme }) => theme.colors.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const OldPrice = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.secondary};
  text-decoration: line-through;
`;

const SaveAmount = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.success};
`;

const Discount = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md};
  left: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.gradient};
  color: white;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  z-index: 1;
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const Specifications = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: auto;
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
      <ContentWrapper>
        <SectionHeader>
          <Title>Daily Special Offers</Title>
          <Subtitle>
            Don't miss out on these exclusive deals. Limited time offers on premium vehicles.
          </Subtitle>
          <Timer>
            <TimeUnit>
              <span className="value">23</span>
              <span className="label">Hours</span>
            </TimeUnit>
            <TimeUnit>
              <span className="value">45</span>
              <span className="label">Minutes</span>
            </TimeUnit>
            <TimeUnit>
              <span className="value">59</span>
              <span className="label">Seconds</span>
            </TimeUnit>
          </Timer>
        </SectionHeader>

        <OffersContainer>
          {offerCars.map((car) => (
            <OfferCard key={car.id} to={`/cars/${car.id}`}>
              <ImageContainer>
                <OfferImage className="car-image" imageUrl={car.images[0]} />
                <Discount>
                  <FaTag /> {car.discount}% OFF
                </Discount>
                <FavoriteButton onClick={(e) => {
                  e.preventDefault();
                  // Add favorite functionality here
                }}>
                  <FaHeart />
                </FavoriteButton>
              </ImageContainer>

              <OfferInfo>
                <OfferTitle>
                  {car.year} {car.make} {car.model}
                  <FaArrowRight className="arrow-icon" />
                </OfferTitle>

                <OfferPriceContainer>
                  <OfferPrice>
                    <CurrentPrice>${car.price.toLocaleString()}</CurrentPrice>
                    <OldPrice>${car.oldPrice.toLocaleString()}</OldPrice>
                  </OfferPrice>
                  <SaveAmount>
                    You save ${(car.oldPrice - car.price).toLocaleString()}
                  </SaveAmount>
                </OfferPriceContainer>

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
              </OfferInfo>
            </OfferCard>
          ))}
        </OffersContainer>
      </ContentWrapper>
    </Container>
  );
};

export default DailyOffers;