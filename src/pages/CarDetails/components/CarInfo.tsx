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
    <div className="bg-white shadow-sm rounded-xl overflow-hidden">
      <div className="p-8">
        <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
          <div className="flex-1 min-w-[280px]">
            <h1 className="text-3xl font-bold mb-2 text-gray-dark leading-tight">
              {car.year} {car.make} {car.model}
            </h1>
            <div className="flex gap-4 mt-4">
              <button className="flex items-center justify-center space-x-2 px-4 py-2.5 
                rounded-xl text-gray-dark hover:text-primary transition-colors
                hover:bg-green-light border border-gray-100">
                <FaHeart className="w-4 h-4" />
                <span className="text-sm font-medium">Save</span>
              </button>
              <button className="flex items-center justify-center space-x-2 px-4 py-2.5 
                rounded-xl text-gray-dark hover:text-primary transition-colors
                hover:bg-green-light border border-gray-100">
                <FaShare className="w-4 h-4" />
                <span className="text-sm font-medium">Share</span>
              </button>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl text-primary font-bold leading-none">
              ${car.price.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="flex flex-col gap-2 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-all duration-200">
            <div className="text-xl text-primary"><FaGasPump /></div>
            <div className="text-base text-gray-800 font-semibold">{car.specifications.fuelType}</div>
            <div className="text-sm text-gray-600">Fuel Type</div>
          </div>
          <div className="flex flex-col gap-2 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-all duration-200">
            <div className="text-xl text-primary"><FaTachometerAlt /></div>
            <div className="text-base text-gray-800 font-semibold">{car.specifications.mileage.toLocaleString()} km</div>
            <div className="text-sm text-gray-600">Mileage</div>
          </div>
          <div className="flex flex-col gap-2 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-all duration-200">
            <div className="text-xl text-primary"><FaCog /></div>
            <div className="text-base text-gray-800 font-semibold">{car.specifications.transmission}</div>
            <div className="text-sm text-gray-600">Transmission</div>
          </div>
          <div className="flex flex-col gap-2 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-all duration-200">
            <div className="text-xl text-primary"><FaPalette /></div>
            <div className="text-base text-gray-800 font-semibold">{car.specifications.color}</div>
            <div className="text-sm text-gray-600">Color</div>
          </div>
          <div className="flex flex-col gap-2 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-all duration-200">
            <div className="text-xl text-primary"><FaRoad /></div>
            <div className="text-base text-gray-800 font-semibold">{car.specifications.drive}</div>
            <div className="text-sm text-gray-600">Drive</div>
          </div>
        </div>

        <div className="my-10">
          <h2 className="text-2xl text-gray-800 mb-6 font-semibold">Description</h2>
          <p className="text-base text-gray-600 leading-relaxed">{car.description}</p>
        </div>

        <div>
          <h2 className="text-2xl text-gray-800 mb-8 font-semibold">Technical Specifications</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-sm transition-all duration-200">
              <h3 className="text-lg text-gray-800 mb-6 pb-2 border-b border-gray-100 font-semibold">
                Engine & Performance
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
                  <div className="font-medium text-gray-800">Engine</div>
                  <div className="text-gray-600">{car.specifications.engine}</div>
                </div>
                <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
                  <div className="font-medium text-gray-800">Transmission</div>
                  <div className="text-gray-600">{car.specifications.transmission}</div>
                </div>
                <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
                  <div className="font-medium text-gray-800">Drive Type</div>
                  <div className="text-gray-600">{car.specifications.drive}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-sm transition-all duration-200">
              <h3 className="text-lg text-gray-800 mb-6 pb-2 border-b border-gray-100 font-semibold">
                General Information
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
                  <div className="font-medium text-gray-800">Mileage</div>
                  <div className="text-gray-600">{car.specifications.mileage.toLocaleString()} km</div>
                </div>
                <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
                  <div className="font-medium text-gray-800">Fuel Type</div>
                  <div className="text-gray-600">{car.specifications.fuelType}</div>
                </div>
                <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
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