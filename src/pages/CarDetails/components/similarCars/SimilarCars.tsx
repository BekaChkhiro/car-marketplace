import React, { useEffect, useState } from 'react';
import carService from '../../../../api/services/carService';
import { Car } from '../../../../api/types/car.types';
import { useToast } from '../../../../context/ToastContext';
import CarGrid from './components/CarGrid';
import EmptyState from './components/EmptyState';

interface SimilarCarsProps {
  carId: string;
  category: string;
}

const SimilarCars: React.FC<SimilarCarsProps> = ({ carId, category }) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchSimilarCars = async () => {
      try {
        const filters = {
          category,
          limit: 4,
          excludeId: carId
        };
        const response = await carService.getCars(filters);
        setCars(response.cars);
      } catch (error) {
        console.error('Error fetching similar cars:', error);
        showToast('Failed to load similar cars', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarCars();
  }, [carId, category, showToast]);

  if (loading || cars.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Similar Cars</h2>
        <CarGrid cars={cars} />
      </div>
    </div>
  );
};

export default SimilarCars;