import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ImageGallery from './components/imageGallery/ImageGallery';
import CarInfo from './components/carInfo/CarInfo';
import SellerInfo from './components/sellerInfo/SellerInfo';
import SimilarCars from './components/similarCars/SimilarCars';
import { getCarById, getSimilarCars } from '../../api/services/carService';
import { useLoading } from '../../context/LoadingContext';
import { useToast } from '../../context/ToastContext';

const CarDetails = () => {
  const { id } = useParams();
  const { showLoading, hideLoading } = useLoading();
  const { showToast } = useToast();
  
  const [car, setCar] = useState<any>(null);
  const [similarCars, setSimilarCars] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (id) {
      fetchCarDetails();
    }
  }, [id]);

  const fetchCarDetails = async () => {
    if (!id) return;
    
    try {
      showLoading();
      setIsLoading(true);

      // ძირითადი მანქანის დეტალების წამოღება
      const carData = await getCarById(id);
      setCar(carData);

      // მსგავსი მანქანების წამოღება
      const similarData = await getSimilarCars(id, 3);
      setSimilarCars(similarData);
    } catch (error: any) {
      showToast(error.message || 'მანქანის დეტალების ჩატვირთვა ვერ მოხერხდა', 'error');
    } finally {
      hideLoading();
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-dark mb-4">მანქანა ვერ მოიძებნა</h2>
          <Link to="/cars" className="text-primary hover:underline">
            დაბრუნდი მანქანების სიაში
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 py-6 space-y-6">
        {/* Breadcrumbs */}
        <nav className="flex flex-wrap items-center space-x-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-gray-700 transition-colors">მთავარი</Link>
          <span>/</span>
          <Link to="/cars" className="hover:text-gray-700 transition-colors">მანქანები</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">{car.make} {car.model} {car.year}</span>
        </nav>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[3.5fr,1.5fr] gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <ImageGallery images={car.images} />
            <CarInfo car={car} />
          </div>
          
          {/* Right Column */}
          <div>
            <SellerInfo 
              seller={car.seller} 
              price={car.price}
              carId={car.id}
            />
          </div>
        </div>

        {/* Similar Cars */}
        <SimilarCars cars={similarCars} />
      </div>
    </div>
  );
};

export default CarDetails;