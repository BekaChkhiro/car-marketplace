import React from 'react';

interface FeatureGroup {
  key: string;
  label: string;
  type?: 'number';
}

interface FeaturesProps {
  features: {
    has_catalyst?: boolean;
    airbags_count?: number;
    has_hydraulics?: boolean;
    has_board_computer?: boolean;
    has_air_conditioning?: boolean;
    has_parking_control?: boolean;
    has_rear_view_camera?: boolean;
    has_electric_windows?: boolean;
    has_climate_control?: boolean;
    has_cruise_control?: boolean;
    has_start_stop?: boolean;
    has_sunroof?: boolean;
    has_seat_heating?: boolean;
    has_seat_memory?: boolean;
    has_abs?: boolean;
    has_traction_control?: boolean;
    has_central_locking?: boolean;
    has_alarm?: boolean;
    has_fog_lights?: boolean;
    has_navigation?: boolean;
    has_aux?: boolean;
    has_bluetooth?: boolean;
    has_multifunction_steering_wheel?: boolean;
    has_alloy_wheels?: boolean;
    has_spare_tire?: boolean;
    is_disability_adapted?: boolean;
  };
  onChange: (field: string, value: boolean | number) => void;
  errors?: Record<string, string>;
}

const Features: React.FC<FeaturesProps> = ({ features, onChange, errors }) => {
  const featureGroups: Record<string, FeatureGroup[]> = {
    'უსაფრთხოება': [
      { key: 'has_catalyst', label: 'კატალიზატორი' },
      { key: 'airbags_count', label: 'აირბეგების რაოდენობა', type: 'number' },
      { key: 'has_abs', label: 'ABS' },
      { key: 'has_traction_control', label: 'მოცურების საწინააღმდეგო' },
      { key: 'has_alarm', label: 'სიგნალიზაცია' },
      { key: 'has_central_locking', label: 'ცენტრალური საკეტი' }
    ],
    'კომფორტი': [
      { key: 'has_air_conditioning', label: 'კონდიციონერი' },
      { key: 'has_climate_control', label: 'კლიმატ კონტროლი' },
      { key: 'has_cruise_control', label: 'კრუიზ კონტროლი' },
      { key: 'has_electric_windows', label: 'ელ. შუშები' },
      { key: 'has_seat_heating', label: 'სავარძლების გათბობა' },
      { key: 'has_seat_memory', label: 'სავარძლების მეხსიერება' },
      { key: 'has_sunroof', label: 'ლუქი' },
      { key: 'has_start_stop', label: 'Start/Stop სისტემა' }
    ],
    'ტექნოლოგია': [
      { key: 'has_board_computer', label: 'ბორტკომპიუტერი' },
      { key: 'has_navigation', label: 'ნავიგაცია' },
      { key: 'has_bluetooth', label: 'Bluetooth' },
      { key: 'has_aux', label: 'AUX' },
      { key: 'has_multifunction_steering_wheel', label: 'მულტიფუნქციური საჭე' }
    ],
    'სხვა': [
      { key: 'has_parking_control', label: 'პარკინგ კონტროლი' },
      { key: 'has_rear_view_camera', label: 'უკანა ხედვის კამერა' },
      { key: 'has_fog_lights', label: 'ნისლის ფარები' },
      { key: 'has_alloy_wheels', label: 'საბურავები' },
      { key: 'has_spare_tire', label: 'სათადარიგო საბურავი' },
      { key: 'has_hydraulics', label: 'ჰიდრავლიკა' },
      { key: 'is_disability_adapted', label: 'ადაპტირებულია შშმ პირებისთვის' }
    ]
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold text-gray-dark border-b pb-4">აღჭურვილობა</h2>
      
      <div className="space-y-8">
        {Object.entries(featureGroups).map(([groupName, items]) => (
          <div key={groupName}>
            <h3 className="text-base font-medium text-gray-700 mb-4">{groupName}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <div key={item.key} className="flex items-center gap-3">
                  {item.type === 'number' ? (
                    <div className="flex items-center gap-2">
                      <label htmlFor={item.key} className="text-sm text-gray-600">{item.label}</label>
                      <input
                        type="number"
                        id={item.key}
                        min="0"
                        max="12"
                        value={features[item.key as keyof typeof features] as number || 0}
                        onChange={(e) => onChange(`features.${item.key}`, Number(e.target.value))}
                        className={`w-20 px-2 py-1 border-2 rounded-lg text-sm ${
                          errors?.[`features.${item.key}`]
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                            : 'border-gray-100 focus:border-primary focus:ring-primary/20'
                        } focus:outline-none focus:ring-2 transition-colors`}
                      />
                      {errors?.[`features.${item.key}`] && (
                        <p className="mt-1 text-sm text-red-600">{errors[`features.${item.key}`]}</p>
                      )}
                    </div>
                  ) : (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(features[item.key as keyof typeof features])}
                        onChange={(e) => onChange(`features.${item.key}`, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                        peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full 
                        peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                        after:left-[2px] after:bg-white after:border-gray-300 after:border 
                        after:rounded-full after:h-5 after:w-5 after:transition-all 
                        peer-checked:bg-primary"
                      />
                      <span className="ml-3 text-sm text-gray-600">{item.label}</span>
                    </label>
                  )}
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