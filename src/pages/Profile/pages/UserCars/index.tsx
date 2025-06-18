import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Car } from '../../../../api/types/car.types';
import carService from '../../../../api/services/carService';
import { useAuth } from '../../../../context/AuthContext';
import { Button, Container, Loading } from '../../../../components/ui';
import { Plus, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '../../../../context/ToastContext';
import EmptyState from './components/EmptyState';
import UserCarsList from './components/UserCarsList';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../../i18n';

const UserCars: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const { t } = useTranslation([namespaces.profile, namespaces.common]);
  const { lang } = useParams<{ lang: string }>();
  
  // Get current language from URL params or use default
  const currentLang = lang || 'ka';

  const fetchUserCars = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching user cars...');
      const userCars = await carService.getUserCars();
      console.log('User cars data received:', userCars);

      // დავლოგოთ VIP სტატუსის მქონე მანქანები
      if (userCars && userCars.length > 0) {
        console.log('VIP cars count:', userCars.filter(car => car.vip_status && car.vip_status !== 'none').length);
      }
      
      // გადავცეთ სტეიტში მანქანები
      setCars(userCars);
      
      if (userCars.length === 0) {
        console.log('No user cars found');
      }
    } catch (err) {
      console.error('Error fetching user cars:', err);
      setError('Failed to load your cars');
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  // ეფექტი მანქანების სიის ჩასატვირთად
  // Debug: დავლოგოთ რა მონაცემებს ვაწვდით UserCarsList კომპონენტს
  useEffect(() => {
    if (cars.length > 0) {
      console.log('Cars data being passed to UserCarsList:', cars);
      console.log('Cars with VIP status:', cars.filter(car => car.vip_status && car.vip_status !== 'none'));
    }
  }, [cars]);

  useEffect(() => {
    fetchUserCars();
  }, []);

  const handleDeleteCar = async (carId: number) => {
    if (window.confirm(t('profile:cars.confirmDelete'))) {
      try {
        await carService.deleteCar(carId);
        fetchUserCars();
        showToast(t('profile:cars.deleteSuccess'), 'success');
      } catch (error) {
        console.error('Error deleting car:', error);
        showToast(t('profile:cars.deleteError'), 'error');
      }
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
            {t('profile:cars.tryAgain')}
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
            <h2 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2 text-primary text-left">{t('profile:cars.title')}</h2>
            <p className="text-sm sm:text-base text-gray-600 text-left">{t('profile:cars.subtitle')}</p>
          </div>
          <Button 
            onClick={() => navigate(`/${currentLang}/profile/add-car`)}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all duration-300 hover:shadow-md"
          >
            <Plus size={18} />
            {t('profile:cars.newListing')}
          </Button>
        </div>

        {cars.length === 0 ? (
          <EmptyState />
        ) : (
          <UserCarsList 
            cars={cars} 
            onDelete={handleDeleteCar} 
            onVipUpdate={fetchUserCars} 
          />
        )}
      </Container>
    </section>
  );
};

export default UserCars;