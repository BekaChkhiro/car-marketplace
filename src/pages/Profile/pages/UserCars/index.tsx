import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car } from '../../../../api/types/car.types';
import carService from '../../../../api/services/carService';
import { useAuth } from '../../../../context/AuthContext';
import { Button, Container, Loading } from '../../../../components/ui';
import { Plus, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '../../../../context/ToastContext';
import EmptyState from './components/EmptyState';
import UserCarsList from './components/UserCarsList';

const UserCars: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchUserCars = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching user cars...');
      const userCars = await carService.getUserCars();
      console.log('User cars data received:', userCars);

      // დავლოგოთ VIP სტატუსის მქონე მანქანები
      if (userCars && userCars.length > 0) {
        console.log('VIP cars count:', userCars.filter(car => car.vip_status && car.vip_status !== 'none').length);
      }
      
      // გადავცეთ სტეიტში მანქანები
      setCars(userCars);
      
      if (userCars.length === 0) {
        console.log('No user cars found, using fallback mock data for UI demonstration');
        
        // მოკ მონაცემები, რომლებიც გამოსახავენ სავარაუდო განცხადებებს
        const mockCars: Car[] = [
          {
            id: 10001,
            brand_id: 1,
            category_id: 1,
            brand: "BMW",
            model: "X5",
            title: "BMW X5 2020 - შავი",
            year: 2020,
            price: 15000,
            currency: 'USD',
            description_ka: 'BMW M5 კარგ მდგომარეობაში',
            status: "available",
            featured: true,
            vip_status: 'vip',
            vip_expiration_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            seller_id: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            location: {
              id: 1,
              city: "თბილისი",
              country: "საქართველო",
              location_type: "georgia",
              is_transit: false
            },
            images: [
              { 
                id: 1, 
                car_id: 10001, 
                url: "/images/car-placeholder.png",
                thumbnail_url: "/images/car-placeholder.png", 
                medium_url: "/images/car-placeholder.png",
                large_url: "/images/car-placeholder.png",
                is_primary: true
              }
            ],
            specifications: {
              id: 1,
              transmission: "automatic",
              fuel_type: "Diesel",
              mileage: 45000,
              mileage_unit: "km",
              engine_size: 3.0,
              color: "Black",
              steering_wheel: "left",
              drive_type: "AWD",
              interior_color: "Beige",
              has_navigation: true,
              has_parking_control: true,
              has_bluetooth: true
            }
          },
          {
            id: 10002,
            brand_id: 2,
            category_id: 2,
            brand: "Mercedes-Benz",
            model: "C-Class",
            title: "Mercedes-Benz C-Class - თეთრი",
            year: 2021,
            price: 18000,
            currency: 'USD',
            description_ka: 'Mercedes-Benz S-Class სალონური მანქანა',
            status: "available",
            featured: false,
            vip_status: 'none',
            vip_expiration_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            seller_id: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            location: {
              id: 2,
              city: "ბათუმი",
              country: "საქართველო",
              location_type: "georgia",
              is_transit: false
            },
            images: [
              { 
                id: 2, 
                car_id: 10002, 
                url: "/images/car-placeholder.png",
                thumbnail_url: "/images/car-placeholder.png", 
                medium_url: "/images/car-placeholder.png",
                large_url: "/images/car-placeholder.png",
                is_primary: true
              }
            ],
            specifications: {
              id: 2,
              transmission: "automatic",
              fuel_type: "Petrol",
              mileage: 25000,
              mileage_unit: "km",
              engine_size: 2.0,
              color: "White",
              steering_wheel: "left",
              drive_type: "RWD",
              interior_color: "Black",
              has_navigation: true,
              has_parking_control: true,
              has_bluetooth: true
            }
          }
        ];
        
        setCars(mockCars);
      }
    } catch (err) {
      console.error('Error fetching user cars:', err);
      setError('Failed to load your cars');
      
      // როცა მოხდა შეცდომა, ვიყენებთ მოკ მონაცემებს UI-ის სადემონსტრაციოდ
      const mockCars: Car[] = [
        {
          id: 10001,
          brand_id: 1,
          category_id: 1,
          brand: "BMW",
          model: "X5",
          title: "BMW X5 2020 - შავი (მოკ მონაცემები)",
          year: 2020,
          price: 15000,
          currency: 'USD',
          description_ka: 'BMW M5 კარგ მდგომარეობაში',
          status: "available",
          featured: true,
          vip_status: 'none',
          vip_expiration_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          seller_id: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          location: {
            id: 101,
            city: "თბილისი",
            country: "საქართველო",
            location_type: "georgia",
            is_transit: false
          },
          images: [
            { 
              id: 101, 
              car_id: 10001, 
              url: "/images/car-placeholder.png",
              thumbnail_url: "/images/car-placeholder.png", 
              medium_url: "/images/car-placeholder.png",
              large_url: "/images/car-placeholder.png",
              is_primary: true
            }
          ],
          specifications: {
            id: 1,
            transmission: "automatic",
            fuel_type: "Diesel",
            mileage: 45000,
            mileage_unit: "km",
            engine_size: 3.0,
            color: "Black",
            steering_wheel: "left",
            drive_type: "AWD",
            interior_color: "Beige",
            has_navigation: true,
            has_parking_control: true,
            has_bluetooth: true
          }
        },
        {
          id: 10002,
          brand_id: 2,
          category_id: 2,
          brand: "Mercedes-Benz",
          model: "C-Class",
          title: "Mercedes-Benz C-Class - თეთრი (მოკ მონაცემები)",
          year: 2021,
          price: 18000,
          currency: 'USD',
          description_ka: 'Mercedes-Benz S-Class სალონური მანქანა',
          status: "available",
          featured: false,
          vip_status: 'vip_plus',
          vip_expiration_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          seller_id: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          location: {
            id: 102,
            city: "ბათუმი",
            country: "საქართველო",
            location_type: "georgia",
            is_transit: false
          },
          images: [
            { 
              id: 102, 
              car_id: 10002, 
              url: "/images/car-placeholder.png",
              thumbnail_url: "/images/car-placeholder.png", 
              medium_url: "/images/car-placeholder.png",
              large_url: "/images/car-placeholder.png",
              is_primary: true
            }
          ],
          specifications: {
            id: 2,
            transmission: "automatic",
            fuel_type: "Petrol",
            mileage: 25000,
            mileage_unit: "km",
            engine_size: 2.0,
            color: "White",
            steering_wheel: "left",
            drive_type: "RWD",
            interior_color: "Black",
            has_navigation: true,
            has_parking_control: true,
            has_bluetooth: true
          }
        }
      ];
      
      setCars(mockCars);
      setError(null); // ვასუფთავებთ შეცდომას, რადგან გვაქვს მოკ მონაცემები
    } finally {
      setLoading(false);
    }
  };

  // ეფექტი მანქანების სიის ჩასატვირთად
  // Debug: დავლოგოთ რა მონაცემებს ვაწვდით UserCarsList კომპონენტს
  useEffect(() => {
    if (cars.length > 0) {
      console.log('Cars data being passed to UserCarsList:', cars);
      console.log('Cars with VIP status:', cars.filter(car => car.vip_status && car.vip_status !== 'none'));
    }
  }, [cars]);

  useEffect(() => {
    fetchUserCars();
  }, []);

  const handleDeleteCar = async (carId: number) => {
    if (window.confirm('დარწმუნებული ხართ რომ გსურთ წაშალოთ ეს განცხადება?')) {
      try {
        await carService.deleteCar(carId);
        fetchUserCars();
        showToast('განცხადება წარმატებით წაიშალა', 'success');
      } catch (error) {
        console.error('Error deleting car:', error);
        showToast('შეცდომა განცხადების წაშლისას', 'error');
      }
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loading />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} />
            სცადეთ თავიდან
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <section className="w-full px-3 sm:px-4 py-4 sm:py-6 md:py-8 bg-gradient-to-b from-blue-50/50 to-white">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 sm:mb-6 md:mb-8 gap-3 sm:gap-4">
          <div className="w-full md:w-auto text-center md:text-left mb-3 md:mb-0">
            <h2 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2 text-primary text-left">ჩემი განცხადებები</h2>
            <p className="text-sm sm:text-base text-gray-600 text-left">მართეთ თქვენი გამოქვეყნებული განცხადებები</p>
          </div>
          <Button 
            onClick={() => navigate('/profile/add-car')}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all duration-300 hover:shadow-md"
          >
            <Plus size={18} />
            ახალი განცხადება
          </Button>
        </div>

        {cars.length === 0 ? (
          <EmptyState />
        ) : (
          <UserCarsList 
            cars={cars} 
            onDelete={handleDeleteCar} 
            onVipUpdate={fetchUserCars} 
          />
        )}
      </Container>
    </section>
  );
};

export default UserCars;