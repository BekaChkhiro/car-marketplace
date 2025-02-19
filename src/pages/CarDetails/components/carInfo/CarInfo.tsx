import React from 'react';
import CarHeader from './components/CarHeader';
import CarSpecificationCards from './components/CarSpecificationCards';
import CarDescription from './components/CarDescription';
import TechnicalSpecifications from './components/TechnicalSpecifications';

interface CarInfoProps {
  car: {
    make: string;
    model: string;
    year: number;
    price: number;
    specifications: {
      engine: string;
      transmission: string;
      fuelType: string;
      mileage: number;
      color: string;
      drive: string;
    };
    description: string;
  };
}

const CarInfo: React.FC<CarInfoProps> = ({ car }) => {
  return (
    <div className="bg-white shadow-sm rounded-xl overflow-hidden">
      <div className="p-8">
        <CarHeader
          make={car.make}
          model={car.model}
          year={car.year}
          price={car.price}
        />
        
        <CarSpecificationCards specifications={car.specifications} />
        
        <CarDescription description={car.description} />
        
        <TechnicalSpecifications specifications={car.specifications} />
      </div>
    </div>
  );
};

export default CarInfo;