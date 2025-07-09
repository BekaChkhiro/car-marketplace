import React, { useState } from 'react';
import { Car } from '../../../../api/types/car.types';
import { 
  Calendar, Gauge, Fuel, Shield, 
  Zap, Truck, Sliders, Tag, CheckCircle, XCircle,
  Settings, List, Grid, Droplet, Layers, Compass, Palette, 
  Sofa, Circle, HeartPulse
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
      icon: <Gauge className="w-5 h-5 text-primary" />, 
      label: t('carDetails:specs.mileage'), 
      value: car.specifications?.mileage ? `${car.specifications.mileage.toLocaleString()} კმ` : t('common:notAvailable', 'არ არის'),
      color: 'bg-green-50',
      textColor: 'text-primary'
    },
    { 
      icon: <Fuel className="w-5 h-5 text-primary" />, 
      label: t('carDetails:specs.fuel'), 
      value: car.specifications?.fuel_type || t('common:notAvailable', 'არ არის'),
      color: 'bg-green-50',
      textColor: 'text-primary'
    },
    { 
      icon: <Shield className="w-5 h-5 text-primary" />, 
      label: t('carDetails:specs.transmission'), 
      value: car.specifications?.transmission || t('common:notAvailable', 'არ არის'),
      color: 'bg-green-50',
      textColor: 'text-primary'
    },
    { 
      icon: <Tag className="w-5 h-5 text-primary" />, 
      label: t('carDetails:specs.category', 'კატეგორია'), 
      value: car.category_name || (car.category_id ? `კატეგორია ${car.category_id}` : t('common:notAvailable', 'არ არის')),
      color: 'bg-green-50',
      textColor: 'text-primary'
    },
  ];
  
  // Debug VIN code (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('Car VIN code:', car.vin_code);
  }
  
  // Additional specifications
  const additionalSpecs: KeySpec[] = [
    { 
      icon: <Tag className="w-5 h-5 text-primary" />, 
      label: 'VIN კოდი', 
      value: (car.vin_code && car.vin_code.trim()) ? car.vin_code : 'არ არის მითითებული',
      color: 'bg-green-50/50',
      textColor: 'text-gray-900'
    },
    { 
      icon: <Droplet className="w-5 h-5 text-primary" />, 
      label: 'ძრავის მოცულობა', 
      value: car.specifications?.engine_size ? `${car.specifications.engine_size} ლ` : t('common:notAvailable', 'არ არის'),
      color: 'bg-green-50/50',
      textColor: 'text-gray-900'
    },
    { 
      icon: <Layers className="w-5 h-5 text-primary" />, 
      label: 'ცილინდრების რაოდენობა', 
      value: car.specifications?.cylinders ? car.specifications.cylinders.toString() : t('common:notAvailable', 'არ არის'),
      color: 'bg-green-50/50',
      textColor: 'text-gray-900'
    },
    { 
      icon: <Gauge className="w-5 h-5 text-primary" />, 
      label: 'გარბენი', 
      value: car.specifications?.mileage ? `${car.specifications.mileage.toLocaleString()} კმ` : t('common:notAvailable', 'არ არის'),
      color: 'bg-green-50/50',
      textColor: 'text-gray-900'
    },
    { 
      icon: <Shield className="w-5 h-5 text-primary" />, 
      label: 'გადაცემათა კოლოფი', 
      value: car.specifications?.transmission || t('common:notAvailable', 'არ არის'),
      color: 'bg-green-50/50',
      textColor: 'text-gray-900'
    },
    { 
      icon: <Fuel className="w-5 h-5 text-primary" />, 
      label: 'საწვავის ტიპი', 
      value: car.specifications?.fuel_type || t('common:notAvailable', 'არ არის'),
      color: 'bg-green-50/50',
      textColor: 'text-gray-900'
    },
    { 
      icon: <Truck className="w-5 h-5 text-primary" />, 
      label: 'წამყვანი თვლები', 
      value: (() => {
        const driveType = car.specifications?.drive_type;
        if (!driveType) return t('common:notAvailable', 'არ არის');
        
        // Drive type translations
        const driveTypeMap: {[key: string]: string} = {
          'fwd': 'წინა',
          'rwd': 'უკანა',
          'awd': '4x4',
          '4wd': '4x4',
          'front': 'წინა',
          'rear': 'უკანა',
          'all': '4x4'
        };
        
        return driveTypeMap[driveType.toLowerCase()] || driveType;
      })(),
      color: 'bg-green-50/50',
      textColor: 'text-gray-900'
    },
    { 
      icon: <Compass className="w-5 h-5 text-primary" />, 
      label: 'საჭე', 
      value: (() => {
        const steering = car.specifications?.steering_wheel;
        if (!steering) return t('common:notAvailable', 'არ არის');
        
        // Steering wheel translations
        const steeringMap: {[key: string]: string} = {
          'left': 'მარცხენა',
          'right': 'მარჯვენა'
        };
        
        return steeringMap[steering.toLowerCase()] || steering;
      })(),
      color: 'bg-green-50/50',
      textColor: 'text-gray-900'
    },
    { 
      icon: <Palette className="w-5 h-5 text-primary" />, 
      label: 'ფერი', 
      value: (() => {
        const color = car.specifications?.color;
        if (!color) return t('common:notAvailable', 'არ არის');
        
        // Car color translations
        const colorMap: {[key: string]: string} = {
          'black': 'შავი',
          'white': 'თეთრი',
          'silver': 'ვერცხლისფერი',
          'gray': 'ნაცრისფერი',
          'grey': 'ნაცრისფერი',
          'red': 'წითელი',
          'blue': 'ლურჯი',
          'green': 'მწვანე',
          'yellow': 'ყვითელი',
          'gold': 'ოქროსფერი',
          'bronze': 'ბრინჯაოსფერი',
          'brown': 'ყავისფერი',
          'orange': 'ნარინჯისფერი',
          'purple': 'იისფერი',
          'burgundy': 'ბორდოსფერი',
          'maroon': 'მუქი წითელი',
          'navy': 'მუქი ლურჯი',
          'beige': 'კრემისფერი',
          'champagne': 'შამპანისფერი',
          'pearl': 'მარგალიტისფერი'
        };
        
        return colorMap[color.toLowerCase()] || color;
      })(),
      color: 'bg-green-50/50',
      textColor: 'text-gray-900'
    },
    { 
      icon: <Sofa className="w-5 h-5 text-primary" />, 
      label: 'სალონის მასალა', 
      value: car.specifications?.interior_material || t('common:notAvailable', 'არ არის'),
      color: 'bg-green-50/50',
      textColor: 'text-gray-900'
    },
    { 
      icon: <Circle className="w-5 h-5 text-primary" />, 
      label: 'სალონის ფერი', 
      value: (() => {
        const color = car.specifications?.interior_color;
        if (!color) return t('common:notAvailable', 'არ არის');
        
        // Interior color translations
        const interiorColorMap: {[key: string]: string} = {
          'black': 'შავი',
          'white': 'თეთრი', 
          'gray': 'ნაცრისფერი',
          'grey': 'ნაცრისფერი',
          'beige': 'კრემისფერი',
          'brown': 'ყავისფერი',
          'red': 'წითელი',
          'blue': 'ლურჯი',
          'tan': 'ღია ყავისფერი',
          'cream': 'კრემისფერი',
          'burgundy': 'ბორდოსფერი',
          'maroon': 'მუქი წითელი'
        };
        
        return interiorColorMap[color.toLowerCase()] || color;
      })(),
      color: 'bg-green-50/50',
      textColor: 'text-gray-900'
    },
    { 
      icon: <HeartPulse className="w-5 h-5 text-primary" />, 
      label: 'უსაფრთხოების ბალიშების რაოდენობა', 
      value: car.specifications?.airbags_count ? car.specifications.airbags_count.toString() : t('common:notAvailable', 'არ არის'),
      color: 'bg-green-50/50',
      textColor: 'text-gray-900'
    },
  ];
  
  // Features list with explicit fallback values
  const carFeatures = [
    { name: t('common:features.airConditioning', 'კონდიციონერი'), value: car.specifications?.has_air_conditioning ?? false },
    { name: t('common:features.abs', 'ABS'), value: car.specifications?.has_abs ?? false },
    { name: t('common:features.boardComputer', 'ბორტკომპიუტერი'), value: car.specifications?.has_board_computer ?? false },
    { name: t('common:features.cruiseControl', 'კრუიზ კონტროლი'), value: car.specifications?.has_cruise_control ?? false },
    { name: t('common:features.seatHeating', 'სავარძლების გათბობა'), value: car.specifications?.has_seat_heating ?? false },
    { name: t('common:features.navigation', 'ნავიგაცია'), value: car.specifications?.has_navigation ?? false },
    { name: t('common:features.rearCamera', 'უკანა ხედის კამერა'), value: car.specifications?.has_rear_view_camera ?? false },
    { name: t('common:features.parkingControl', 'პარკირების კონტროლი'), value: car.specifications?.has_parking_control ?? false },
    // Adding more common car features that might be useful
    { name: t('common:features.bluetooth', 'Bluetooth'), value: car.specifications?.has_bluetooth ?? false },
    { name: t('common:features.sunroof', 'სახურავის ლუკი'), value: car.specifications?.has_sunroof ?? false },
    { name: t('common:features.leatherSeats', 'ტყავის სალონი'), value: car.specifications?.has_leather_interior ?? false },
    { name: t('common:features.electricWindows', 'ელ. შუშები'), value: car.specifications?.has_electric_windows ?? false },
    { name: t('common:features.multifunctionSteeringWheel', 'მულტიფუნქციური საჭე'), value: car.specifications?.has_multifunction_steering_wheel ?? false },
    { name: t('common:features.startStopSystem', 'Start-Stop სისტემა'), value: car.specifications?.has_start_stop ?? false },
  ];

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
            <span className="text-sm sm:text-base">{t('carDetails:specs.specifications', 'სპეციფიკაციები')}</span>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 sm:mb-8">
            {keySpecs.map((spec, index) => (
              <div 
                key={index} 
                className="flex items-center p-3 bg-green-50/50 rounded-xl transition-all hover:bg-green-50 border border-green-100"
              >
                <div className="bg-primary/10 p-2 rounded-lg mr-3">
                  {spec.icon}
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">{spec.label}</span>
                  <span className="font-semibold text-gray-900">{spec.value}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {additionalSpecs.map((spec, index) => (
              <div 
                key={index} 
                className="flex items-center p-3 bg-green-50/50 rounded-xl transition-all hover:bg-green-50 border border-green-100"
              >
                <div className="bg-primary/10 p-2 rounded-lg mr-3">
                  {spec.icon}
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">{spec.label}</span>
                  <span className="font-semibold text-gray-900">{spec.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {activeTab === 'features' && carFeatures.length > 0 && (
        <div className="animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {carFeatures.map((feature, index) => (
              <div 
                key={index} 
                className={`flex items-center p-3 sm:p-4 rounded-lg ${feature.value ? 'bg-green-50 border border-green-100' : 'bg-gray-50'} feature-badge ${feature.value ? 'active' : ''}`}
              >
                {feature.value ? (
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                ) : (
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                )}
                <span className={`text-xs sm:text-sm font-medium ml-2 ${feature.value ? 'text-gray-800' : 'text-gray-500'}`}>{feature.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarSpecs;
