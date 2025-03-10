import React from 'react';

interface Specifications {
  engine?: string;
  transmission?: string;
  drive?: string;
  mileage?: number;
  fuelType?: string;
  color?: string;
}

interface TechnicalSpecificationsProps {
  specifications: Specifications;
}

const TechnicalSpecifications: React.FC<TechnicalSpecificationsProps> = ({ specifications }) => {
  return (
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
              <div className="text-gray-600">{specifications?.engine || 'N/A'}</div>
            </div>
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Transmission</div>
              <div className="text-gray-600">{specifications?.transmission || 'N/A'}</div>
            </div>
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Drive Type</div>
              <div className="text-gray-600">{specifications?.drive || 'N/A'}</div>
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
              <div className="text-gray-600">
                {specifications?.mileage ? `${specifications.mileage.toLocaleString()} km` : 'N/A'}
              </div>
            </div>
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Fuel Type</div>
              <div className="text-gray-600">{specifications?.fuelType || 'N/A'}</div>
            </div>
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Color</div>
              <div className="text-gray-600">{specifications?.color || 'N/A'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalSpecifications;