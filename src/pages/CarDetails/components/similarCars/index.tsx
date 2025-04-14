import React, { useEffect, useState } from 'react';
import carService from '../../../../api/services/carService';
import { Car, Category } from '../../../../api/types/car.types';
import { useToast } from '../../../../context/ToastContext';
import CarGrid from './components/CarGrid';

interface SimilarCarsProps {
  carId: string;
  category: string;
}

const SimilarCars: React.FC<SimilarCarsProps> = ({ carId, category }) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carsResponse, categoriesResponse] = await Promise.all([
          carService.getCars({
            category,
            limit: 4,
            excludeId: carId
          }),
          carService.getCategories()
        ]);
        setCars(carsResponse);
        setCategories(categoriesResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
        showToast('Failed to load similar cars', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [carId, category, showToast]);

  if (loading || cars.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Similar Cars</h2>
      <CarGrid cars={cars} categories={categories} />
    </div>
  );
};

export default SimilarCars;