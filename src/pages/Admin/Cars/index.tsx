import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car } from '../../../api/types/car.types';
import carService from '../../../api/services/carService';
import { Car as CarIcon, ChevronDown, ChevronUp, Edit, Trash2, Eye, Search, Filter } from 'lucide-react';

const AdminCars: React.FC = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await carService.getCars();
        setCars(response);
      } catch (error) {
        setError('Failed to load cars');
        console.error('Error fetching cars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);
  
  // Filter and sort cars
  const filteredCars = cars
    .filter(car => {
      // Apply search filter
      const searchMatch = car.brand.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         car.model.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Apply status filter
      const statusMatch = statusFilter === 'all' || car.status === statusFilter;
      
      return searchMatch && statusMatch;
    })
    .sort((a, b) => {
      // Sort by date (created_at) - newest first by default
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      
      return sortDirection === 'asc' 
        ? dateA - dateB
        : dateB - dateA;
    });
    
  // Pagination
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstItem, indexOfLastItem);

  const handleDeleteCar = async (carId: number) => {
    try {
      await carService.deleteCar(carId);
      setCars(prevCars => prevCars.filter(car => car.id !== carId));
    } catch (error) {
      setError('Failed to delete car');
      console.error('Error deleting car:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="flex gap-4">
            <div className="h-10 w-48 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm">
          <div className="h-14 bg-gray-100 border-b border-gray-200"></div>
          <div className="p-4 space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center space-x-4 py-2 border-b border-gray-100">
                <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12 bg-white rounded-xl shadow-sm mt-8">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">მანქანების ჩატვირთვის შეცდომა</h2>
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => {
                setLoading(true);
                setError(null);
                carService.getCars().then(response => {
                  setCars(response);
                  setLoading(false);
                }).catch(error => {
                  setError('Failed to load cars');
                  setLoading(false);
                });
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
            >
              ხელახლა ცდა
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">მანქანების სია</h1>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="მოძებნე მანქანა..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <select 
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">ყველა სტატუსი</option>
            <option value="available">ხელმისაწვდომი</option>
            <option value="sold">გაყიდული</option>
            <option value="pending">მოლოდინში</option>
          </select>
        </div>
      </div>
      
      {filteredCars.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CarIcon size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg">მანქანები ვერ მოიძებნა</p>
          <p className="text-gray-400 text-sm mt-2">შეცვალეთ ძიების პარამეტრები ან დაამატეთ ახალი მანქანები</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm">
          <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  <button
                    className="flex items-center gap-2"
                    onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                  >
                    თარიღი
                    {sortDirection === 'asc' ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">მანქანის დეტალები</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">გამყიდველი</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">ფასი</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">სტატუსი</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">მოქმედებები</th>
              </tr>
            </thead>
            <tbody>
              {currentCars.map((car) => (
                <tr key={car.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {new Date(car.created_at).toLocaleDateString('ka-GE', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                        {car.images && car.images[0]?.thumbnail_url ? (
                          <img
                            className="h-10 w-10 object-cover"
                            src={car.images[0].thumbnail_url}
                            alt={`${car.brand} ${car.model}`}
                          />
                        ) : (
                          <CarIcon size={18} className="text-gray-600" />
                        )}
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">{car.brand} {car.model}</span>
                        <div className="text-xs text-gray-500 mt-1">
                          წელი: {car.year}
                          {car.specifications && (
                            <span className="ml-2">
                              {car.specifications.engine_type && `• ${car.specifications.engine_type}`}
                              {car.specifications.transmission && ` • ${car.specifications.transmission}`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      ID: {car.seller_id}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(car.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      ${car.price.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      car.status === 'available' ? 'bg-green-100 text-green-700' : 
                      car.status === 'sold' ? 'bg-gray-100 text-gray-700' : 
                      'bg-yellow-100 text-yellow-700'}`}
                    >
                      {car.status === 'available' ? 'ხელმისაწვდომი' : 
                       car.status === 'sold' ? 'გაყიდული' : 'მოლოდინში'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => navigate(`/cars/${car.id}`)}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        title="ნახვა"
                      >
                        <Eye size={16} className="text-gray-600" />
                      </button>
                      <button 
                        onClick={() => navigate(`/profile/cars/edit/${car.id}`)}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        title="რედაქტირება"
                      >
                        <Edit size={16} className="text-gray-600" />
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm(`დარწმუნებული ხართ, რომ გსურთ წაშალოთ ${car.brand} ${car.model}?`)) {
                            handleDeleteCar(car.id);
                          }
                        }}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        title="წაშლა"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            
            </tbody>
          </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100">
            <div className="text-sm text-gray-600">
              ნაჩვენებია {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredCars.length)} / {filteredCars.length}
            </div>
            <div className="flex gap-2">
              <button 
                className={`px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                უკან
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                შემდეგი
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCars;