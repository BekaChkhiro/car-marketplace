import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Car, UpdateCarFormData } from '../../../../api/types/car.types';
import carService from '../../../../api/services/carService';
import { ArrowLeft } from 'lucide-react';
import { CarForm, LoadingState, ErrorState } from '../components';

const AdminEditCar: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        if (!id) return;
        setLoading(true);
        setError(null);
        const carData = await carService.getCar(Number(id));
        setCar(carData);
      } catch (err) {
        setError('მანქანის დეტალების ჩატვირთვა ვერ მოხერხდა');
        console.error('Error fetching car:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  const handleSubmit = async (data: UpdateCarFormData) => {
    try {
      if (!id || !car) return;
      setUpdating(true);
      setError(null);
      await carService.updateCar(Number(id), data);
      setUpdateSuccess(true);
      setTimeout(() => {
        navigate('/admin/cars');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'მანქანის განახლება ვერ მოხერხდა');
      console.error('Error updating car:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error && !car) {
    return <ErrorState error={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section with Breadcrumb */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <button 
            onClick={() => navigate('/admin/cars')}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mr-2"
          >
            <ArrowLeft size={16} className="mr-1" />
          </button>
          <div className="text-sm breadcrumbs">
            <ul className="flex space-x-2 text-gray-500">
              <li><a href="/admin" className="hover:text-blue-600">ადმინ პანელი</a></li>
              <li><a href="/admin/cars" className="hover:text-blue-600">მანქანები</a></li>
              <li className="text-gray-700 font-medium">რედაქტირება</li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col justify-between items-start sm:flex-row sm:items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">მანქანის რედაქტირება</h1>
            <p className="text-gray-500 mt-1">
              {car ? `${car.brand} ${car.model} (${car.year})` : 'მანქანის დეტალები'}
            </p>
          </div>
          {car && (
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${car.status === 'available' ? 'bg-green-100 text-green-800' : car.status === 'sold' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {car.status === 'available' ? 'ხელმისაწვდომი' : car.status === 'sold' ? 'გაყიდული' : 'დაჯავშნილი'}
              </span>
              {car.featured && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  გამორჩეული
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Notification Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p>{error}</p>
        </div>
      )}

      {updateSuccess && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg text-green-700 flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <p>მანქანა წარმატებით განახლდა! გადამისამართება...</p>
        </div>
      )}

      {/* Form Card */}
      {car && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 ">
            <h2 className="text-lg font-medium text-gray-800">მანქანის ინფორმაცია</h2>
            <p className="text-sm text-gray-500">შეავსეთ ყველა საჭირო ველი მანქანის განახლებისთვის</p>
          </div>
          <CarForm 
            initialData={car} 
            onSubmit={handleSubmit} 
            isSubmitting={updating}
            mode="edit"
          />
        </div>
      )}
    </div>
  );
};

export default AdminEditCar;
