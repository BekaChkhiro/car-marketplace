import React from 'react';
import { Car } from '../../../../../api/types/car.types';
import { useNavigate } from 'react-router-dom';
import { usePrice } from '../../../../../context/usePrice';
import { useCurrency } from '../../../../../context/CurrencyContext';
import { Edit2, Trash2, Eye, Calendar, MapPin, Gauge, Fuel, Settings, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface UserCarsListProps {
  cars: Car[];
  onDelete: (carId: number) => void;
}

const UserCarsList: React.FC<UserCarsListProps> = ({ cars, onDelete }) => {
  const navigate = useNavigate();
  const { currency } = useCurrency();
  const { formatPrice } = usePrice();

  // ფუნქცია სტატუსის მნიშვნელობის ქართულად გადასათარგმნად
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'available':
        return 'ხელმისაწვდომია';
      case 'pending':
        return 'დასტურის მოლოდინში';
      case 'sold':
        return 'გაყიდულია';
      case 'inactive':
        return 'არააქტიური';
      case 'deleted':
        return 'წაშლილია';
      default:
        return 'უცნობია';
    }
  };

  // ფუნქცია სტატუსის შესაბამისი ფერების და იკონის დასაბრუნებლად
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'available':
        return {
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          icon: <CheckCircle size={16} className="mr-2 text-green-600" />
        };
      case 'pending':
        return {
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-700',
          icon: <Clock size={16} className="mr-2 text-yellow-600" />
        };
      case 'sold':
        return {
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          icon: <CheckCircle size={16} className="mr-2 text-blue-600" />
        };
      case 'inactive':
        return {
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          icon: <AlertTriangle size={16} className="mr-2 text-gray-600" />
        };
      case 'deleted':
        return {
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
          icon: <AlertTriangle size={16} className="mr-2 text-red-600" />
        };
      default:
        return {
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          icon: <AlertTriangle size={16} className="mr-2 text-gray-600" />
        };
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                მანქანა
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ფასი
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ძირითადი მონაცემები
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                სტატუსი
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                მოქმედებები
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cars.map((car) => {
              const statusStyle = getStatusStyle(car.status);
              
              return (
                <tr 
                  key={car.id} 
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 h-14 w-20 bg-gray-100 rounded-md overflow-hidden">
                        <img 
                          src={car.images[0]?.medium_url || '/images/car-placeholder.png'} 
                          alt={`${car.brand} ${car.model}`} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">
                          {car.brand} {car.model}
                        </div>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Calendar size={14} className="mr-1" /> {car.year}
                        </div>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <MapPin size={14} className="mr-1" /> {car.location.city}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-primary">
                      {formatPrice(car.price)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-xs text-gray-500">
                        <Gauge size={14} className="mr-2" /> 
                        <span>{car.specifications.mileage.toLocaleString()} კმ</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Fuel size={14} className="mr-2" /> 
                        <span>{car.specifications.fuel_type}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Settings size={14} className="mr-2" /> 
                        <span>{car.specifications.transmission}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.bgColor} ${statusStyle.textColor}`}>
                      {statusStyle.icon}
                      {getStatusText(car.status)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => navigate(`/cars/${car.id}`)}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-colors shadow-sm"
                    >
                      <Eye size={16} className="mr-2" />
                      ნახვა
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserCarsList;