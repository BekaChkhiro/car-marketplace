import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import data from '../../../data/cars.json';
import CarCard from '../../../components/CarCard';

const NewAdditions: React.FC = () => {
  const newCars = data.cars.slice(0, 4);

  const handleViewAllClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="w-full px-4 py-8 bg-gradient-to-b from-background to-gray-50/15">
      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r text-primary">
              ახალი დამატებები
            </h2>
          </div>
          
          <Link
            to="/transports?sort=newest"
            onClick={handleViewAllClick}
            className="flex items-center gap-2 px-6 py-3 text-primary font-semibold border-2 border-primary/30 rounded-lg transition-all duration-300 hover:bg-primary/10 hover:-translate-y-0.5 group"
          >
            ყველა განცხადება <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {newCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewAdditions;