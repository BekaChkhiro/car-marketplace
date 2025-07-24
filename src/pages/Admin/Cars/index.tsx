import React, { useEffect, useState } from 'react';
import { Car } from '../../../api/types/car.types';
import carService from '../../../api/services/carService';
import { useTranslation } from 'react-i18next';

// Import components
import CarsList from './components/CarsList';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';

const AdminCars: React.FC = () => {
  const { t } = useTranslation('admin');
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await carService.getCars();
      setCars(response.cars);
    } catch (error) {
      setError(t('cars.error'));
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCar = async (carId: string) => {
    try {
      await carService.deleteCar(Number(carId));
      setCars(prevCars => prevCars.filter(car => car.id.toString() !== carId));
    } catch (error) {
      setError(t('cars.deleteError'));
      console.error('Error deleting car:', error);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={fetchCars} />;
  }

  return <CarsList cars={cars} onDeleteCar={handleDeleteCar} />;
};

export default AdminCars;