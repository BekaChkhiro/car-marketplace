import React, { useEffect, useState } from 'react';
import { Car } from '../../../api/types/car.types';
import carService from '../../../api/services/carService';
import { Container } from '../../../components/ui';
import CarCard from '../../../components/CarCard';
import { useToast } from '../../../context/ToastContext';

const NewAdditions: React.FC = () => {
  const [newCars, setNewCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchNewCars = async () => {
      try {
        // We don't need any filters for this case
        const response = await carService.getCars({});
        // Sort by created_at and take the latest 4 cars
        const sortedCars = response
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 4);
        setNewCars(sortedCars);
      } catch (error) {
        console.error('Error fetching new cars:', error);
        showToast('Failed to load new cars', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchNewCars();
  }, [showToast]);

  if (loading || newCars.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50">
      <Container>
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-center">ახალი დამატებები</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {newCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default NewAdditions;