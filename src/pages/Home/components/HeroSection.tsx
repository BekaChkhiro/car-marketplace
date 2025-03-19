import React, { useState } from 'react';
import FeaturedSlider from './FeaturedSlider';
import VerticalSearchFilter from '../../../components/VerticalSearchFilter';

interface FormData {
  brand: string;
  model: string;
  category: string;
  year: string;
  transmission: string;
  fuelType: string;
  location: string;
}

const HeroSection: React.FC = () => {
  const [filters, setFilters] = useState<FormData>({
    brand: '',
    model: '',
    category: '',
    year: '',
    transmission: '',
    fuelType: '',
    location: ''
  });

  const handleFilterChange = (newFilters: FormData) => {
    setFilters(newFilters);
  };

  return (
    <section className='flex items-stretch gap-8 p-4 h-[680px]'>
      <div className='w-3/4 h-full'>
        <FeaturedSlider />
      </div>
      <div className='w-1/4 h-full'>
        <VerticalSearchFilter onFilterChange={handleFilterChange} />
      </div>
    </section>
  );
};

export default HeroSection;