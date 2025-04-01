import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import carService from '../../api/services/carService';
import { Car } from '../../api/types/car.types';
import { Container, Loading } from '../../components/ui';
import CarInfo from './components/carInfo/CarInfo';
import SimilarCars from './components/similarCars';
import { useToast } from '../../context/ToastContext';

const CarDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchCar = async () => {
      try {
        if (!id) return;
        const data = await carService.getCar(Number(id));
        setCar(data);
      } catch (error) {
        console.error('Error fetching car:', error);
        showToast('Failed to load car details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id, showToast]);

  if (loading) {
    return <Loading />;
  }

  if (!car) {
    return (
      <Container>
        <div className="py-8">
          <p className="text-center text-gray-500">Car not found</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        <CarInfo car={car} />
        <SimilarCars carId={car.id.toString()} category={car.category_id.toString()} />
      </div>
    </Container>
  );
};

export default CarDetails;