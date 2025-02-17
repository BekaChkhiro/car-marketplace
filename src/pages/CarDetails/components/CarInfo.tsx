import React from 'react';
import styled from 'styled-components';
import { FaGasPump, FaTachometerAlt, FaCog, FaPalette, FaRoad } from 'react-icons/fa';

const Container = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxlarge};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Price = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xxlarge};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;
`;

const KeySpecs = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
`;

const SpecItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const SpecIcon = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.5em;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SpecValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
`;

const SpecLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.secondary};
`;

const Description = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  h2 {
    font-size: ${({ theme }) => theme.fontSizes.large};
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
  
  p {
    font-size: ${({ theme }) => theme.fontSizes.medium};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.6;
  }
`;

const DetailedSpecs = styled.div`
  h2 {
    font-size: ${({ theme }) => theme.fontSizes.large};
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

const SpecsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const SpecGroup = styled.div``;

const SpecGroupTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.xs};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
`;

const SpecRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  
  &:last-child {
    border-bottom: none;
  }
`;

const SpecName = styled.span`
  color: ${({ theme }) => theme.colors.secondary};
`;

const SpecDetail = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
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
        <Title>
          {car.year} {car.make} {car.model}
        </Title>
        <Price>${car.price.toLocaleString()}</Price>
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