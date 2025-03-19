import React from 'react';
import { Check, ShieldCheck, Zap, Radio, CircleDot } from 'lucide-react';

interface FeaturesProps {
  features: {
    has_abs?: boolean;
    has_air_conditioning?: boolean;
    has_alarm?: boolean;
    has_aux?: boolean;
    has_bluetooth?: boolean;
    has_board_computer?: boolean;
    has_central_locking?: boolean;
    has_climate_control?: boolean;
    has_cruise_control?: boolean;
    has_electric_windows?: boolean;
    has_fog_lights?: boolean;
    has_multifunction_steering_wheel?: boolean;
    has_navigation?: boolean;
    has_parking_control?: boolean;
    has_rear_view_camera?: boolean;
    has_seat_heating?: boolean;
    has_sunroof?: boolean;
    has_alloy_wheels?: boolean;
  };
  onChange: (field: string, value: boolean) => void;
}

const featureGroups = {
  'უსაფრთხოება': {
    icon: ShieldCheck,
    features: [
      { key: 'has_abs', label: 'ABS' },
      { key: 'has_alarm', label: 'სიგნალიზაცია' },
      { key: 'has_central_locking', label: 'ცენტრალური საკეტი' }
    ]
  },
  'კომფორტი': {
    icon: Zap,
    features: [
      { key: 'has_air_conditioning', label: 'კონდიციონერი' },
      { key: 'has_climate_control', label: 'კლიმატ-კონტროლი' },
      { key: 'has_cruise_control', label: 'კრუიზ-კონტროლი' },
      { key: 'has_electric_windows', label: 'ელ. შუშები' },
      { key: 'has_seat_heating', label: 'სავარძლების გათბობა' },
      { key: 'has_sunroof', label: 'ლუქი' }
    ]
  },
  'მულტიმედია': {
    icon: Radio,
    features: [
      { key: 'has_aux', label: 'AUX' },
      { key: 'has_bluetooth', label: 'Bluetooth' },
      { key: 'has_board_computer', label: 'ბორტკომპიუტერი' },
      { key: 'has_navigation', label: 'ნავიგაცია' },
      { key: 'has_multifunction_steering_wheel', label: 'მულტიფუნქციური საჭე' }
    ]
  },
  'სხვა': {
    icon: CircleDot,
    features: [
      { key: 'has_parking_control', label: 'პარკინგკონტროლი' },
      { key: 'has_rear_view_camera', label: 'უკანა ხედვის კამერა' },
      { key: 'has_fog_lights', label: 'ნისლის ფარები' },
      { key: 'has_alloy_wheels', label: 'საჭის გამაძლიერებელი' }
    ]
  }
};

const Features: React.FC<FeaturesProps> = ({ features, onChange }) => {
  return (
    <div className="space-y-8">
      {Object.entries(featureGroups).map(([groupName, { icon: Icon, features: groupFeatures }], groupIndex) => (
        <div 
          key={groupName} 
          className="bg-gray-50 rounded-xl p-6 transition-all duration-300 hover:shadow-md"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{groupName}</h3>
              <p className="text-sm text-gray-500">
                {groupFeatures.filter(({ key }) => features[key as keyof typeof features]).length} / {groupFeatures.length} არჩეული
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupFeatures.map(({ key, label }, featureIndex) => (
              <label
                key={key}
                className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-sm animate-fade-in ${
                  features[key as keyof typeof features]
                    ? 'border-primary bg-primary/5 hover:bg-primary/10'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                }`}
                style={{
                  animationDelay: `${(groupIndex * groupFeatures.length + featureIndex) * 50}ms`
                }}
              >
                <div 
                  className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all duration-300 ${
                    features[key as keyof typeof features]
                      ? 'border-primary bg-primary text-white scale-110'
                      : 'border-gray-300 scale-100'
                  }`}
                >
                  {features[key as keyof typeof features] && 
                    <Check 
                      size={12} 
                      className="animate-bounce-in" 
                    />
                  }
                </div>
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={features[key as keyof typeof features] || false}
                  onChange={(e) => onChange(key, e.target.checked)}
                />
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Features;