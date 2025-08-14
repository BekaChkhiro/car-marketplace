import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RefreshCw, Eye, Edit, Trash2, Calendar, Gauge, Star } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('admin');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  
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
          <h1 className="text-3xl font-bold text-gray-800">{t('cars.title')}</h1>
          <p className="text-gray-500 mt-1">{t('cars.management')}</p>
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
        {/* Desktop Table View (hidden on mobile) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('cars.car')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('cars.price')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('cars.status')}
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('cars.actions')}
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
        
        {/* Mobile Card View (shown only on mobile) */}
        <div className="md:hidden">
          <div className="grid gap-4 p-4">
            {currentCars.map((car) => {
              // Format date to be more readable
              const formatDate = (dateString: string) => {
                const date = new Date(dateString);
                const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
                return date.toLocaleDateString('en-US', options);
              };
              
              // Status badge helper
              const getStatusBadge = (status: string) => {
                switch (status) {
                  case 'available':
                    return <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">{t('common.available')}</span>;
                  case 'sold':
                    return <span className="px-2.5 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">{t('common.sold')}</span>;
                  case 'pending':
                    return <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">{t('common.pending')}</span>;
                  default:
                    return null;
                }
              };
              
              // VIP badge helper
              const getVipBadge = (vipStatus?: string) => {
                switch (vipStatus) {
                  case 'vip':
                    return <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center gap-1">
                      <Star size={10} fill="currentColor" /> VIP
                    </span>;
                  case 'vip_plus':
                    return <span className="px-2.5 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full flex items-center gap-1">
                      <Star size={10} fill="currentColor" /> VIP+
                    </span>;
                  case 'super_vip':
                    return <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full flex items-center gap-1">
                      <Star size={10} fill="currentColor" /> SUPER VIP
                    </span>;
                  default:
                    return null;
                }
              };
              
              return (
                <div 
                  key={car.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
                >
                  <div className="flex items-center p-4 border-b border-gray-100">
                    <div className="h-24   w-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 mr-4">
                      <img 
                        src={car.images[0]?.url || '/images/car-placeholder.jpg'} 
                        alt={`${car.brand} ${car.model}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-md">{car.title || `${car.brand} ${car.model}`}</p>
                      <div className="mt-1 flex items-center">
                        <span className="font-semibold text-md text-gray-900">{car.price.toLocaleString()} ₾</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    {/* Car Info */}
                    <div className="grid grid-cols-3 gap-2 bg-gray-50 p-2 rounded-lg">
                      <div className="flex flex-col items-center justify-center p-2 text-center">
                        <Calendar size={16} className="text-gray-500 mb-1" />
                        <span className="text-xs text-gray-500">{t('cars.year')}</span>
                        <span className="text-sm font-medium text-gray-800">{car.year}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-2 text-center">
                        <Gauge size={16} className="text-gray-500 mb-1" />
                        <span className="text-xs text-gray-500">{t('cars.mileage')}</span>
                        <span className="text-sm font-medium text-gray-800">{car.specifications.mileage ? car.specifications.mileage.toLocaleString() : '0'} კმ</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-2 text-center">
                        <span className="text-xs text-gray-500">{t('cars.transmission')}</span>
                        <span className="text-sm font-medium text-gray-800">
                          {car.specifications.transmission === 'automatic' ? t('common.automatic') : t('common.manual')}
                        </span>
                      </div>
                    </div>
                    
                    {/* Status Section */}
                    <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-3">
                      {getStatusBadge(car.status)}
                      {getVipBadge(car.vip_status)}
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      {t('cars.createdAt')}: {formatDate(car.created_at)}
                      {car.vip_expiration_date && (
                        <div className="mt-1">
                          {t('cars.vipExpiration')}: {formatDate(car.vip_expiration_date)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="p-4 flex justify-between items-center border-t border-gray-100 bg-gray-50">
                    <div className="text-xs text-gray-500">
                      ID: {car.id}
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => navigate(`/${lang}/cars/${car.id}`)}
                        className="p-2 text-blue-700 bg-blue-50 rounded-lg flex items-center"
                      >
                        <Eye size={16} className="mr-1" /> 
                      </button>
                      <button 
                        onClick={() => navigate(`/${lang}/admin/cars/edit/${car.id}`)}
                        className="p-2 text-indigo-700 bg-indigo-50 rounded-lg flex items-center"
                      >
                        <Edit size={16} className="mr-1" /> 
                      </button>
                      <button 
                        onClick={() => onDeleteCar(car.id.toString())}
                        className="p-2 text-red-700 bg-red-50 rounded-lg flex items-center"
                      >
                        <Trash2 size={16} className="mr-1" /> 
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
          {/* Pagination */}
        <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-gray-100 bg-gray-50">
          <div className="text-sm text-gray-600 text-center sm:text-left">
            {t('common.showing')} <span className="font-medium">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredCars.length)}</span> {t('common.of')} <span className="font-medium">{filteredCars.length}</span>
          </div>
          <div className="flex items-center justify-center sm:justify-end gap-2">
            <button 
              className={`px-4 py-2 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 flex items-center gap-1 transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ArrowLeft size={16} /> <span className="hidden sm:inline">{t('common.previous')}</span>
            </button>
            <span className="px-3 py-2 text-xs font-medium bg-white border border-gray-200 rounded-lg min-w-[70px] text-center">
              {currentPage} / {totalPages || 1}
            </span>
            <button 
              className={`px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1 transition-colors shadow-sm ${currentPage === totalPages || totalPages === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <span className="hidden sm:inline">{t('common.next')}</span> <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-right">
        <button 
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600"
          onClick={() => window.location.reload()}
        >
          <RefreshCw size={14} /> {t('common.refresh')}
        </button>
      </div>
    </div>
  );
};

export default CarsList;