import React, { useState } from 'react';
import { Car } from '../../../../api/types/car.types';
import { 
  Calendar, Gauge, Fuel, Shield, 
  Zap, Truck, Sliders, Tag, CheckCircle, XCircle,
  Settings, List, Grid
} from 'lucide-react';
import { KeySpec } from '../../hooks/useCarDetails';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../../i18n';
import './styles.css';

interface CarSpecsProps {
  car: Car;
}

const CarSpecs: React.FC<CarSpecsProps> = ({ car }) => {
  const [activeTab, setActiveTab] = useState<'specs'|'features'>('specs');
  const { t } = useTranslation([namespaces.carDetails, namespaces.common]);
  
  // Format year
  const year = car.year ? car.year.toString() : '';
  
  // Get key specifications with enhanced styling
  const keySpecs: KeySpec[] = [
    { 
      icon: <Calendar className="w-5 h-5 text-primary" />, 
      label: t('carDetails:specs.year'), 
      value: year,
      color: 'bg-green-50',
      textColor: 'text-primary'
    },
    { 
      icon: <Gauge className="w-5 h-5 text-primary" />, 
      label: t('carDetails:specs.mileage'), 
      value: car.specifications?.mileage ? `${car.specifications.mileage.toLocaleString()} კმ` : 'N/A',
      color: 'bg-green-50',
      textColor: 'text-primary'
    },
    { 
      icon: <Fuel className="w-5 h-5 text-primary" />, 
      label: t('carDetails:specs.fuel'), 
      value: car.specifications?.fuel_type || 'N/A',
      color: 'bg-green-50',
      textColor: 'text-primary'
    },
    { 
      icon: <Shield className="w-5 h-5 text-primary" />, 
      label: t('carDetails:specs.transmission'), 
      value: car.specifications?.transmission || 'N/A',
      color: 'bg-green-50',
      textColor: 'text-primary'
    },
  ];
  
  // Additional specifications
  const additionalSpecs: KeySpec[] = [
    { 
      icon: <Sliders className="w-5 h-5 text-primary" />, 
      label: t('carDetails:specs.engine'), 
      value: car.specifications?.engine_type || 'N/A',
      color: 'bg-green-50'
    },
    { 
      icon: <Truck className="w-5 h-5 text-primary" />, 
      label: t('carDetails:specs.driveType'), 
      value: car.specifications?.drive_type || 'N/A',
      color: 'bg-green-50'
    },
    { 
      icon: <Zap className="w-5 h-5 text-primary" />, 
      label: t('common:horsepower'), 
      value: car.specifications?.horsepower ? `${car.specifications.horsepower} HP` : 'N/A',
      color: 'bg-green-50'
    },
    { 
      icon: <Tag className="w-5 h-5 text-primary" />, 
      label: t('carDetails:specs.color'), 
      value: car.specifications?.color || 'N/A',
      color: 'bg-green-50'
    },
  ];
  
  // Features list
  const carFeatures = [
    { name: t('common:features.airConditioning'), value: car.specifications?.has_air_conditioning },
    { name: t('common:features.abs'), value: car.specifications?.has_abs },
    { name: t('common:features.boardComputer'), value: car.specifications?.has_board_computer },
    { name: t('common:features.cruiseControl'), value: car.specifications?.has_cruise_control },
    { name: t('common:features.seatHeating'), value: car.specifications?.has_seat_heating },
    { name: t('common:features.navigation'), value: car.specifications?.has_navigation },
    { name: t('common:features.rearCamera'), value: car.specifications?.has_rear_view_camera },
    { name: t('common:features.parkingControl'), value: car.specifications?.has_parking_control },
  ].filter(feature => feature.value !== undefined);

  return (
    <div className="mt-4 sm:mt-6 bg-white rounded-xl shadow-md p-4 sm:p-6 border border-green-100 car-detail-card">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4 sm:mb-6 overflow-x-auto hide-scrollbar">
        <button
          className={`tab-button whitespace-nowrap ${activeTab === 'specs' ? 'active' : 'text-gray-600'}`}
          onClick={() => setActiveTab('specs')}
        >
          <div className="flex items-center gap-1 sm:gap-2">
            <Settings size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="text-sm sm:text-base">{t('carDetails:specs.specs', 'სპეციფიკაციები')}</span>
          </div>
        </button>
        <button
          className={`tab-button whitespace-nowrap ${activeTab === 'features' ? 'active' : 'text-gray-600'}`}
          onClick={() => setActiveTab('features')}
        >
          <div className="flex items-center gap-1 sm:gap-2">
            <List size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="text-sm sm:text-base">{t('carDetails:specs.features')}</span>
          </div>
        </button>
      </div>
      
      {activeTab === 'specs' && (
        <div className="animate-fade-in">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">{t('common:mainSpecifications')}</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {keySpecs.map((spec, index) => (
              <div 
                key={index} 
                className={`p-3 sm:p-4 rounded-lg ${spec.color || 'bg-green-50'} flex flex-col spec-item`}
              >
                <div className="flex items-center mb-1 sm:mb-2">
                  {spec.icon}
                  <span className="text-xs sm:text-sm ml-2 text-gray-700">{spec.label}</span>
                </div>
                <span className={`font-medium text-base sm:text-lg ${spec.textColor || 'text-primary'}`}>{spec.value}</span>
              </div>
            ))}
          </div>
          
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">{t('common:additionalSpecifications')}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {additionalSpecs.map((spec, index) => (
              <div 
                key={index} 
                className={`p-3 sm:p-4 rounded-lg ${spec.color || 'bg-green-50'} flex flex-col spec-item`}
              >
                <div className="flex items-center mb-1 sm:mb-2">
                  {spec.icon}
                  <span className="text-xs sm:text-sm ml-2 text-gray-700">{spec.label}</span>
                </div>
                <span className="font-medium text-base sm:text-lg text-primary">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {activeTab === 'features' && carFeatures.length > 0 && (
        <div className="animate-fade-in">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">{t('common:featuresAndEquipment')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {carFeatures.map((feature, index) => (
              <div 
                key={index} 
                className={`flex items-center p-3 sm:p-4 rounded-lg ${feature.value ? 'bg-green-50' : 'bg-gray-50'} feature-badge ${feature.value ? 'active' : ''}`}
              >
                {feature.value ? (
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                ) : (
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                )}
                <span className="text-xs sm:text-sm font-medium ml-2">{feature.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarSpecs;
