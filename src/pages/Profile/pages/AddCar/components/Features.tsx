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
      { key: 'has_esp', label: 'ESP' },
      { key: 'has_asr', label: 'ASR' },
      { key: 'has_traction_control', label: 'მოცურების საწინააღმდეგო' },
      { key: 'has_central_locking', label: 'ცენტრალური საკეტი' },
      { key: 'has_alarm', label: 'სიგნალიზაცია' },
      { key: 'has_fog_lights', label: 'ნისლის ფარები' },
    ],
    'კომფორტი': [
      { key: 'has_air_conditioning', label: 'კონდიციონერი' },
      { key: 'has_climate_control', label: 'კლიმატ-კონტროლი' },
      { key: 'has_heated_seats', label: 'გათბობადი სავარძლები' },
      { key: 'has_ventilated_seats', label: 'ვენტილირებადი სავარძლები' },
      { key: 'has_cruise_control', label: 'კრუიზ-კონტროლი' },
      { key: 'has_start_stop', label: 'Start/Stop სისტემა' },
      { key: 'has_panoramic_roof', label: 'პანორამული ჭერი' },
      { key: 'has_sunroof', label: 'ლუქი' },
      { key: 'has_leather_interior', label: 'ტყავის სალონი' },
    ],
    'ელექტრონიკა': [
      { key: 'has_board_computer', label: 'ბორტკომპიუტერი' },
      { key: 'has_multimedia', label: 'მულტიმედია' },
      { key: 'has_bluetooth', label: 'Bluetooth' },
      { key: 'has_navigation', label: 'ნავიგაცია' },
      { key: 'has_parking_control', label: 'პარკინგ კონტროლი' },
      { key: 'has_rear_view_camera', label: 'უკანა ხედვის კამერა' },
    ],
    'სავარძლები და საჭე': [
      { key: 'has_memory_seats', label: 'სავარძლების მეხსიერება' },
      { key: 'has_memory_steering_wheel', label: 'საჭის მეხსიერება' },
      { key: 'has_electric_seats', label: 'ელექტრო სავარძლები' },
      { key: 'has_heated_steering_wheel', label: 'საჭის გათბობა' },
    ],
    'ელექტრო მართვა': [
      { key: 'has_electric_mirrors', label: 'ელ. სარკეები' },
      { key: 'has_electric_windows', label: 'ელ. შუშები' },
      { key: 'has_electric_trunk', label: 'ელ. საბარგული' },
      { key: 'has_keyless_entry', label: 'უგასაღებო შესვლა' },
    ],
    'სხვა': [
      { key: 'has_technical_inspection', label: 'გავლილი აქვს ტექ. დათვალიერება' },
    ],
  } as const;

  return (
    <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all duration-300">
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
          <div key={groupName} className="space-y-4">
            <h3 className="text-base font-semibold text-gray-800">{groupName}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {groupFeatures.map(({ key, label }) => (
                <div key={key} className="relative">
                  <label className="group flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={features[key as keyof CarFeatures] || false}
                      onChange={(e) => onChange(key as keyof CarFeatures, e.target.checked)}
                      className="form-checkbox h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary focus:ring-2 transition-all duration-200 
                      cursor-pointer group-hover:border-primary"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-primary transition-colors duration-200">
                      {label}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;