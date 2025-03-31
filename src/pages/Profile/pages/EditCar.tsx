import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Car, UpdateCarFormData } from '../../../api/types/car.types';
import carService from '../../../api/services/carService';
import { Button, Container, Loading } from '../../../components/ui';

const EditCar: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        if (!id) return;
        const carData = await carService.getCar(Number(id));
        setCar(carData);
      } catch (err) {
        setError('Failed to load car details');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  const handleSubmit = async (data: UpdateCarFormData) => {
    try {
      if (!id || !car) return;
      await carService.updateCar(Number(id), data);
      navigate('/profile/cars');
    } catch (err) {
      setError('Failed to update car');
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !car) {
    return (
      <Container>
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error || 'Car not found'}</p>
          <Button onClick={() => navigate('/profile/cars')}>
            Back to My Cars
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Edit Car</h1>
          <Button 
            variant="outline"
            onClick={() => navigate('/profile/cars')}
          >
            Cancel
          </Button>
        </div>

        {/* TODO: Add CarForm component with car data */}
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">Car form will be added here</p>
        </div>
      </div>
    </Container>
  );
};

export default EditCar;
