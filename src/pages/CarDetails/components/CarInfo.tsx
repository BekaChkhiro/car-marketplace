import React from 'react';
import styled from 'styled-components';
import { FaGasPump, FaTachometerAlt, FaCog, FaPalette, FaRoad, FaShare, FaHeart } from 'react-icons/fa';

const Container = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.large};
  padding: ${({ theme }) => theme.spacing.xxl};
  margin-bottom: ${({ theme }) => theme.spacing.section};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

const TitleGroup = styled.div`
  flex: 1;
  min-width: 280px;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.hero};
  background: ${({ theme }) => theme.colors.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const PriceGroup = styled.div`
  text-align: right;
`;

const Price = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.hero};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  line-height: 1;
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: ${({ theme }) => theme.transition.default};
  
  &.favorite {
    background-color: ${({ theme }) => theme.colors.primary}15;
    color: ${({ theme }) => theme.colors.primary};
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.primary}25;
    }
  }
  
  &.share {
    background-color: ${({ theme }) => theme.colors.secondary}15;
    color: ${({ theme }) => theme.colors.secondary};
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.secondary}25;
    }
  }
`;

const KeySpecs = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  margin: ${({ theme }) => `${theme.spacing.xxl} 0`};
  padding: ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(to right, ${({ theme }) => theme.colors.primary}08, ${({ theme }) => theme.colors.primary}15);
  border-radius: ${({ theme }) => theme.borderRadius.large};
`;

const SpecItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background: rgba(255, 255, 255, 0.8);
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  backdrop-filter: blur(8px);
  transition: ${({ theme }) => theme.transition.default};
  
  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.95);
  }
`;

const SpecIcon = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
`;

const SpecValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.text};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const SpecLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.secondary};
`;

const Description = styled.div`
  margin: ${({ theme }) => `${theme.spacing.xxl} 0`};
  
  h2 {
    font-size: ${({ theme }) => theme.fontSizes.xlarge};
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  }
  
  p {
    font-size: ${({ theme }) => theme.fontSizes.medium};
    color: ${({ theme }) => theme.colors.text};
    line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  }
`;

const DetailedSpecs = styled.div`
  h2 {
    font-size: ${({ theme }) => theme.fontSizes.xlarge};
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  }
`;

const SpecsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.xxl};
`;

const SpecGroup = styled.div`
  background: ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.xl};
`;

const SpecGroupTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const SpecRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

const SpecName = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const SpecDetail = styled.div`
  color: ${({ theme }) => theme.colors.secondary};
`;

interface CarInfoProps {
  car: {
    make: string;
    model: string;
    year: number;
    price: number;
    specifications: {
      engine: string;
      transmission: string;
      fuelType: string;
      mileage: number;
      color: string;
      drive: string;
    };
    description: string;
  };
}

const CarInfo: React.FC<CarInfoProps> = ({ car }) => {
  return (
    <Container>
      <Header>
        <TitleGroup>
          <Title>
            {car.year} {car.make} {car.model}
          </Title>
          <Actions>
            <ActionButton className="favorite">
              <FaHeart /> Save
            </ActionButton>
            <ActionButton className="share">
              <FaShare /> Share
            </ActionButton>
          </Actions>
        </TitleGroup>
        <PriceGroup>
          <Price>${car.price.toLocaleString()}</Price>
        </PriceGroup>
      </Header>

      <KeySpecs>
        <SpecItem>
          <SpecIcon><FaGasPump /></SpecIcon>
          <SpecValue>{car.specifications.fuelType}</SpecValue>
          <SpecLabel>Fuel Type</SpecLabel>
        </SpecItem>
        <SpecItem>
          <SpecIcon><FaTachometerAlt /></SpecIcon>
          <SpecValue>{car.specifications.mileage.toLocaleString()} km</SpecValue>
          <SpecLabel>Mileage</SpecLabel>
        </SpecItem>
        <SpecItem>
          <SpecIcon><FaCog /></SpecIcon>
          <SpecValue>{car.specifications.transmission}</SpecValue>
          <SpecLabel>Transmission</SpecLabel>
        </SpecItem>
        <SpecItem>
          <SpecIcon><FaPalette /></SpecIcon>
          <SpecValue>{car.specifications.color}</SpecValue>
          <SpecLabel>Color</SpecLabel>
        </SpecItem>
        <SpecItem>
          <SpecIcon><FaRoad /></SpecIcon>
          <SpecValue>{car.specifications.drive}</SpecValue>
          <SpecLabel>Drive</SpecLabel>
        </SpecItem>
      </KeySpecs>

      <Description>
        <h2>Description</h2>
        <p>{car.description}</p>
      </Description>

      <DetailedSpecs>
        <h2>Technical Specifications</h2>
        <SpecsGrid>
          <SpecGroup>
            <SpecGroupTitle>Engine & Performance</SpecGroupTitle>
            <SpecRow>
              <SpecName>Engine</SpecName>
              <SpecDetail>{car.specifications.engine}</SpecDetail>
            </SpecRow>
            <SpecRow>
              <SpecName>Transmission</SpecName>
              <SpecDetail>{car.specifications.transmission}</SpecDetail>
            </SpecRow>
            <SpecRow>
              <SpecName>Drive Type</SpecName>
              <SpecDetail>{car.specifications.drive}</SpecDetail>
            </SpecRow>
          </SpecGroup>

          <SpecGroup>
            <SpecGroupTitle>General Information</SpecGroupTitle>
            <SpecRow>
              <SpecName>Mileage</SpecName>
              <SpecDetail>{car.specifications.mileage.toLocaleString()} km</SpecDetail>
            </SpecRow>
            <SpecRow>
              <SpecName>Fuel Type</SpecName>
              <SpecDetail>{car.specifications.fuelType}</SpecDetail>
            </SpecRow>
            <SpecRow>
              <SpecName>Color</SpecName>
              <SpecDetail>{car.specifications.color}</SpecDetail>
            </SpecRow>
          </SpecGroup>
        </SpecsGrid>
      </DetailedSpecs>
    </Container>
  );
};

export default CarInfo;