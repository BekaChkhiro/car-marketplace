import React from 'react';
import { FaGasPump, FaTachometerAlt, FaCog, FaPalette, FaRoad, FaShare, FaHeart } from 'react-icons/fa';

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
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-8">
        <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
          <div className="flex-1 min-w-[280px]">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight">
              {car.year} {car.make} {car.model}
            </h1>
            <div className="flex gap-4 mt-4">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-primary bg-primary/10 hover:bg-primary/20 transition-colors">
                <FaHeart /> Save
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-secondary bg-secondary/10 hover:bg-secondary/20 transition-colors">
                <FaShare /> Share
              </button>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl text-primary font-bold leading-none">
              ${car.price.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-6">
          <div className="flex flex-col gap-2 p-4 bg-white/80 backdrop-blur rounded-md hover:translate-y-[-2px] hover:bg-white/95 transition-all">
            <div className="text-2xl text-primary"><FaGasPump /></div>
            <div className="text-lg text-gray-800 font-semibold">{car.specifications.fuelType}</div>
            <div className="text-sm text-gray-600">Fuel Type</div>
          </div>
          <div className="flex flex-col gap-2 p-4 bg-white/80 backdrop-blur rounded-md hover:translate-y-[-2px] hover:bg-white/95 transition-all">
            <div className="text-2xl text-primary"><FaTachometerAlt /></div>
            <div className="text-lg text-gray-800 font-semibold">{car.specifications.mileage.toLocaleString()} km</div>
            <div className="text-sm text-gray-600">Mileage</div>
          </div>
          <div className="flex flex-col gap-2 p-4 bg-white/80 backdrop-blur rounded-md hover:translate-y-[-2px] hover:bg-white/95 transition-all">
            <div className="text-2xl text-primary"><FaCog /></div>
            <div className="text-lg text-gray-800 font-semibold">{car.specifications.transmission}</div>
            <div className="text-sm text-gray-600">Transmission</div>
          </div>
          <div className="flex flex-col gap-2 p-4 bg-white/80 backdrop-blur rounded-md hover:translate-y-[-2px] hover:bg-white/95 transition-all">
            <div className="text-2xl text-primary"><FaPalette /></div>
            <div className="text-lg text-gray-800 font-semibold">{car.specifications.color}</div>
            <div className="text-sm text-gray-600">Color</div>
          </div>
          <div className="flex flex-col gap-2 p-4 bg-white/80 backdrop-blur rounded-md hover:translate-y-[-2px] hover:bg-white/95 transition-all">
            <div className="text-2xl text-primary"><FaRoad /></div>
            <div className="text-lg text-gray-800 font-semibold">{car.specifications.drive}</div>
            <div className="text-sm text-gray-600">Drive</div>
          </div>
        </div>

        <div className="my-10">
          <h2 className="text-2xl text-gray-800 mb-6 font-semibold">Description</h2>
          <p className="text-base text-gray-700 leading-relaxed">{car.description}</p>
        </div>

        <div>
          <h2 className="text-2xl text-gray-800 mb-8 font-semibold">Technical Specifications</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg text-gray-800 mb-6 pb-2 border-b-2 border-primary font-semibold">
                Engine & Performance
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-gray-200 hover:bg-white">
                  <div className="font-medium text-gray-800">Engine</div>
                  <div className="text-gray-600">{car.specifications.engine}</div>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 hover:bg-white">
                  <div className="font-medium text-gray-800">Transmission</div>
                  <div className="text-gray-600">{car.specifications.transmission}</div>
                </div>
                <div className="flex justify-between py-2 hover:bg-white">
                  <div className="font-medium text-gray-800">Drive Type</div>
                  <div className="text-gray-600">{car.specifications.drive}</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg text-gray-800 mb-6 pb-2 border-b-2 border-primary font-semibold">
                General Information
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-gray-200 hover:bg-white">
                  <div className="font-medium text-gray-800">Mileage</div>
                  <div className="text-gray-600">{car.specifications.mileage.toLocaleString()} km</div>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 hover:bg-white">
                  <div className="font-medium text-gray-800">Fuel Type</div>
                  <div className="text-gray-600">{car.specifications.fuelType}</div>
                </div>
                <div className="flex justify-between py-2 hover:bg-white">
                  <div className="font-medium text-gray-800">Color</div>
                  <div className="text-gray-600">{car.specifications.color}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarInfo;