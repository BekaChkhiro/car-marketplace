import React from 'react';
import { Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CarFeatures } from '../types';

interface FeaturesProps {
  features: Partial<CarFeatures>;
  onChange: (field: keyof CarFeatures, value: boolean) => void;
}

const Features: React.FC<FeaturesProps> = ({ features, onChange }) => {
  const { t } = useTranslation('profile');
  
  const featureGroups = {
    'safety': [
      'has_abs',
      'has_traction_control',
      'has_central_locking',
      'has_alarm',
      'has_fog_lights',
    ],
    'comfort': [
      'has_air_conditioning',
      'has_climate_control',
      'has_heated_seats',
      'has_seat_memory',
      'has_cruise_control',
      'has_start_stop',
      'has_sunroof',
      'has_electric_windows',
    ],
    'electronics': [
      'has_board_computer',
      'has_navigation',
      'has_parking_control',
      'has_rear_view_camera',
      'has_aux',
      'has_bluetooth',
      'has_multifunction_steering_wheel',
    ],
    'additional': [
      'has_hydraulics',
      'has_alloy_wheels',
      'has_spare_tire',
      'is_disability_adapted',
    ]
  } as const;

  return (
    <div className="bg-white rounded-xl p-6 border shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center transform transition-transform duration-300 group-hover:rotate-180">
          <Wrench size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{t('addCar.features.title')}</h2>
          <p className="text-sm text-gray-500">{t('addCar.features.subtitle')}</p>
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(featureGroups).map(([groupName, groupFeatures]) => (
          <div key={groupName} className="space-y-4 ">
            <h3 className="text-base font-semibold text-gray-800 border-b pb-2">{t(`addCar.features.groups.${groupName}`)}</h3>
            <div className="flex flex-wrap gap-3 w-full"> 
              {groupFeatures.map((key) => {
                const isActive = features[key as keyof CarFeatures] || false;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onChange(key as keyof CarFeatures, !isActive)}
                    className={`w-full sm:w-auto
                      px-2 sm:px-4 py-2 rounded-lg text-sm font-medium text-left transition-all duration-200
                      flex items-center gap-2 
                      ${isActive 
                        ? 'bg-primary/10 border-primary text-primary shadow-sm' 
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}
                    `}
                  >
                    <div className={`
                      w-4 h-4  rounded-full flex items-center justify-center
                      ${isActive ? 'bg-primary' : 'bg-gray-200'}
                    `}>
                      {isActive && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                          <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    {t(`addCar.features.items.${key}`)}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;