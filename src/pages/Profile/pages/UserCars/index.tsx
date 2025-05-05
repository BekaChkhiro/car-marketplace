import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car } from '../../../../api/types/car.types';
import carService from '../../../../api/services/carService';
import { useAuth } from '../../../../context/AuthContext';
import { Button, Container, Loading } from '../../../../components/ui';
import { Plus, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '../../../../context/ToastContext';
import EmptyState from './components/EmptyState';
import UserCarsList from './components/UserCarsList';

const UserCars: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchUserCars = async () => {
      try {
        console.log('Fetching user cars...');
        const userCars = await carService.getUserCars();
        console.log('User cars received:', userCars);
        setCars(userCars);
        if (userCars.length === 0) {
          console.log('No user cars found, but no error occurred');
        }
      } catch (err) {
        console.error('Error fetching user cars:', err);
        setError('Failed to load your cars');
      } finally {
        setLoading(false);
      }
    };

    fetchUserCars();
  }, []);

  const handleDeleteCar = async (carId: number) => {
    try {
      await carService.deleteCar(carId);
      setCars(prevCars => prevCars.filter(car => car.id !== carId));
      showToast('განცხადება წარმატებით წაიშალა', 'success');
    } catch (err) {
      console.error('Failed to delete car:', err);
      showToast('განცხადების წაშლა ვერ მოხერხდა', 'error');
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loading />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} />
            სცადეთ თავიდან
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <section className="w-full px-3 sm:px-4 py-4 sm:py-6 md:py-8 bg-gradient-to-b from-blue-50/50 to-white">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 sm:mb-6 md:mb-8 gap-3 sm:gap-4">
          <div className="w-full md:w-auto text-center md:text-left mb-3 md:mb-0">
            <h2 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-primary">ჩემი განცხადებები</h2>
            <p className="text-sm sm:text-base text-gray-600">მართეთ თქვენი გამოქვეყნებული განცხადებები</p>
          </div>
          <Button 
            onClick={() => navigate('/profile/add-car')}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all duration-300 hover:shadow-md"
          >
            <Plus size={18} />
            ახალი განცხადება
          </Button>
        </div>

        {cars.length === 0 ? (
          <EmptyState />
        ) : (
          <UserCarsList cars={cars} onDelete={handleDeleteCar} />
        )}
      </Container>
    </section>
  );
};

export default UserCars;