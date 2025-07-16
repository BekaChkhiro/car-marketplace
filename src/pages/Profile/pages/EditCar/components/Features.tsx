import React from 'react';
import { Wrench } from 'lucide-react';
import { CarFeatures } from '../types';

interface FeaturesProps {
  features: Partial<CarFeatures>;
  onChange: (field: keyof CarFeatures, value: boolean) => void;
}

const Features: React.FC<FeaturesProps> = ({ features, onChange }) => {
  const featureGroups = {
    'უსაფრთხოება': [
      { key: 'has_abs', label: 'ABS' },
      { key: 'has_traction_control', label: 'მოცურების საწინააღმდეგო სისტემა' },
      { key: 'has_central_locking', label: 'ცენტრალური საკეტი' },
      { key: 'has_alarm', label: 'სიგნალიზაცია' },
      { key: 'has_fog_lights', label: 'სანისლე ფარები' },
    ],
    'კომფორტი': [
      { key: 'has_air_conditioning', label: 'კონდიციონერი' },
      { key: 'has_climate_control', label: 'კლიმატკონტროლი' },
      { key: 'has_heated_seats', label: 'სავარძლის გათბობა' },
      { key: 'has_memory_seats', label: 'სავარძლის მეხსიერება' },
      { key: 'has_cruise_control', label: 'კრუიზ-კონტროლი' },
      { key: 'has_start_stop', label: 'Start/Stop სისტემა' },
      { key: 'has_sunroof', label: 'ლუქი' },
      { key: 'has_electric_windows', label: 'ელექტრო შუშები' },
    ],
    'ელექტრონიკა': [
      { key: 'has_board_computer', label: 'ბორტკომპიუტერი' },
      { key: 'has_navigation', label: 'მონიტორი (ნავიგაცია)' },
      { key: 'has_parking_control', label: 'პარკინგკონტროლი' },
      { key: 'has_rear_view_camera', label: 'უკანა ხედვის კამერა' },
      { key: 'has_aux', label: 'AUX' },
      { key: 'has_bluetooth', label: 'Bluetooth' },
      { key: 'has_multifunction_steering_wheel', label: 'მულტი საჭე' },
    ]
  } as const;

  return (
    <div className="bg-white rounded-xl p-6 border shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center transform transition-transform duration-300 group-hover:rotate-180">
          <Wrench size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">აღჭურვილობა და ფუნქციები</h2>
          <p className="text-sm text-gray-500">მონიშნეთ მანქანის დამატებითი აღჭურვილობა</p>
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(featureGroups).map(([groupName, groupFeatures]) => (
          <div key={groupName} className="space-y-4 ">
            <h3 className="text-base font-semibold text-gray-800 border-b pb-2">{groupName}</h3>
            <div className="flex flex-wrap gap-3 w-full"> 
              {groupFeatures.map(({ key, label }) => {
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
                    {label}
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