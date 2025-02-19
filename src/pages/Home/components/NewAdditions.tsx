import React from 'react';
import { Link } from 'react-router-dom';
import { FaGasPump, FaTachometerAlt, FaCog, FaArrowRight, FaHeart, FaClock } from 'react-icons/fa';
import data from '../../../data/cars.json';

const NewAdditions: React.FC = () => {
  const newCars = data.cars.slice(0, 4);

  return (
    <section className="py-20 bg-gradient-to-b from-background to-gray-50/15">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Latest Additions
            </h2>
            <p className="text-lg text-secondary leading-relaxed">
              Discover our newest vehicles added to the marketplace
            </p>
          </div>
          
          <Link
            to="/cars?sort=newest"
            className="flex items-center gap-2 px-6 py-3 text-primary font-semibold border-2 border-primary/30 rounded-lg transition-all duration-300 hover:bg-primary/10 hover:-translate-y-0.5 group"
          >
            View All Listings <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {newCars.map((car) => (
            <Link
              key={car.id}
              to={`/cars/${car.id}`}
              className="group bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="relative pt-[66.67%] overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                  style={{ backgroundImage: `url(${car.images[0]})` }}
                />
                <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-semibold rounded-lg shadow-md flex items-center gap-1">
                  <FaClock /> Just Added
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center transition-all hover:scale-110 hover:bg-white"
                >
                  <FaHeart className="text-primary" />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1 flex items-center justify-between group-hover:text-primary">
                    {car.year} {car.make} {car.model}
                    <FaArrowRight className="opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
                  </h3>
                  <div className="text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                    ${car.price.toLocaleString()}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
                  <div className="flex flex-col items-center gap-1">
                    <FaGasPump className="text-xl text-primary" />
                    <span className="text-sm font-medium text-gray-900">{car.specifications.fuelType}</span>
                    <span className="text-xs text-secondary">Fuel Type</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <FaTachometerAlt className="text-xl text-primary" />
                    <span className="text-sm font-medium text-gray-900">{car.specifications.mileage}km</span>
                    <span className="text-xs text-secondary">Mileage</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <FaCog className="text-xl text-primary" />
                    <span className="text-sm font-medium text-gray-900">{car.specifications.transmission}</span>
                    <span className="text-xs text-secondary">Trans.</span>
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

export default NewAdditions;