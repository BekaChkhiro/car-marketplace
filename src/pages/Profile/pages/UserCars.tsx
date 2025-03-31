import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car } from '../../../api/types/car.types';
import carService from '../../../api/services/carService';
import { useAuth } from '../../../context/AuthContext';
import CarCard from '../../../components/CarCard';
import { Button, Container, Grid, Loading } from '../../../components/ui';

const UserCars: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserCars = async () => {
      try {
        const userCars = await carService.getUserCars();
        setCars(userCars);
      } catch (err) {
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
    } catch (err) {
      // TODO: Add proper error handling with toast notification
      console.error('Failed to delete car:', err);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Container>
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Cars</h1>
          <Button onClick={() => navigate('/profile/add-car')}>
            Add New Car
          </Button>
        </div>

        {cars.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">You haven't listed any cars yet.</p>
            <Button onClick={() => navigate('/profile/add-car')}>
              List Your First Car
            </Button>
          </div>
        ) : (
          <Grid>
            {cars.map((car) => (
              <CarCard 
                key={car.id} 
                car={car} 
                isOwner={true}
                onDelete={() => handleDeleteCar(car.id)}
              />
            ))}
          </Grid>
        )}
      </div>
    </Container>
  );
};

export default UserCars;
