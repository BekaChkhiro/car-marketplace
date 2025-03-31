import React, { useEffect, useState } from 'react';
import { Car } from '../../../../api/types/car.types';
import carService from '../../../../api/services/carService';
import { Container, Loading } from '../../../../components/ui';
import CarGrid from '../../../CarListing/components/CarGrid';
import { useToast } from '../../../../context/ToastContext';

const Favorites: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await carService.getFavoriteCars();
        setCars(response);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        showToast('Failed to load favorites', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [showToast]);

  if (loading) {
    return <Loading />;
  }

  if (cars.length === 0) {
    return (
      <Container>
        <div className="py-8">
          <p className="text-center text-gray-500">No favorite cars yet</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        <h1 className="text-2xl font-bold mb-6">My Favorites</h1>
        <CarGrid cars={cars} />
      </div>
    </Container>
  );
};

export default Favorites;