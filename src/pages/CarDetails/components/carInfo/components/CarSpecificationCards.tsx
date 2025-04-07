import React from 'react';
import { Fuel, Gauge, Settings, Palette, Navigation } from 'lucide-react';

interface CarSpecificationCardsProps {
  fuelType: string;
  mileage: number;
  transmission: string;
  color?: string;
  driveType?: string;
}

const CarSpecificationCards: React.FC<CarSpecificationCardsProps> = ({ fuelType, mileage, transmission, color, driveType }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <div className="flex flex-col gap-2 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-all duration-200">
        <div className="text-xl text-primary"><Fuel /></div>
        <div className="text-base text-gray-800 font-semibold">{fuelType || 'N/A'}</div>
        <div className="text-sm text-gray-600">Fuel Type</div>
      </div>
      <div className="flex flex-col gap-2 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-all duration-200">
        <div className="text-xl text-primary"><Gauge /></div>
        <div className="text-base text-gray-800 font-semibold">
          {mileage ? mileage.toLocaleString() : 'N/A'} {mileage ? 'km' : ''}
        </div>
        <div className="text-sm text-gray-600">Mileage</div>
      </div>
      <div className="flex flex-col gap-2 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-all duration-200">
        <div className="text-xl text-primary"><Settings /></div>
        <div className="text-base text-gray-800 font-semibold">{transmission || 'N/A'}</div>
        <div className="text-sm text-gray-600">Transmission</div>
      </div>
      <div className="flex flex-col gap-2 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-all duration-200">
        <div className="text-xl text-primary"><Palette /></div>
        <div className="text-base text-gray-800 font-semibold">{color || 'N/A'}</div>
        <div className="text-sm text-gray-600">Color</div>
      </div>
      <div className="flex flex-col gap-2 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-all duration-200">
        <div className="text-xl text-primary"><Navigation /></div>
        <div className="text-base text-gray-800 font-semibold">{driveType || 'N/A'}</div>
        <div className="text-sm text-gray-600">Drive</div>
      </div>
    </div>
  );
};

export default CarSpecificationCards;