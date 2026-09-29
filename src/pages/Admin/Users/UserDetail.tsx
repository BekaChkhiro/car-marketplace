import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User as UserIcon, Mail, Phone, Calendar, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import authService from '../../../api/services/authService';
import carService from '../../../api/services/carService';
import { User } from '../../../api/types/auth.types';
import { Car } from '../../../api/types/car.types';
import { useToast } from '../../../context/ToastContext';

import CarsList from '../Cars/components/CarsList';
import ErrorState from '../Cars/components/ErrorState';
import { ADMIN_PAGE_SIZE } from '../Cars';

const UserDetail: React.FC = () => {
  const { id, lang } = useParams<{ id: string; lang: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('admin');
  const { showToast } = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = Number(id);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // CarsList ფურცლავს კლიენტზე, ამიტომ სრული სია მოგვაქვს ერთად.
      const [userData, carsData] = await Promise.all([
        authService.getUserById(userId),
        carService.getCarsBySeller(userId, { limit: ADMIN_PAGE_SIZE }),
      ]);
      setUser(userData);
      setCars(carsData.cars);
    } catch (err) {
      setError(t('users.error'));
      console.error('Error fetching user detail:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, t]);

  useEffect(() => {
    if (!Number.isNaN(userId)) fetchData();
  }, [userId, fetchData]);

  const handleDeleteCar = async (carId: string) => {
    try {
      await carService.deleteCar(Number(carId));
      setCars(prev => prev.filter(car => car.id.toString() !== carId));
      showToast(t('cars.deleteSuccess'), 'success');
    } catch (err) {
      showToast(t('cars.deleteError'), 'error');
      console.error('Error deleting car:', err);
    }
  };

  if (error) {
    return <ErrorState error={error} onRetry={fetchData} />;
  }

  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ');

  return (
    <div>
      <button
        onClick={() => navigate(`/${lang}/admin/users`)}
        className="flex items-center gap-2 mb-6 text-sm text-gray-600 hover:text-primary"
      >
        <ArrowLeft size={18} />
        {t('users.title')}
      </button>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        {loading && !user ? (
          <div className="h-20 animate-pulse bg-gray-100 rounded-lg" />
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-shrink-0 h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <UserIcon size={28} />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900">{user?.username}</h1>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary flex items-center gap-1">
                  <Shield size={12} />
                  {t(`users.${user?.role}`, { defaultValue: user?.role })}
                </span>
              </div>
              {fullName && <p className="text-sm text-gray-500 mt-0.5">{fullName}</p>}

              <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-sm text-gray-600">
                {user?.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail size={14} /> {user.email}
                  </span>
                )}
                {user?.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone size={14} /> {user.phone}
                  </span>
                )}
                {user?.created_at && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {new Date(user.created_at).toLocaleDateString('ka-GE')}
                  </span>
                )}
              </div>
            </div>

            <div className="text-center sm:text-right">
              <div className="text-3xl font-bold text-gray-900">{cars.length}</div>
              <div className="text-sm text-gray-500">{t('analytics.cars')}</div>
            </div>
          </div>
        )}
      </div>

      <CarsList cars={cars} onDeleteCar={handleDeleteCar} isLoading={loading} />
    </div>
  );
};

export default UserDetail;
