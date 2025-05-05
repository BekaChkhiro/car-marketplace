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
    return (
      <Container>
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loading />
        </div>
      </Container>
    );
  }

  if (cars.length === 0) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
          <div className="w-20 h-20 mb-4 text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">ფავორიტები ცარიელია</h2>
          <p className="text-gray-500 max-w-md">დაამატეთ მანქანები ფავორიტებში, რომ ნახოთ ისინი აქ.</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-4 sm:py-6 md:py-8">
        <h1 className="text-2xl font-bold mb-3 sm:mb-6 px-2 sm:px-0">ჩემი ფავორიტები</h1>
        <CarGrid cars={cars} categories={categories} />
      </div>
    </Container>
  );
};

export default Favorites;