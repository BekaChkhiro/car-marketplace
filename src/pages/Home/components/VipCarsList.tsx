import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import vipService, { VipStatus } from '../../../api/services/vipService';
import CarCard from '../../../components/CarCard';
import { Car } from '../../../api/types/car.types';

interface VipCarsListProps {
  vipType: VipStatus;
  limit?: number;
}

const VipCarsList: React.FC<VipCarsListProps> = ({ vipType, limit = 4 }) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVipCars = async () => {
      try {
        setLoading(true);
        const response = await vipService.getCarsByVipStatus(vipType, limit);
        setCars(response.cars);
      } catch (err) {
        console.error('Error fetching VIP cars:', err);
        setError('VIP მანქანების ჩატვირთვა ვერ მოხერხდა');
      } finally {
        setLoading(false);
      }
    };

    fetchVipCars();
  }, [vipType, limit]);

  const getVipTitle = (vipType: VipStatus) => {
    switch (vipType) {
      case 'vip':
        return 'VIP მანქანები';
      case 'vip_plus':
        return 'VIP+ განცხადებები';
      case 'super_vip':
        return 'SUPER VIP განცხადებები';
      default:
        return '';
    }
  };

  const getVipBadgeStyle = (vipType: VipStatus) => {
    switch (vipType) {
      case 'vip':
        return 'bg-blue-500 text-white';
      case 'vip_plus':
        return 'bg-purple-500 text-white';
      case 'super_vip':
        return 'bg-yellow-500 text-yellow-900';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  if (cars.length === 0 && !loading) {
    return null;
  }

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-bold text-gray-800">{getVipTitle(vipType)}</h2>
          <div className={`px-2 py-0.5 rounded ${getVipBadgeStyle(vipType)} flex items-center`}>
            <Star size={14} fill="currentColor" className="mr-1" />
            <span className="text-xs font-medium">{vipType === 'vip_plus' ? 'VIP+' : vipType === 'super_vip' ? 'SUPER VIP' : 'VIP'}</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-pulse">
          {Array.from({ length: limit }).map((_, index) => (
            <div key={index} className="bg-gray-200 rounded-lg h-64"></div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} showVipBadge />
          ))}
        </div>
      )}
    </div>
  );
};

export default VipCarsList;
