import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import ImageGallery from './components/ImageGallery';
import CarInfo from './components/CarInfo';
import SellerInfo from './components/SellerInfo';
import SimilarCars from './components/SimilarCars';
import data from '../../data/cars.json';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const Breadcrumbs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    &:hover {
      text-decoration: underline;
    }
  }
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const CarDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<any>(null);
  const [similarCars, setSimilarCars] = useState<any[]>([]);

  useEffect(() => {
    // Find the car from our mock data
    const selectedCar = data.cars.find(c => c.id === id);
    if (selectedCar) {
      setCar(selectedCar);
      
      // Find similar cars (same make or price range)
      const similar = data.cars
        .filter(c => 
          c.id !== id && 
          (c.make === selectedCar.make || 
           Math.abs(c.price - selectedCar.price) < 5000)
        )
        .slice(0, 3);
      setSimilarCars(similar);
    }
  }, [id]);

  if (!car) {
    return <div>Loading...</div>;
  }

  return (
    <PageContainer>
      <Breadcrumbs>
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/cars">Cars</Link>
        <span>/</span>
        <span>{car.year} {car.make} {car.model}</span>
      </Breadcrumbs>

      <MainContent>
        <div>
          <ImageGallery images={car.images} />
          <CarInfo car={car} />
        </div>
        
        <div>
          <SellerInfo seller={car.seller} />
        </div>
      </MainContent>

      <SimilarCars cars={similarCars} />
    </PageContainer>
  );
};

export default CarDetails;