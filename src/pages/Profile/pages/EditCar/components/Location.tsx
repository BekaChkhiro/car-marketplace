import React, { useEffect } from 'react';
import { MapPin, Truck, Globe } from 'lucide-react';
import CustomSelect from '../../../../../components/common/CustomSelect';
import LocationTypeSwitcher from '../../../../../components/LocationTypeSwitcher';
import { CITY_OPTIONS, COUNTRY_OPTIONS } from '../types';

interface LocationProps {
  city: string;
  country: string;
  location_type: 'transit' | 'georgia' | 'international';
  onChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

const Location: React.FC<LocationProps> = ({
  city,
  country,
  location_type,
  onChange,
  errors = {}
}) => {
  // Set default values based on location type
  useEffect(() => {
    if (location_type === 'transit') {
      onChange('city', 'ტრანზიტში');
      onChange('country', 'საქართველო');
    } else if (location_type === 'international') {
      onChange('city', 'საზღვარგარეთ');
      // If country is empty, set a default value
      if (!country) {
        onChange('country', 'გერმანია');
      }
    } else if (location_type === 'georgia') {
      // For georgia type, always set country to საქართველო
      onChange('country', 'საქართველო');
      // Set default city if not already set
      if (!city) {
        onChange('city', 'თბილისი');
      }
    }
  }, [location_type, city, country]);

  return (
    <div className="bg-white rounded-xl p-6 border">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center transform transition-transform duration-300 group-hover:rotate-180">
          <MapPin size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-lg  font-semibold text-gray-900 text-left">მდებარეობა</h2>
          <p className="text-sm text-gray-500">მიუთითეთ მანქანის ადგილმდებარეობა</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 ">
            <label className="block text-left text-sm font-medium text-gray-700 mb-2 sm:mb-0">
              მდებარეობის ტიპი *
            </label>
            <LocationTypeSwitcher 
              value={location_type} 
              onChange={(value) => onChange('location_type', value)}
              className="border shadow-sm"
            />
          </div>
          {errors?.location_type && (
            <p className="mt-1 text-sm text-red-600">{errors.location_type}</p>
          )}
        </div>

        <div className="mt-6 space-y-6">
          {/* Location type specific content */}
          {location_type === 'georgia' && (
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <div className="flex  gap-2 mb-4">
                <MapPin size={18} className="text-green-600 " />
                <h3 className="font-medium text-green-800">საქართველოში</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                    ქალაქი *
                  </label>
                  <CustomSelect
                    value={city}
                    onChange={(value) => onChange('city', value as string)}
                    options={CITY_OPTIONS}
                    placeholder="აირჩიეთ ქალაქი"
                    error={errors?.city}
                    multiple={false}
                  />
                  {errors?.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {location_type === 'transit' && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex  gap-2 mb-2">
                <Truck size={18} className="text-blue-600" />
                <h3 className="font-medium text-blue-800">ტრანზიტში</h3>
              </div>
              <p className="text-blue-700 text-sm">მანქანა იმყოფება ტრანზიტში საქართველოსკენ მომავალში</p>
            </div>
          )}

          {location_type === 'international' && (
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <div className="flex  gap-2 mb-4">
                <Globe size={18} className="text-purple-600" />
                <h3 className="font-medium text-purple-800">საზღვარგარეთ</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                    ქვეყანა *
                  </label>
                  <CustomSelect
                    value={country}
                    onChange={(value) => onChange('country', value as string)}
                    options={COUNTRY_OPTIONS}
                    placeholder="აირჩიეთ ქვეყანა"
                    error={errors?.country}
                    multiple={false}
                  />
                  {errors?.country && (
                    <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Location;