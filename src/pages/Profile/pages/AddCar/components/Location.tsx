import React, { useEffect } from 'react';
import { MapPin } from 'lucide-react';
import CustomSelect from '../../../../../components/common/CustomSelect';
import { LOCATION_TYPE_OPTIONS, CITY_OPTIONS, COUNTRY_OPTIONS } from '../types';

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
    <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center transform transition-transform duration-300 group-hover:rotate-180">
          <MapPin size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">მდებარეობა</h2>
          <p className="text-sm text-gray-500">მიუთითეთ მანქანის ადგილმდებარეობა</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            მდებარეობის ტიპი *
          </label>
          <CustomSelect
            value={location_type}
            onChange={(value) => onChange('location_type', value as string)}
            options={LOCATION_TYPE_OPTIONS}
            placeholder="აირჩიეთ მდებარეობის ტიპი"
            error={errors?.location_type}
            multiple={false}
          />
        </div>

        {/* Only show city selection for Georgia */}
        {location_type === 'georgia' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
          </div>
        )}

        {/* Only show country selection for international */}
        {location_type === 'international' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
          </div>
        )}

        {/* Display location information based on type */}
        {location_type === 'transit' && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-blue-700">მანქანა იმყოფება ტრანზიტში</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Location;