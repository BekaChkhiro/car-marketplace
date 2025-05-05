import React from 'react';
import { Car } from '../../../../api/types/car.types';
import { 
  Calendar, Gauge, Fuel, Shield, 
  Zap, Truck, Sliders, Tag 
} from 'lucide-react';
import { KeySpec } from '../../hooks/useCarDetails';

interface CarSpecsProps {
  car: Car;
}

const CarSpecs: React.FC<CarSpecsProps> = ({ car }) => {
  // Format year
  const year = car.year ? car.year.toString() : '';
  
  // Get key specifications with enhanced styling
  const keySpecs: KeySpec[] = [
    { 
      icon: <Calendar className="w-5 h-5 text-blue-500" />, 
      label: 'წელი', 
      value: year,
      color: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    { 
      icon: <Gauge className="w-5 h-5 text-green-500" />, 
      label: 'გარბენი', 
      value: car.specifications?.mileage ? `${car.specifications.mileage.toLocaleString()} კმ` : 'N/A',
      color: 'bg-green-50',
      textColor: 'text-green-700'
    },
    { 
      icon: <Fuel className="w-5 h-5 text-orange-500" />, 
      label: 'საწვავი', 
      value: car.specifications?.fuel_type || 'N/A',
      color: 'bg-orange-50',
      textColor: 'text-orange-700'
    },
    { 
      icon: <Shield className="w-5 h-5 text-purple-500" />, 
      label: 'სათავსო', 
      value: car.specifications?.transmission || 'N/A',
      color: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
  ];
  
  // Additional specifications
  const additionalSpecs: KeySpec[] = [
    { 
      icon: <Sliders className="w-5 h-5 text-indigo-500" />, 
      label: 'ძრავის ტიპი', 
      value: car.specifications?.engine_type || 'N/A',
      color: 'bg-indigo-50'
    },
    { 
      icon: <Truck className="w-5 h-5 text-rose-500" />, 
      label: 'სათადარიგო', 
      value: car.specifications?.drive_type || 'N/A',
      color: 'bg-rose-50'
    },
    { 
      icon: <Zap className="w-5 h-5 text-yellow-500" />, 
      label: 'ცხენის ძალა', 
      value: car.specifications?.horsepower ? `${car.specifications.horsepower} HP` : 'N/A',
      color: 'bg-yellow-50'
    },
    { 
      icon: <Tag className="w-5 h-5 text-cyan-500" />, 
      label: 'ფერი', 
      value: car.specifications?.color || 'N/A',
      color: 'bg-cyan-50'
    },
  ];
  
  // Features list
  const carFeatures = [
    { name: 'კონდიციონერი', value: car.specifications?.has_air_conditioning },
    { name: 'აბს', value: car.specifications?.has_abs },
    { name: 'საბარგო კომპიუტერი', value: car.specifications?.has_board_computer },
    { name: 'კრუიზ კონტროლი', value: car.specifications?.has_cruise_control },
    { name: 'სავარძლების გათბობა', value: car.specifications?.has_seat_heating },
    { name: 'სატელიტური ნავიგაცია', value: car.specifications?.has_navigation },
    { name: 'უკანა ხედის კამერა', value: car.specifications?.has_rear_view_camera },
    { name: 'საბურავის კონტროლი', value: car.specifications?.has_parking_control },
  ].filter(feature => feature.value !== undefined);

  return (
    <div className="mt-4 bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">მანქანის სპეციფიკაციები</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        {keySpecs.map((spec, index) => (
          <div 
            key={index} 
            className={`p-3 rounded-lg ${spec.color || 'bg-gray-50'} flex flex-col spec-item`}
          >
            <div className="flex items-center mb-1">
              {spec.icon}
              <span className="text-xs ml-1 text-gray-600">{spec.label}</span>
            </div>
            <span className={`font-medium ${spec.textColor || 'text-gray-800'}`}>{spec.value}</span>
          </div>
        ))}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-700 mb-3">დამატებითი სპეციფიკაციები</h3>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {additionalSpecs.map((spec, index) => (
          <div 
            key={index} 
            className={`p-3 rounded-lg ${spec.color || 'bg-gray-50'} flex flex-col spec-item`}
          >
            <div className="flex items-center mb-1">
              {spec.icon}
              <span className="text-xs ml-1 text-gray-600">{spec.label}</span>
            </div>
            <span className="font-medium">{spec.value}</span>
          </div>
        ))}
      </div>
      
      {carFeatures.length > 0 && (
        <>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">ფუნქციები და აღჭურვილობა</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {carFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="flex items-center p-2 rounded-lg bg-gray-50 spec-item"
              >
                <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${feature.value ? 'bg-green-500' : 'bg-red-500'}`}>
                  <span className="text-white text-[10px]">
                    {feature.value ? '✓' : '✕'}
                  </span>
                </div>
                <span className="text-sm">{feature.name}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CarSpecs;
