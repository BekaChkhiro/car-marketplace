import React, { useState } from 'react';
import { Car } from '../../../../api/types/car.types';
import { 
  Calendar, Gauge, Fuel, Shield, 
  Zap, Truck, Sliders, Tag, CheckCircle, XCircle,
  Settings, List, Grid, Droplet, Layers, Compass, Palette, 
  Sofa, Circle, HeartPulse, FileText
} from 'lucide-react';
import { KeySpec } from '../../hooks/useCarDetails';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../../i18n';
import './styles.css';

interface CarSpecsProps {
  car: Car;
}

const CarSpecs: React.FC<CarSpecsProps> = ({ car }) => {
  const [activeTab, setActiveTab] = useState<'specs'|'features'|'description'>('specs');
  const { t, i18n } = useTranslation([namespaces.carDetails, namespaces.common]);

  // Reset to specs tab if description tab is active on mobile
  React.useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768 && activeTab === 'description') {
        setActiveTab('specs');
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [activeTab]);

  // Helper function to translate colors
  const translateColor = (color: string | undefined) => {
    if (!color) return t('common:notAvailable', 'არ არის');
    const colorKey = color.toLowerCase();
    return t(`carDetails:colors.${colorKey}`, color);
  };

  // Helper function to translate transmission
  const translateTransmission = (transmission: string | undefined) => {
    if (!transmission) return t('common:notAvailable', 'არ არის');
    
    // Map Georgian transmission types to English translation keys
    const transmissionMap: { [key: string]: string } = {
      'მექანიკა': 'manual',
      'ავტომატიკა': 'automatic',
      'ვარიატორი': 'variator',
      'ნახევრად ავრომატური': 'semiAutomatic',
      // English mappings
      'manual': 'manual',
      'automatic': 'automatic',
      'variator': 'variator',
      'semiAutomatic': 'semiAutomatic'
    };
    
    const normalizedTransmission = transmission.toLowerCase().replace(/\s+/g, '');
    const transmissionKey = transmissionMap[normalizedTransmission] || normalizedTransmission;
    
    return t(`carDetails:transmission.${transmissionKey}`, transmission);
  };

  // Helper function to translate drive type
  const translateDriveType = (driveType: string | undefined) => {
    if (!driveType) return t('common:notAvailable', 'არ არის');
    const driveTypeKey = driveType.toLowerCase();
    return t(`carDetails:driveType.${driveTypeKey}`, driveType);
  };

  // Helper function to translate steering wheel
  const translateSteering = (steering: string | undefined) => {
    if (!steering) return t('common:notAvailable', 'არ არის');
    const steeringKey = steering.toLowerCase();
    return t(`carDetails:steering.${steeringKey}`, steering);
  };

  // Helper function to translate fuel type
  const translateFuelType = (fuelType: string | undefined) => {
    if (!fuelType) return t('common:notAvailable', 'არ არის');
    
    // Map Georgian fuel types to English translation keys
    const fuelTypeMap: { [key: string]: string } = {
      'ბენზინი': 'petrol',
      'დიზელი': 'diesel',
      'ელექტრო': 'electric',
      'ჰიბრიდი': 'hybrid',
      'თხევადი_გაზი': 'lpg',
      'ბუნებრივი_გაზი': 'cng',
      // English mappings (in case they come from backend)
      'petrol': 'petrol',
      'diesel': 'diesel',
      'electric': 'electric',
      'hybrid': 'hybrid',
      'lpg': 'lpg',
      'cng': 'cng',
    };
    
    const normalizedFuelType = fuelType.toLowerCase().replace(/\s+/g, '');
    const fuelKey = fuelTypeMap[normalizedFuelType] || normalizedFuelType;
    
    return t(`carDetails:fuelType.${fuelKey}`, fuelType);
  };

  // Helper function to translate interior material
  const translateInteriorMaterial = (material: string | undefined) => {
    if (!material) return t('common:notAvailable', 'არ არის');
    
    // Map Georgian interior material types to English translation keys
    const materialMap: { [key: string]: string } = {
      'ნაჭერი': 'fabric',
      'ტყავი': 'leather',
      'ხელოვნურიტყავი': 'vinyl',
      'კომბინირებული': 'fabric',
      'ალკანტარა': 'alcantara',
      // English mappings
      'leather': 'leather',
      'fabric': 'fabric',
      'cloth': 'cloth',
      'velour': 'velour',
      'alcantara': 'alcantara',
      'vinyl': 'vinyl',
      'plastic': 'plastic',
      'suede': 'suede'
    };
    
    const normalizedMaterial = material.toLowerCase().replace(/\s+/g, '');
    const materialKey = materialMap[normalizedMaterial] || normalizedMaterial;
    
    return t(`carDetails:interiorMaterial.${materialKey}`, material);
  };

  // Helper function to translate brand names
  const translateBrand = (brand: string | undefined) => {
    if (!brand) return t('common:notAvailable', 'არ არის');
    const brandKey = brand.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
    return t(`carDetails:brands.${brandKey}`, brand);
  };

  // Helper function to translate model names
  const translateModel = (model: string | undefined) => {
    if (!model) return t('common:notAvailable', 'არ არის');
    const modelKey = model.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
    return t(`carDetails:models.${modelKey}`, model);
  };

  // Helper function to translate category
  const translateCategory = (category: string | undefined) => {
    if (!category) return t('common:notAvailable', 'არ არის');
    
    // Map Georgian categories to English translation keys
    const categoryMap: { [key: string]: string } = {
      'სედანი': 'sedan',
      'ჯიპი': 'suv',
      'კუპე': 'coupe',
      'ჰეტჩბექი': 'hatchback',
      'უნივერსალი': 'wagon',
      'კაბრიოლეტი': 'convertible',
      'პიკაპი': 'pickup',
      'მინივენი': 'minivan',
      'ლიმუზინი': 'limousine',
      'კროსოვერი': 'crossover',
      // English mappings
      'sedan': 'sedan',
      'suv': 'suv',
      'coupe': 'coupe',
      'hatchback': 'hatchback',
      'wagon': 'wagon',
      'convertible': 'convertible',
      'pickup': 'pickup',
      'minivan': 'minivan',
      'limousine': 'limousine',
      'crossover': 'crossover'
    };
    
    const normalizedCategory = category.toLowerCase().replace(/\s+/g, '');
    const categoryKey = categoryMap[normalizedCategory] || normalizedCategory;
    
    return t(`carDetails:categories.${categoryKey}`, category);
  };
  
  // Format year
  const year = car.year ? car.year.toString() : '';
  
  // Get key specifications with enhanced styling
  const keySpecs: KeySpec[] = [
    { 
      icon: <Gauge className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary" />, 
      label: t('carDetails:specs.mileage'), 
      value: car.specifications?.mileage ? `${car.specifications.mileage.toLocaleString()} ${t('carDetails:specs.km')}` : t('common:notAvailable', 'არ არის'),
      color: 'bg-green-50',
      textColor: 'text-primary'
    },
    { 
      icon: <Fuel className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary" />, 
      label: t('carDetails:specs.fuel'), 
      value: translateFuelType(car.specifications?.fuel_type),
      color: 'bg-green-50',
      textColor: 'text-primary'
    },
    { 
      icon: <Shield className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary" />, 
      label: t('carDetails:specs.transmission'), 
      value: translateTransmission(car.specifications?.transmission),
      color: 'bg-green-50',
      textColor: 'text-primary'
    },
    { 
      icon: <Tag className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary" />, 
      label: t('carDetails:specs.category'), 
      value: translateCategory(car.category_name),
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
      icon: <Tag className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary" />, 
      label: t('carDetails:specs.brand'), 
      value: translateBrand(car.brand),
      color: 'bg-green-50/50',
      textColor: 'text-gray-900'
    },
    { 
      icon: <Tag className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary" />, 
      label: t('carDetails:specs.model'), 
      value: translateModel(car.model),
      color: 'bg-green-50/50',
      textColor: 'text-gray-900'
    },
    { 
      icon: <Tag className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary" />, 
      label: t('carDetails:specs.vinCode'), 
      value: (car.vin_code && car.vin_code.trim()) ? car.vin_code : t('carDetails:specs.notSpecified'),
      color: 'bg-green-50/50',
      textColor: 'text-gray-900'
    },
    { 
      icon: <Droplet className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary" />, 
      label: t('carDetails:specs.engineSize'), 
      value: car.specifications?.engine_size ? `${car.specifications.engine_size !== undefined
        ? (typeof car.specifications.engine_size === 'number' 
           ? (Number.isInteger(car.specifications.engine_size) 
              ? car.specifications.engine_size + '.0' 
              : car.specifications.engine_size)
           : car.specifications.engine_size)
        : undefined} L` : t('common:notAvailable', 'არ არის'),
      color: 'bg-green-50/50',
      textColor: 'text-gray-900'
    },
    { 
      icon: <Layers className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary" />, 
      label: t('carDetails:specs.cylinders'), 
      value: car.specifications?.cylinders ? car.specifications.cylinders.toString() : t('common:notAvailable', 'არ არის'),
      color: 'bg-green-50/50',
      textColor: 'text-gray-900'
    },
    { 
      icon: <Truck className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary" />, 
      label: t('carDetails:specs.driveType'), 
      value: translateDriveType(car.specifications?.drive_type),
      color: 'bg-green-50/50',
      textColor: 'text-gray-900'
    },
    { 
      icon: <Compass className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary" />, 
      label: t('carDetails:specs.steeringWheel'), 
      value: translateSteering(car.specifications?.steering_wheel),
      color: 'bg-green-50/50',
      textColor: 'text-gray-900'
    },
    { 
      icon: <Palette className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary" />, 
      label: t('carDetails:specs.color'), 
      value: translateColor(car.specifications?.color),
      color: 'bg-green-50/50',
      textColor: 'text-gray-900'
    },
    { 
      icon: <Sofa className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary" />, 
      label: t('carDetails:specs.interiorMaterial'), 
      value: translateInteriorMaterial(car.specifications?.interior_material),
      color: 'bg-green-50/50',
      textColor: 'text-gray-900'
    },
    { 
      icon: <Circle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary" />, 
      label: t('carDetails:specs.interiorColor'), 
      value: translateColor(car.specifications?.interior_color),
      color: 'bg-green-50/50',
      textColor: 'text-gray-900'
    },
    { 
      icon: <HeartPulse className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary" />, 
      label: t('carDetails:specs.airbagsCount'), 
      value: car.specifications?.airbags_count ? car.specifications.airbags_count.toString() : t('common:notAvailable', 'არ არის'),
      color: 'bg-green-50/50',
      textColor: 'text-gray-900'
    },
  ];
  
  // Helper function to translate feature names
  const translateFeature = (featureName: string) => {
    const featureKey = featureName.toLowerCase().replace(/[^a-z0-9]/g, '');
    console.log(featureKey, featureName+"**************************");
    
    return t(`carDetails:features.${featureName}`, featureName);
  };

  // Features list with explicit fallback values - all required features from Georgian list
  const carFeatures = [
    // უსაფრთხოება
    { name: translateFeature('ABS'), value: car.specifications?.has_abs ?? false },
    { name: translateFeature('tractionControl'), value: car.specifications?.has_traction_control ?? false },
    { name: translateFeature('centralLocking'), value: car.specifications?.has_central_locking ?? false },
    { name: translateFeature('alarm'), value: car.specifications?.has_alarm ?? false },
    { name: translateFeature('fogLights'), value: car.specifications?.has_fog_lights ?? false },
    
    // კომფორტი
    { name: translateFeature('airConditioning'), value: car.specifications?.has_air_conditioning ?? false },
    { name: translateFeature('climateControl'), value: car.specifications?.has_climate_control ?? false },
    { name: translateFeature('heatedSeats'), value: car.specifications?.has_heated_seats ?? false },
    { name: translateFeature('seatMemory'), value: car.specifications?.has_seat_memory ?? false },
    { name: translateFeature('cruiseControl'), value: car.specifications?.has_cruise_control ?? false },
    { name: translateFeature('startStop'), value: car.specifications?.has_start_stop ?? false },
    { name: translateFeature('sunroof'), value: car.specifications?.has_sunroof ?? false },
    { name: translateFeature('electricWindows'), value: car.specifications?.has_electric_windows ?? false },
    
    // ელექტრონიკა
    { name: translateFeature('boardComputer'), value: car.specifications?.has_board_computer ?? false },
    { name: translateFeature('navigation'), value: car.specifications?.has_navigation ?? false },
    { name: translateFeature('parkingControl'), value: car.specifications?.has_parking_control ?? false },
    { name: translateFeature('rearViewCamera'), value: car.specifications?.has_rear_view_camera ?? false },
    { name: translateFeature('aux'), value: car.specifications?.has_aux ?? false },
    { name: translateFeature('bluetooth'), value: car.specifications?.has_bluetooth ?? false },
    { name: translateFeature('multifunctionSteeringWheel'), value: car.specifications?.has_multifunction_steering_wheel ?? false },
    
    // დამატებითი აღჭურვილობა
    { name: translateFeature('hydraulics'), value: car.specifications?.has_hydraulics ?? false },
    { name: translateFeature('alloyWheels'), value: car.specifications?.has_alloy_wheels ?? false },
    { name: translateFeature('spareTire'), value: car.specifications?.has_spare_tire ?? false },
    { name: translateFeature('disabilityAdapted'), value: car.specifications?.is_disability_adapted ?? false },
  ];

  return (
    <div className="mt-4 sm:mt-6 bg-white rounded-xl shadow-md p-4 sm:p-6 border border-green-100 car-detail-card">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4 sm:mb-6">
        <button
          className={`tab-button flex-1 text-center sm:whitespace-nowrap ${activeTab === 'specs' ? 'active' : 'text-gray-600'}`}
          onClick={() => setActiveTab('specs')}
        >
          <div className="flex items-center justify-center gap-1 sm:gap-2">
            <Settings size={14} className="sm:size-4 md:w-[18px] md:h-[18px]" />
            <span className="text-xs sm:text-sm md:text-base">{t('carDetails:specs.specifications')}</span>
          </div>
        </button>
        <button
          className={`tab-button flex-1 text-center sm:whitespace-nowrap ${activeTab === 'features' ? 'active' : 'text-gray-600'}`}
          onClick={() => setActiveTab('features')}
        >
          <div className="flex items-center justify-center gap-1 sm:gap-2">
            <List size={14} className="sm:size-4 md:w-[18px] md:h-[18px]" />
            <span className="text-xs sm:text-sm md:text-base">{t('carDetails:specs.features')}</span>
          </div>
        </button>
        <button
          className={`tab-button whitespace-nowrap hidden md:flex ${activeTab === 'description' ? 'active' : 'text-gray-600'}`}
          onClick={() => setActiveTab('description')}
        >
          <div className="flex items-center justify-center gap-1 sm:gap-2">
            <FileText size={14} className="sm:size-4 md:w-[18px] md:h-[18px]" />
            <span className="text-xs sm:text-sm md:text-base">{t('carDetails:specs.description')}</span>
          </div>
        </button>
      </div>
      
      {activeTab === 'specs' && (
        <div className="animate-fade-in">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 sm:mb-8">
            {keySpecs.map((spec, index) => (
              <div 
                key={index} 
                className="flex items-center p-2 sm:p-3 bg-green-50/50 rounded-xl transition-all hover:bg-green-50 border border-green-100"
              >
                <div className="bg-primary/10 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3">
                  {spec.icon}
                </div>
                <div>
                  <span className="text-[10px] sm:text-xs text-gray-500 block">{spec.label}</span>
                  <span className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base">{spec.value}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {additionalSpecs.map((spec, index) => (
              <div 
                key={index} 
                className="flex items-center p-2 sm:p-3 bg-green-50/50 rounded-xl transition-all hover:bg-green-50 border border-green-100"
              >
                <div className="bg-primary/10 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3">
                  {spec.icon}
                </div>
                <div>
                  <span className="text-[10px] sm:text-xs text-gray-500 block">{spec.label}</span>
                  <span className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base">{spec.value}</span>
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
                className={`flex items-center p-2 sm:p-3 md:p-4 rounded-lg ${feature.value ? 'bg-green-50 border border-green-100' : 'bg-gray-50'} feature-badge ${feature.value ? 'active' : ''}`}
              >
                {feature.value ? (
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary" />
                ) : (
                  <XCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-400" />
                )}
                <span className={`text-[10px] sm:text-xs md:text-sm font-medium ml-2 ${feature.value ? 'text-gray-800' : 'text-gray-500'}`}>{feature.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {activeTab === 'description' && (
        <div className="animate-fade-in">
          <div className="prose prose-sm sm:prose max-w-none">
            {(() => {
              // Get the appropriate description based on current language
              const currentLang = i18n.language;
              let description = '';
              
              if (currentLang === 'ka') {
                description = car.description_ka || '';
              } else if (currentLang === 'en') {
                description = car.description_en || car.description_ka || '';
              } else if (currentLang === 'ru') {
                description = car.description_ru || car.description_ka || '';
              } else {
                description = car.description_ka || '';
              }
              
              if (!description || description.trim() === '') {
                return (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>{t('carDetails:specs.noDescription')}</p>
                  </div>
                );
              }
              
              return (
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {description}
                  </p>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarSpecs;
