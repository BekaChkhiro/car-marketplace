import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car } from '../../../api/types/car.types';
import carService from '../../../api/services/carService';
import { useAuth } from '../../../context/AuthContext';
import CarCard from '../../../components/CarCard';
import { Button, Container, Grid, Loading } from '../../../components/ui';
import { Plus, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

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
    <section className="w-full px-4 py-8 bg-gradient-to-b from-gray-50/15 to-background">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r text-primary">ჩემი განცხადებები</h2>
            <p className="text-gray-600">მართეთ თქვენი გამოქვეყნებული განცხადებები</p>
          </div>
          <Button 
            onClick={() => navigate('/profile/add-car')}
            className="flex items-center gap-2 px-6 py-3 transition-all duration-300 hover:-translate-y-0.5"
          >
            <Plus size={18} />
            ახალი განცხადება
          </Button>
        </div>

        {cars.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-sm p-12 text-center my-8">
            <img 
              src="/assets/images/empty-cars.svg" 
              alt="No cars" 
              className="w-48 h-48 mb-6 opacity-80"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://placehold.co/200x200?text=No+Cars';
              }}
            />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">თქვენ ჯერ არ გაქვთ განცხადებები</h3>
            <p className="text-gray-600 mb-6 max-w-md">დაამატეთ თქვენი პირველი განცხადება და გაყიდეთ თქვენი ავტომობილი სწრაფად</p>
            <Button 
              onClick={() => navigate('/profile/add-car')}
              className="flex items-center gap-2 px-6 py-3 transition-all duration-300 hover:-translate-y-0.5"
            >
              <Plus size={18} />
              პირველი განცხადების დამატება
            </Button>
          </div>
        ) : (
          <div className="mt-6">
            <Grid className="gap-8">
              {cars.map((car) => (
                <CarCard 
                  key={car.id} 
                  car={car} 
                  isOwner={true}
                  onDelete={() => handleDeleteCar(car.id)}
                />
              ))}
            </Grid>
          </div>
        )}
      </Container>
    </section>
  );
};

export default UserCars;
