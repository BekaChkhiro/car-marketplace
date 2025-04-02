import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';
import { Car } from '../../../../api/types/car.types';
import CarItem from './CarItem';
import EmptyState from './EmptyState';

interface CarsListProps {
  cars: Car[];
  onDeleteCar: (id: string) => void;
  isLoading?: boolean;
}

const CarsList: React.FC<CarsListProps> = ({ 
  cars,
  onDeleteCar,
  isLoading = false
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  
  const carsPerPage = 10;
  
  // Set filtered cars to all cars since we removed filters
  useEffect(() => {
    setFilteredCars(cars);
  }, [cars]);
  
  // Pagination calculations
  const indexOfLastItem = currentPage * carsPerPage;
  const indexOfFirstItem = indexOfLastItem - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);
  
  // Handle empty state
  if (!isLoading && filteredCars.length === 0) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">მანქანები</h1>
          <p className="text-gray-500 mt-1">თქვენი მანქანების მართვა</p>
        </div>
        <EmptyState />
      </div>
    );
  }
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">მანქანები</h1>
        <p className="text-gray-500 mt-1">თქვენი მანქანების მართვა</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  მანქანა
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ფასი
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  სტატუსი
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  მოქმედებები
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {currentCars.map((car) => (
                <CarItem key={car.id} car={car} onDelete={onDeleteCar} />
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-gray-100 bg-gray-50">
          <div className="text-sm text-gray-600">
            ნაჩვენებია <span className="font-medium">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredCars.length)}</span> სულ <span className="font-medium">{filteredCars.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              className={`px-4 py-2 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 flex items-center gap-1 transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ArrowLeft size={16} /> უკან
            </button>
            <span className="px-3 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg">
              {currentPage} / {totalPages || 1}
            </span>
            <button 
              className={`px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1 transition-colors shadow-sm ${currentPage === totalPages || totalPages === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              შემდეგი <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-right">
        <button 
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600"
          onClick={() => window.location.reload()}
        >
          <RefreshCw size={14} /> განახლება
        </button>
      </div>
    </div>
  );
};

export default CarsList;