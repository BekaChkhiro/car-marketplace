import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  Car, 
  CreditCard, 
  TrendingUp, 
  Activity, 
  Calendar, 
  BarChart, 
  ChevronRight,
  Eye,
  AlertTriangle,
  Package
} from 'lucide-react';
import authService from '../../../api/services/authService';
import carService from '../../../api/services/carService';
import partService, { Part } from '../../../api/services/partService';
import { User } from '../../../api/types/auth.types';
import { Car as CarType } from '../../../api/types/car.types';
import { Link } from 'react-router-dom';
import RecentParts from './components/RecentParts';
import { namespaces } from 'i18n';

// Recent cars component
const RecentCars = ({ cars }: { cars: CarType[] }) => {
  const { t } = useTranslation('admin');
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{t('dashboard.recentlyAdded')}</h3>
        <Link to="/admin/cars" className="text-primary text-sm flex items-center hover:underline">
          {t('dashboard.viewAllListings')} <ChevronRight size={16} />
        </Link>
      </div>
      
      {cars.length === 0 ? (
        <div className="text-center py-6">
          <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-3">
            <AlertTriangle size={20} className="text-gray-400" />
          </div>
          <p className="text-gray-500">{t('dashboard.noListingsFound')}</p>
        </div>
      ) : (
        <div className="space-y-4  mt-6 sm:mt-0">
          {cars.slice(0, 5).map(car => (
            <div key={car.id} className=" flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center">
                <div className="w-12 h-12 overflow-hidden rounded-lg mr-3 border border-gray-100">
                  <img 
                    src={car.images[0]?.url || '/images/car-placeholder.jpg'} 
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{car.brand} {car.model}</p>
                  <p className="text-sm text-gray-500">{car.price.toLocaleString()} ₾</p>
                </div>
              </div>
              <div className="flex items-center justify-between w-full sm:w-auto mt-2 sm:mt-0 ">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  car.status === 'available' ? 'bg-green-100 text-green-800' : 
                  car.status === 'sold' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {car.status === 'available' ? t('available') : 
                   car.status === 'sold' ? t('common.sold') : t('common.pending')}
                </span>
                <Link 
                  to={`/cars/${car.id}`} 
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                  title={t('dashboard.view')}
                >
                  <Eye size={16} className="text-gray-500" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation([namespaces.admin, namespaces.common]);
  const [users, setUsers] = useState<User[]>([]);
  const [cars, setCars] = useState<CarType[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch users, cars, and parts in parallel
        const [usersData, carsData, partsData] = await Promise.all([
          authService.getAllUsers(),
          carService.getCars(),
          partService.getParts({ limit: 10 })
        ]);
        
        setUsers(usersData);
        // Extract the cars array from the carsData object
        setCars(carsData.cars || []);
        // Extract the parts array from the partsData object
        setParts(partsData.parts || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Calculate statistics
  const activeUsers = users.filter(u => u.status === 'active').length;
  const blockedUsers = users.filter(u => u.status === 'დაბლოკილი' || u.status === 'blocked').length;
  
  const availableCars = cars.filter(c => c.status === 'available').length;
  const soldCars = cars.filter(c => c.status === 'sold').length;
  const featuredCars = cars.filter(c => c.featured).length;
  
  const newParts = parts.filter(p => p.condition === 'new').length;
  const usedParts = parts.filter(p => p.condition === 'used').length;
  const vipParts = parts.filter(p => p.vip_status && p.vip_status !== 'none').length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto">
        <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-2">{t('dashboard.title')}</h1>
        <p className="text-gray-500 mb-8 text-md">{t('dashboard.welcome')}</p>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm animate-pulse">
                <div className="h-5 w-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 w-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users size={24} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700">{t('totalUsers')}</h3>
                </div>
                <p className="text-3xl font-bold text-primary">{users.length}</p>
                <div className="flex  gap-3 mt-3">
                  <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {t('common.active')}: {activeUsers}
                  </span>
                  {blockedUsers > 0 && (
                    <span className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded-full">
                      {t('common.blocked')}: {blockedUsers}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Car size={24} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700">{t('totalCars')}</h3>
                </div>
                <p className="text-3xl font-bold text-primary">{cars.length}</p>
                <div className="flex gap-3 mt-3">
                  <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {t('available')}: {availableCars}
                  </span>
                  {soldCars > 0 && (
                    <span className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-full">
                      {t('sold')}: {soldCars}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Package size={24} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700">{t('dashboard.totalListings')}</h3>
                </div>
                <p className="text-3xl font-bold text-primary">{parts.length}</p>
                <div className="flex gap-3 mt-3">
                  <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {t('dashboard.new')}: {newParts}
                  </span>
                  {usedParts > 0 && (
                    <span className="text-sm text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                      {t('used')}: {usedParts}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <TrendingUp size={24} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700">{t('vipListings.title')}</h3>
                </div>
                <p className="text-3xl font-bold text-primary">{featuredCars}</p>
                <div className="mt-3">
                  <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {t('vipListings.title')} {cars.length > 0 ? Math.round((featuredCars / cars.length) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
            
            {/* Activity and Recent Items Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentCars cars={cars} />
              <RecentParts parts={parts} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;