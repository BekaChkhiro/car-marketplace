import React, { useEffect, useState } from 'react';
import { Car, Category } from '../../../../api/types/car.types';
import carService from '../../../../api/services/carService';
import { Container, Loading } from '../../../../components/ui';
import CarGrid from '../../../CarListing/components/CarGrid';
import { useToast } from '../../../../context/ToastContext';

const Favorites: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [favoritesResponse, categoriesResponse] = await Promise.all([
          carService.getFavorites(),
          carService.getCategories()
        ]);
        setCars(favoritesResponse);
        setCategories(categoriesResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
        showToast('Failed to load favorites', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showToast]);

  if (loading) {
    return <Loading />;
  }

  if (cars.length === 0) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Favorites Yet</h2>
          <p className="text-gray-500">Start adding cars to your favorites to see them here.</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        <h1 className="text-2xl font-bold mb-6">My Favorites</h1>
        <CarGrid cars={cars} categories={categories} />
      </div>
    </Container>
  );
};

export default Favorites;