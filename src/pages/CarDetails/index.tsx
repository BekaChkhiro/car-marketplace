import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ImageGallery from './components/ImageGallery';
import CarInfo from './components/CarInfo';
import SellerInfo from './components/SellerInfo';
import SimilarCars from './components/SimilarCars';
import data from '../../data/cars.json';

const CarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState<any>(null);
  const [similarCars, setSimilarCars] = useState<any[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    // Find the car from our mock data
    const selectedCar = data.cars.find(c => c.id === id);
    if (selectedCar) {
      setCar(selectedCar);
      
      // Find similar cars (same make or price range)
      const similar = data.cars
        .filter(c => 
          c.id !== id && 
          (c.make === selectedCar.make || 
           Math.abs(c.price - selectedCar.price) < 5000)
        )
        .slice(0, 3);
      setSimilarCars(similar);
    }
  }, [id]);

  if (!car) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 py-6 space-y-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-gray-700 transition-colors">მთავარი</Link>
          <span>/</span>
          <Link to="/cars" className="hover:text-gray-700 transition-colors">მანქანები</Link>
          <span>/</span>
          <span className="text-gray-400">{car.year} {car.make} {car.model}</span>
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
            <SellerInfo seller={car.seller} />
          </div>
        </div>

        {/* Similar Cars */}
        <SimilarCars cars={similarCars} />
      </div>
    </div>
  );
};

export default CarDetails;