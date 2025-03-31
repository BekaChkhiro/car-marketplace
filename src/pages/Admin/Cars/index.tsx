import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car } from '../../../api/types/car.types';
import carService from '../../../api/services/carService';
import { Container, Loading } from '../../../components/ui';
import { Edit, Trash2 } from 'lucide-react';

const AdminCars: React.FC = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    return <Loading />;
  }

  if (error) {
    return (
      <Container>
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        <h1 className="text-2xl font-bold mb-6">All Cars</h1>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Car
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cars.map((car) => (
                <tr key={car.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={car.images[0] || '/placeholder-car.jpg'}
                          alt={`${car.brand} ${car.model}`}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {car.brand} {car.model}
                        </div>
                        <div className="text-sm text-gray-500">
                          {car.year}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      User {car.user_id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${car.price.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/profile/cars/edit/${car.id}`)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteCar(car.id)}
                        className="text-red-600 hover:text-red-900"
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
    </Container>
  );
};

export default AdminCars;