import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../../../../components/ui';
import { useNavigate } from 'react-router-dom';

const EmptyState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-sm p-12 text-center my-8">
      <img 
        src="/assets/images/empty-cars.svg" 
        alt="No cars" 
        className="w-48 h-48 mb-6 opacity-80"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = 'https://placehold.co/200x200?text=No+Cars';
        }}
      />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">თქვენ ჯერ არ გაქვთ განცხადებები</h3>
      <p className="text-gray-600 mb-6 max-w-md">დაამატეთ თქვენი პირველი განცხადება და გაყიდეთ თქვენი ავტომობილი სწრაფად</p>
      <Button 
        onClick={() => navigate('/profile/add-car')}
        className="flex items-center gap-2 px-6 py-3 transition-all duration-300 hover:-translate-y-0.5"
      >
        <Plus size={18} />
        პირველი განცხადების დამატება
      </Button>
    </div>
  );
};

export default EmptyState;