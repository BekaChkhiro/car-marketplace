import React from 'react';
import { Car } from '../../../../../api/types/car.types';
import { useNavigate } from 'react-router-dom';
import { usePrice } from '../../../../../context/usePrice';
import { useCurrency } from '../../../../../context/CurrencyContext';
import { Edit2, Trash2, Eye, Calendar, MapPin, Gauge, Fuel, Settings } from 'lucide-react';

interface UserCarsListProps {
  cars: Car[];
  onDelete: (carId: number) => void;
}

const UserCarsList: React.FC<UserCarsListProps> = ({ cars, onDelete }) => {
  const navigate = useNavigate();
  const { currency } = useCurrency();
  const { formatPrice } = usePrice();

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
                მოქმედებები
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cars.map((car) => (
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
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/cars/${car.id}`)}
                      className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 p-2 rounded-md transition-colors"
                      title="ნახვა"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => navigate(`/profile/cars/edit/${car.id}`)}
                      className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 p-2 rounded-md transition-colors"
                      title="რედაქტირება"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(car.id)}
                      className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-md transition-colors"
                      title="წაშლა"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserCarsList;