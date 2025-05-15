import React, { useEffect, useState } from 'react';
import { Car, Category } from '../../../api/types/car.types';
import carService from '../../../api/services/carService';
import { Container } from '../../../components/ui';
import CarCard from '../../../components/CarCard';
import { useToast } from '../../../context/ToastContext';

const NewAdditions: React.FC = () => {
  const [newCars, setNewCars] = useState<Car[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories first
        const categoriesData = await carService.getCategories();
        console.log('NewAdditions - Fetched categories:', categoriesData);
        setCategories(categoriesData);
        
        // Then fetch cars
        const response = await carService.getCars({});
        console.log('NewAdditions - Fetched cars:', response);
        
        // Sort by created_at and take the latest 4 cars
        const sortedCars = response.cars
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 4);
        setNewCars(sortedCars);
        
        // Log category IDs for debugging
        if (sortedCars.length > 0) {
          console.log('NewAdditions - Car category IDs:', sortedCars.map(car => ({ 
            id: car.id, 
            category_id: car.category_id, 
            type: typeof car.category_id 
          })));
        }
      } catch (error) {
        console.error('Error fetching new cars or categories:', error);
        showToast('Failed to load new cars', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showToast]);

  if (loading || newCars.length === 0) {
    return null;
  }

  return (
    <section className="py-4 sm:py-8 md:py-12 bg-gray-50">
      <Container className="px-1 sm:px-4">
        <div className="space-y-6 sm:space-y-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center">ახალი დამატებები</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 sm:gap-3 md:gap-5 lg:gap-7">
            {newCars.map((car) => (
              <CarCard key={car.id} car={car} categories={categories} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default NewAdditions;