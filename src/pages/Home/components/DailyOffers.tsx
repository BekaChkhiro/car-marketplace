import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, Heart, ArrowRight, Fuel, Gauge, Settings } from 'lucide-react';
import data from '../../../data/cars.json';
import { usePrice } from '../../../context/usePrice';

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  images: string[];
  specifications: {
    fuelType: string;
    mileage: number;
    transmission: string;
  };
}

interface OfferCar extends Car {
  oldPrice: number;
  discount: number;
}

const DailyOffers: React.FC = () => {
  const { formatPrice } = usePrice();
  const offerCars: OfferCar[] = data.cars.slice(0, 2).map(car => ({
    ...car,
    oldPrice: car.price,
    price: Math.round(car.price * 0.85),
    discount: 15
  }));

  return (
    <section className="py-20 bg-gradient-to-b from-background to-gray-50/15">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
            დღის სპეციალური შეთავაზებები
          </h2>
          <p className="text-lg text-secondary mb-8">
            არ გამოტოვოთ ეს ექსკლუზიური შეთავაზებები. დროებითი ფასდაკლებები პრემიუმ ავტომობილებზე.
          </p>
          <div className="flex justify-center gap-4">
            {[['საათი', '23'], ['წუთი', '45'], ['წამი', '59']].map(([unit, value]) => (
              <div key={unit} className="flex flex-col items-center bg-white p-4 rounded-xl shadow-md min-w-[80px]">
                <span className="text-2xl font-bold text-primary">{value}</span>
                <span className="text-sm text-secondary uppercase">{unit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {offerCars.map((car) => (
            <Link key={car.id} to={`/cars/${car.id}`} className="group grid grid-cols-1 md:grid-cols-[1fr,1.5fr] bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative">
              <div className="relative overflow-hidden">
                <div className="w-full h-full min-h-[300px] bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                     style={{ backgroundImage: `url(${car.images[0]})` }}>
                </div>
                <div className="absolute top-4 left-4 bg-gradient-to-r from-primary to-primary-dark text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2">
                  <Tag className="w-4 h-4" /> {car.discount}% OFF
                </div>
                <button onClick={(e) => {
                  e.preventDefault();
                }} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center transition-all hover:scale-110 hover:bg-white">
                  <Heart className="w-5 h-5 text-primary" />
                </button>
              </div>

              <div className="p-6 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center justify-between group-hover:text-primary">
                  {car.year} {car.make} {car.model}
                  <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
                </h3>

                <div className="mb-8">
                  <div className="flex items-baseline gap-4 mb-2">
                    <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                      {formatPrice(car.price)}
                    </span>
                    <span className="text-lg text-secondary line-through">
                      {formatPrice(car.oldPrice)}
                    </span>
                  </div>
                  <div className="text-sm text-green-600">
                    თქვენ ზოგავთ {formatPrice(car.oldPrice - car.price)}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-auto pt-6 border-t border-gray-100">
                  <div className="flex flex-col items-center gap-1">
                    <Fuel className="w-6 h-6 text-primary" />
                    <span className="text-sm font-medium text-gray-900">{car.specifications.fuelType}</span>
                    <span className="text-xs text-secondary">საწვავის ტიპი</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Gauge className="w-6 h-6 text-primary" />
                    <span className="text-sm font-medium text-gray-900">{car.specifications.mileage}კმ</span>
                    <span className="text-xs text-secondary">გარბენი</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Settings className="w-6 h-6 text-primary" />
                    <span className="text-sm font-medium text-gray-900">{car.specifications.transmission}</span>
                    <span className="text-xs text-secondary">გადაცემათა კოლოფი</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DailyOffers;