import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import carService from '../../api/services/carService';
import { Car } from '../../api/types/car.types';
import { Container, Loading } from '../../components/ui';
import ImageGallery from './components/imageGallery/ImageGallery';
import SimilarCars from './components/similarCars';
import CarInfo from './components/carInfo/CarInfo';
import SellerInfo from './components/sellerInfo/SellerInfo';
import { useToast } from '../../context/ToastContext';
import { ChevronRight, Home } from 'lucide-react';
import AdvertisementDisplay from '../../components/Advertisement/AdvertisementDisplay';

// Define seller interface based on the SellerInfo component's needs
interface Seller {
  name: string;
  phone: string;
  verified: boolean;
  rating: number;
}

const CarDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchCar = async () => {
      setLoading(true);
      try {
        if (!id) {
          showToast('Invalid car ID', 'error');
          return;
        }
        
        console.log('Fetching car with ID:', id);
        
        // Use carService.getCar which already has fallback mechanism built in
        const data = await carService.getCar(Number(id));
        
        console.log('Car data received:', data);
        
        if (!data) {
          showToast('Car not found', 'error');
          return;
        }
        
        setCar(data);
      } catch (error) {
        console.error('Error fetching car:', error);
        showToast('Failed to load car details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id, showToast]);

  if (loading) {
    return (
      <Container>
        <div className="flex justify-center items-center py-20">
          <Loading />
          <p className="ml-4 text-gray-600">იტვირთება მანქანის მონაცემები...</p>
        </div>
      </Container>
    );
  }

  if (!car) {
    return (
      <Container>
        <div className="py-8 text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">მანქანა ვერ მოიძებნა</h2>
          <p className="text-gray-500 mb-6">მითითებული ID-ით მანქანა ვერ მოიძებნა.</p>
          <Link to="/transports" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition-all">
            დაბრუნდი მანქანების სიაში
          </Link>
        </div>
      </Container>
    );
  }

  // Extract image URLs from car images array
  const imageUrls = car.images?.map(image => image.large_url || image.url) || [];
  
  // Extract category ID for similar cars
  const categoryId = car.category_id?.toString() || '';
  
  // Format price for display
  const formattedPrice = new Intl.NumberFormat('ka-GE', {
    style: 'currency',
    currency: 'GEL',
    maximumFractionDigits: 0
  }).format(car.price || 0);

  return (
    <div className="bg-background min-h-screen rounded-lg">
      <Container>
        {/* Top Advertisement - responsive */}
        <div className="my-3 pt-3 flex justify-center">
          <AdvertisementDisplay 
            placement="car_details_top" 
            className="w-full md:w-[728px] h-[90px] md:h-[140px] rounded-lg shadow-md max-w-full overflow-hidden transition-all duration-300" 
          />
        </div>

        {/* Breadcrumb navigation */}
        <div className="py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                  <Home className="w-4 h-4 mr-2" />
                  მთავარი
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <Link to="/cars" className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2">მანქანები</Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 truncate max-w-[150px]">
                    {car.title || `${car.brand || ''} ${car.model || ''}`}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        
        <div className="pb-12 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column with image gallery and car info */}
            <div className="lg:col-span-2">
              {/* Image Gallery */}
              {imageUrls.length > 0 ? (
                <ImageGallery images={imageUrls} />
              ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="bg-gray-200 h-[500px] flex items-center justify-center">
                    <div className="text-center p-6">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="mt-2 text-gray-500">ამ მანქანისთვის სურათები არ არის ხელმისაწვდომი</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Car Info Component */}
              <div className="mt-8">
                <CarInfo car={car} />
              </div>
            </div>
            
            {/* Right column with seller info */}
            <div className="lg:col-span-1">
              {/* Seller Info Component */}
              <SellerInfo 
                seller={{
                  name: 'Car Owner',
                  phone: '+995 555 123456',
                  verified: true,
                  rating: 4.5
                }}
                price={car.price || 0}
                carId={car.id?.toString() || ''}
              />
              
              {/* Sidebar advertisement removed as requested */}
              
              {/* Simplified seller information */}
              {car.location && (
                <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                  <h3 className="font-semibold text-lg mb-4">მდებარეობა</h3>
                  <p className="font-medium">
                    {car.location.city || ''}
                    {car.location.country && `, ${car.location.country}`}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Bottom Advertisement - responsive */}
          <div className="my-8 flex justify-center">
            <AdvertisementDisplay 
              placement="car_details_bottom" 
              className="w-full md:w-[728px] h-[90px] md:h-[140px] rounded-lg shadow-md max-w-full overflow-hidden transition-all duration-300" 
            />
          </div>
          
          {/* Similar cars section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6">მსგავსი მანქანები, რომლებიც შეიძლება მოგეწონოთ</h2>
            <SimilarCars 
              carId={car.id?.toString() || ''} 
              category={categoryId} 
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CarDetails;
