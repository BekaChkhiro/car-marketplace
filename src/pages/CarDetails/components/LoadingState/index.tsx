import React from 'react';
import { Container } from '../../../../components/ui';
import { Car as CarIcon } from 'lucide-react';

const LoadingState: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Container>
        <div className="flex flex-col justify-center items-center min-h-[70vh] py-20">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            <CarIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-500 w-6 h-6" />
          </div>
          <p className="mt-6 text-gray-700 font-medium text-lg">იტვირთება მანქანის მონაცემები...</p>
          <div className="mt-4 w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default LoadingState;
