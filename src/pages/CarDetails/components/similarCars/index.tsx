import React, { useState, useEffect } from 'react';
import carService, { CarImage } from '../../../../api/services/carService';
import EmptyState from './components/EmptyState';
import SectionHeader from './components/SectionHeader';
import CarGrid from './components/CarGrid';
import { Car } from '../../../../types/car';

interface SimilarCarsProps {
  carId: string;
  category?: string;
}

const SimilarCars: React.FC<SimilarCarsProps> = ({ carId, category }) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSimilarCars = async () => {
      try {
        setLoading(true);
        const data = await carService.getSimilarCars(carId);
        // Transform CarData array to Car array with proper type annotations
        const transformedCars = data.map((car: any) => ({
          id: car.id,
          brand_id: car.brand_id,
          category_id: car.category_id,
          make: car.brand_id?.toString() || '',
          model: car.model,
          year: car.year,
          price: car.price,
          description: car.description,
          // Transform image objects to URLs with type annotation
          images: car.images.map((img: CarImage | string) => typeof img === 'string' ? img : img.large),
          specifications: {
            fuelType: car.specifications?.fuel_type || '',
            transmission: car.specifications?.transmission || '',
            mileage: car.specifications?.mileage || 0,
            bodyType: car.specifications?.body_type as Car['specifications']['bodyType'],
            color: car.specifications?.color,
            drive: car.specifications?.drive_type,
            engine: car.specifications?.engine_type
          },
          location: {
            city: car.city || '',
            region: car.state || ''
          },
          isVip: car.isVip || false,
          seller: car.seller && {
            ...car.seller,
            phone: car.seller.phone || ''
          }
        }));
        setCars(transformedCars);
      } catch (err: any) {
        console.error('Error fetching similar cars:', err);
        setError(err.message || 'მსგავსი მანქანების ჩატვირთვა ვერ მოხერხდა');
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarCars();
  }, [carId]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-8">
          <SectionHeader />
          <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="space-y-4">
                <div className="h-48 bg-gray-200 rounded-lg"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !cars.length) {
    return <EmptyState />;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-8">
        <SectionHeader />
        <CarGrid cars={cars} />
      </div>
    </div>
  );
};

export default SimilarCars;