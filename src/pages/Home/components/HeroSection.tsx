import React from 'react';
import FeaturedSlider from './FeaturedSlider';
import VerticalSearchFilter from '../../../components/VerticalSearchFilter';

const HeroSection: React.FC = () => {
  return (
    <section className='flex items-stretch gap-8 p-4 h-[650px]'>
      <div className='w-3/4 h-full'>
        <FeaturedSlider />
      </div>
      <div className='w-1/4 h-full'>
        <VerticalSearchFilter />
      </div>
    </section>
  );
};

export default HeroSection;