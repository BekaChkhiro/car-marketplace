import React, { useEffect, useState } from 'react';
import { Car } from '../../../api/types/car.types';
import carService from '../../../api/services/carService';
import { useTranslation } from 'react-i18next';

// Import components
import CarsList from './components/CarsList';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';

// ადმინი ყველა განცხადებას ერთად იღებს და კლიენტის მხარეს ფურცლავს.
export const ADMIN_PAGE_SIZE = 1000;

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
      // უპარამეტროდ სერვერი მხოლოდ 12-ს აბრუნებს (ნაგულისხმევი გვერდის ზომა),
      // CarsList კი თვითონ პაგინირებს — ამიტომ სრული სია გვჭირდება.
      const response = await carService.getCars({ limit: ADMIN_PAGE_SIZE });
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