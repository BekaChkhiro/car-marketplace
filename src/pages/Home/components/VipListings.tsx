import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Car } from '../../../api/types/car.types';
import carService from '../../../api/services/carService';
import CarCard from '../../../components/CarCard';
import { useToast } from '../../../context/ToastContext';

const VipListings: React.FC = () => {
  const [vipCars, setVipCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchVipCars = async () => {
      try {
        setLoading(true);
        const response = await carService.getCars({ featured: true, limit: 4 });
        // Ensure we always set an array, even if empty
        setVipCars(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error('Error fetching VIP cars:', error);
        showToast('Failed to load VIP listings', 'error');
        setVipCars([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchVipCars();
  }, [showToast]);

  const handleViewAllClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Return null only if loading, show empty state if no cars
  if (loading) {
    return null;
  }

  return (
    <section className="w-full px-4 py-8 bg-gradient-to-b from-gray-50/15 to-background">
      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r text-primary">
              VIP განცხადებები
            </h2>
          </div>
          
          <Link
            to="/cars?filter=vip"
            onClick={handleViewAllClick}
            className="flex items-center gap-2 px-6 py-3 text-primary font-semibold border-2 border-primary/30 rounded-lg transition-all duration-300 hover:bg-primary/10 hover:-translate-y-0.5 group"
          >
            ყველა VIP განცხადება <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {vipCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {vipCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No VIP listings available at the moment
          </div>
        )}
      </div>
    </section>
  );
};

export default VipListings;