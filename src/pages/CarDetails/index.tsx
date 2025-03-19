import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCarById } from '../../api/services/carService';
import { useLoading } from '../../context/LoadingContext';
import { useToast } from '../../context/ToastContext';
import CarInfo from './components/carInfo/CarInfo';
import ImageGallery from './components/imageGallery/ImageGallery';
import SellerInfo from './components/sellerInfo/SellerInfo';
import SimilarCars from './components/similarCars/index';
import { Car } from '../../types/car';

const CarDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showLoading, hideLoading } = useLoading();
  const { showToast } = useToast();
  const [car, setCar] = useState<Car | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCar = async () => {
      if (!id) return;

      try {
        showLoading();
        const data = await getCarById(id);
        // Transform CarData to Car type
        setCar({
          id: data.id,
          brand_id: data.brand_id,
          category_id: data.category_id,
          make: data.brand_id?.toString() || '',
          model: data.model,
          year: data.year,
          price: data.price,
          description: data.description,
          // Convert CarImage objects to image URLs
          images: data.images.map(img => typeof img === 'string' ? img : img.large),
          specifications: {
            fuelType: data.specifications?.fuel_type || '',
            transmission: data.specifications?.transmission || '',
            mileage: data.specifications?.mileage || 0,
            bodyType: data.specifications?.body_type as Car['specifications']['bodyType'],
            color: data.specifications?.color,
            drive: data.specifications?.drive_type || '',
            engine: data.specifications?.engine_type
          },
          location: {
            city: data.city || '',
            region: data.state || ''
          },
          isVip: data.isVip || false,
          seller: data.seller && {
            ...data.seller,
            phone: data.seller.phone || '',
            name: data.seller.name || ''
          }
        });
      } catch (err: any) {
        console.error('Error fetching car details:', err);
        setError(err.message || 'მანქანის მონაცემების ჩატვირთვა ვერ მოხერხდა');
        showToast('მანქანის მონაცემების ჩატვირთვა ვერ მოხერხდა', 'error');
      } finally {
        hideLoading();
      }
    };

    fetchCar();
  }, [id, showLoading, hideLoading, showToast]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-96 bg-gray-200 rounded-lg"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ImageGallery images={car.images} />
          <CarInfo car={car} />
        </div>
        
        <div className="space-y-8">
          <SellerInfo seller={car.seller} price={car.price} carId={car.id} />
          <SimilarCars carId={car.id} category={car.specifications.bodyType} />
        </div>
      </div>
    </div>
  );
};

export default CarDetails;