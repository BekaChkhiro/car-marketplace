import React from 'react';
import { MapPin } from 'lucide-react';
import CustomSelect from '../../../../../components/common/CustomSelect';
import { LOCATION_TYPE_OPTIONS, CITY_OPTIONS, COUNTRY_OPTIONS } from '../types';

interface LocationProps {
  city: string;
  state: string;
  country: string;
  location_type: 'transit' | 'georgia' | 'international';
  onChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

const Location: React.FC<LocationProps> = ({
  city,
  state,
  country,
  location_type,
  onChange,
  errors = {}
}) => {
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {location_type === 'georgia' ? (
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
          ) : (
            <>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  ქალაქი *
                </label>
                <input
                  type="text"
                  id="city"
                  value={city}
                  onChange={(e) => onChange('city', e.target.value)}
                  className={`w-full px-4 py-2 border-2 rounded-lg text-base ${
                    errors?.city
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-100 focus:border-primary focus:ring-primary/20'
                  } focus:outline-none focus:ring-2 transition-colors`}
                  placeholder="მაგ: ბერლინი"
                />
                {errors?.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
              </div>

              {location_type === 'international' && (
                <>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                      შტატი/რეგიონი
                    </label>
                    <input
                      type="text"
                      id="state"
                      value={state}
                      onChange={(e) => onChange('state', e.target.value)}
                      className={`w-full px-4 py-2 border-2 rounded-lg text-base ${
                        errors?.state
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                          : 'border-gray-100 focus:border-primary focus:ring-primary/20'
                      } focus:outline-none focus:ring-2 transition-colors`}
                      placeholder="მაგ: ჰესენი"
                    />
                    {errors?.state && (
                      <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                    )}
                  </div>

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
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Location;