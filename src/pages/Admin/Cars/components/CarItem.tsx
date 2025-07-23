import React, { useState } from 'react';
import { Eye, Edit, Trash2, Calendar, Gauge, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Car } from '../../../../api/types/car.types';
import ConfirmationModal from '../../../../components/ConfirmationModal';

interface CarItemProps {
  car: Car;
  onDelete: (id: string) => void;
}

const CarItem: React.FC<CarItemProps> = ({ car, onDelete }) => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">{t('available')}</span>;
      case 'sold':
        return <span className="px-2.5 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">{t('common.sold')}</span>;
      case 'pending':
        return <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">{t('common.pending')}</span>;
      default:
        return null;
    }
  };
  
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

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(car.id.toString());
    setIsDeleteModalOpen(false);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };
  
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  
  return (
    <tr className="group transition-colors hover:bg-blue-50/30">
      <td className="px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 group-hover:border-blue-200 transition-colors shadow-sm bg-white">
            <img 
              src={car.images[0]?.url || '/images/car-placeholder.jpg'} 
              alt={`${car.brand} ${car.model}`}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{car.title || `${car.brand} ${car.model}`}</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
              <div className="flex items-center text-sm text-gray-500">
                <Calendar size={14} className="mr-1 text-gray-400" />
                {car.year}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Gauge size={14} className="mr-1 text-gray-400" />
                {car.specifications.mileage ? car.specifications.mileage.toLocaleString() : '0'} კმ
              </div>
              {car.specifications.transmission && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {car.specifications.transmission === 'automatic' ? t('automatic') : t('manual')}
                </span>
              )}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="font-semibold text-gray-900">{car.price.toLocaleString()} ₾</div>
        <div className="text-xs text-gray-500 mt-1">{t('cars.createdAt')}: {formatDate(car.created_at)}</div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col gap-2">
          {getStatusBadge(car.status)}
          {getVipBadge(car.vip_status)}
          {car.vip_expiration_date && (
            <div className="text-xs text-gray-500">
              {t('cars.vipExpiration')}: {formatDate(car.vip_expiration_date)}
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center gap-2 justify-end">
          <button 
            onClick={() => navigate(`/cars/${car.id}`)}
            className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors group-hover:bg-blue-100"
            title={t('cars.view')}
          >
            <Eye size={16} className="text-gray-600 group-hover:text-blue-600" />
          </button>
          <button 
            onClick={() => navigate(`/admin/cars/edit/${car.id}`)}
            className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors group-hover:bg-blue-100"
            title={t('cars.edit')}
          >
            <Edit size={16} className="text-gray-600 group-hover:text-blue-600" />
          </button>
          <button 
            onClick={handleDeleteClick}
            className="p-1.5 hover:bg-red-100 rounded-lg transition-colors group-hover:bg-red-100"
            title={t('cars.delete')}
          >
            <Trash2 size={16} className="text-red-600" />
          </button>
          
          {isDeleteModalOpen && (
            <ConfirmationModal
              isOpen={isDeleteModalOpen}
              title={t('cars.deleteCar')}
              message={`${t('cars.deleteConfirmation')} ${car.brand} ${car.model}?`}
              confirmText={t('cars.delete')}
              cancelText={t('common.cancel')}
              onConfirm={handleConfirmDelete}
              onCancel={handleCancelDelete}
            />
          )}
          

        </div>
      </td>
    </tr>
  );
};

export default CarItem;