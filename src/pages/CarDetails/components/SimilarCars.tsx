import React from 'react';
import CarCard from '../../../components/CarCard';

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  images: string[];
  specifications: {
    fuelType: string;
    transmission: string;
    mileage: number;
  };
  location: {
    city: string;
    region: string;
  };
  isVip: boolean;
}

interface SimilarCarsProps {
  cars: Car[];
}

const SimilarCars: React.FC<SimilarCarsProps> = ({ cars }) => {
  if (!cars.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <h3 className="text-xl text-gray-800 font-semibold mb-2">მსგავსი მანქანები ვერ მოიძებნა</h3>
        <p className="text-gray-600">
          ამჟამად მსგავსი მანქანები არ არის ხელმისაწვდომი. გთხოვთ სცადოთ მოგვიანებით.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            მსგავსი მანქანები
          </h2>
          <p className="mt-2 text-gray-600">
            აღმოაჩინეთ სხვა მანქანები, რომლებიც შეესაბამება თქვენს მოთხოვნებს
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimilarCars;