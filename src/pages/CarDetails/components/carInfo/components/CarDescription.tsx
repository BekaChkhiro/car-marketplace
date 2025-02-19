import React from 'react';

interface CarDescriptionProps {
  description: string;
}

const CarDescription: React.FC<CarDescriptionProps> = ({ description }) => {
  return (
    <div className="my-10">
      <h2 className="text-2xl text-gray-800 mb-6 font-semibold">Description</h2>
      <p className="text-base text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

export default CarDescription;