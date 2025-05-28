import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import FeaturedSlider from './FeaturedSlider';
import VerticalSearchFilter from '../../../components/VerticalSearchFilter';

interface FormData {
  brand: string;
  model: string;
  category: string;
  priceFrom: string;
  priceTo: string;
  transmission: string;
  location: string;
}

const HeroSection: React.FC = () => {
  const [filters, setFilters] = useState<FormData>({
    brand: '',
    model: '',
    category: '',
    priceFrom: '',
    priceTo: '',
    transmission: '',
    location: ''
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFilterChange = (newFilters: FormData) => {
    setFilters(newFilters);
  };

  return (
    <section className='flex flex-col lg:flex-row items-stretch gap-4 sm:gap-6 lg:gap-8 p-0 sm:p-4 h-auto lg:h-[680px] w-full'>
      <div className='w-full lg:w-3/4 h-[200px] sm:h-[380px] md:h-[550px] lg:h-full'>
        <FeaturedSlider />
      </div>
      <div className='w-full lg:w-1/4 h-auto mt-4 lg:mt-0'>
        <VerticalSearchFilter onFilterChange={handleFilterChange} />
      </div>
    </section>
  );
};

export default HeroSection;