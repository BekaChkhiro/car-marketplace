import React from 'react';
import AdvertisementDisplay from '../../../../components/Advertisement/AdvertisementDisplay';

const AdvertisementSection: React.FC = () => {
  return (
    <div className="mt-8 flex justify-center">
      <AdvertisementDisplay 
        placement="car_details_bottom" 
        className="w-full md:w-[728px] h-[90px] md:h-[140px] rounded-lg shadow-md max-w-full overflow-hidden transition-all duration-300" 
      />
    </div>
  );
};

export default AdvertisementSection;
