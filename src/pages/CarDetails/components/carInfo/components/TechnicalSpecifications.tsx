import React from 'react';
import { CarSpecifications } from '../../../../../api/types/car.types';

interface TechnicalSpecificationsProps {
  specifications: CarSpecifications;
}

const TechnicalSpecifications: React.FC<TechnicalSpecificationsProps> = ({ specifications }) => {
  // Helper function to check if a specification should be displayed
  const shouldDisplaySpec = (value: any): boolean => {
    if (value === undefined || value === null) return false;
    if (typeof value === 'string' && value.trim() === '') return false;
    if (typeof value === 'boolean') return true; // Always show boolean values
    return true;
  };

  // Helper function to format boolean values
  const formatBoolean = (value: boolean | undefined) => {
    if (value === undefined) return 'N/A';
    return value ? 'Yes' : 'No';
  };

  // Helper function to translate drive type from English to Georgian if needed
  const translateDriveType = (driveType: string | undefined) => {
    if (!driveType) return 'N/A';
    
    // Use the mapping from English to Georgian (reverse of what's in the memory)
    switch(driveType.toLowerCase()) {
      case 'front': return 'წინა';
      case 'rear': return 'უკანა';
      case '4x4': return '4x4';
      default: return driveType;
    }
  };
  
  // formatMonth function has been removed as it's no longer needed

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Engine & Drivetrain */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-sm transition-all duration-200">
        <h3 className="text-lg text-gray-800 mb-6 pb-2 border-b border-gray-100 font-semibold">
          Engine & Drivetrain
        </h3>
        <div className="space-y-4">
          {shouldDisplaySpec(specifications?.engine_type) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Engine Type</div>
              <div className="text-gray-600">{specifications.engine_type}</div>
            </div>
          )}
          {shouldDisplaySpec(specifications?.engine_size) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Engine Size</div>
              <div className="text-gray-600">{specifications.engine_size}L</div>
            </div>
          )}
          {shouldDisplaySpec(specifications?.horsepower) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Horsepower</div>
              <div className="text-gray-600">{specifications.horsepower} HP</div>
            </div>
          )}
          {shouldDisplaySpec(specifications?.cylinders) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Cylinders</div>
              <div className="text-gray-600">{specifications.cylinders}</div>
            </div>
          )}
          {shouldDisplaySpec(specifications?.is_turbo) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Turbo</div>
              <div className="text-gray-600">{formatBoolean(specifications.is_turbo)}</div>
            </div>
          )}
          {shouldDisplaySpec(specifications?.transmission) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Transmission</div>
              <div className="text-gray-600">{specifications.transmission}</div>
            </div>
          )}
          {shouldDisplaySpec(specifications?.drive_type) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Drive Type</div>
              <div className="text-gray-600">{translateDriveType(specifications.drive_type)}</div>
            </div>
          )}
          {shouldDisplaySpec(specifications?.has_catalyst) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Catalyst</div>
              <div className="text-gray-600">{formatBoolean(specifications.has_catalyst)}</div>
            </div>
          )}
        </div>
      </div>

      {/* General Information */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-sm transition-all duration-200">
        <h3 className="text-lg text-gray-800 mb-6 pb-2 border-b border-gray-100 font-semibold">
          General Information
        </h3>
        <div className="space-y-4">
          {shouldDisplaySpec(specifications?.mileage) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Mileage</div>
              <div className="text-gray-600">
                {specifications.mileage!.toLocaleString()} {specifications.mileage_unit || 'km'}
              </div>
            </div>
          )}
          {shouldDisplaySpec(specifications?.fuel_type) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Fuel Type</div>
              <div className="text-gray-600">{specifications.fuel_type}</div>
            </div>
          )}
          {shouldDisplaySpec(specifications?.body_type) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Body Type</div>
              <div className="text-gray-600">{specifications.body_type}</div>
            </div>
          )}
          {shouldDisplaySpec(specifications?.color) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Color</div>
              <div className="text-gray-600">{specifications.color}</div>
            </div>
          )}
          {shouldDisplaySpec(specifications?.doors) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Doors</div>
              <div className="text-gray-600">{specifications.doors}</div>
            </div>
          )}
          {shouldDisplaySpec(specifications?.steering_wheel) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Steering Wheel</div>
              <div className="text-gray-600">{specifications.steering_wheel}</div>
            </div>
          )}
          {/* Manufacture month field has been removed */}
          {shouldDisplaySpec(specifications?.airbags_count) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Airbags</div>
              <div className="text-gray-600">{specifications.airbags_count}</div>
            </div>
          )}
          {shouldDisplaySpec(specifications?.clearance_status) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Clearance Status</div>
              <div className="text-gray-600">{specifications.clearance_status}</div>
            </div>
          )}
          {shouldDisplaySpec(specifications?.has_technical_inspection) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Technical Inspection</div>
              <div className="text-gray-600">{formatBoolean(specifications.has_technical_inspection)}</div>
            </div>
          )}
        </div>
      </div>

      {/* Interior */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-sm transition-all duration-200">
        <h3 className="text-lg text-gray-800 mb-6 pb-2 border-b border-gray-100 font-semibold">
          Interior
        </h3>
        <div className="space-y-4">
          {shouldDisplaySpec(specifications?.interior_material) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Interior Material</div>
              <div className="text-gray-600">{specifications.interior_material}</div>
            </div>
          )}
          {shouldDisplaySpec(specifications?.interior_color) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Interior Color</div>
              <div className="text-gray-600">{specifications.interior_color}</div>
            </div>
          )}
          {shouldDisplaySpec(specifications?.has_leather_interior) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Leather Interior</div>
              <div className="text-gray-600">{formatBoolean(specifications.has_leather_interior)}</div>
            </div>
          )}
          {(shouldDisplaySpec(specifications?.has_seat_heating) || shouldDisplaySpec(specifications?.has_heated_seats)) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Seat Heating</div>
              <div className="text-gray-600">{formatBoolean(specifications.has_seat_heating || specifications.has_heated_seats)}</div>
            </div>
          )}
          {(shouldDisplaySpec(specifications?.has_seat_memory) || shouldDisplaySpec(specifications?.has_memory_seats)) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Seat Memory</div>
              <div className="text-gray-600">{formatBoolean(specifications.has_seat_memory || specifications.has_memory_seats)}</div>
            </div>
          )}
          {shouldDisplaySpec(specifications?.has_ventilated_seats) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Ventilated Seats</div>
              <div className="text-gray-600">{formatBoolean(specifications.has_ventilated_seats)}</div>
            </div>
          )}
          {shouldDisplaySpec(specifications?.has_multifunction_steering_wheel) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Multifunction Steering Wheel</div>
              <div className="text-gray-600">{formatBoolean(specifications.has_multifunction_steering_wheel)}</div>
            </div>
          )}
          {shouldDisplaySpec(specifications?.has_heated_steering_wheel) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Heated Steering Wheel</div>
              <div className="text-gray-600">{formatBoolean(specifications.has_heated_steering_wheel)}</div>
            </div>
          )}
        </div>
      </div>

      {/* Features & Technology */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-sm transition-all duration-200">
        <h3 className="text-lg text-gray-800 mb-6 pb-2 border-b border-gray-100 font-semibold">
          Features & Technology
        </h3>
        <div className="space-y-4">
          {shouldDisplaySpec(specifications?.has_air_conditioning) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Air Conditioning</div>
              <div className="text-gray-600">{formatBoolean(specifications.has_air_conditioning)}</div>
            </div>
          )}
          {shouldDisplaySpec(specifications?.has_climate_control) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Climate Control</div>
              <div className="text-gray-600">{formatBoolean(specifications.has_climate_control)}</div>
            </div>
          )}
          {shouldDisplaySpec(specifications?.has_board_computer) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Board Computer</div>
              <div className="text-gray-600">{formatBoolean(specifications.has_board_computer)}</div>
            </div>
          )}
          {shouldDisplaySpec(specifications?.has_navigation) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Navigation</div>
              <div className="text-gray-600">{formatBoolean(specifications.has_navigation)}</div>
            </div>
          )}
          {shouldDisplaySpec(specifications?.has_bluetooth) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Bluetooth</div>
              <div className="text-gray-600">{formatBoolean(specifications.has_bluetooth)}</div>
            </div>
          )}
          {shouldDisplaySpec(specifications?.has_aux) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Aux</div>
              <div className="text-gray-600">{formatBoolean(specifications.has_aux)}</div>
            </div>
          )}
          {shouldDisplaySpec(specifications?.has_rear_view_camera) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Rear View Camera</div>
              <div className="text-gray-600">{formatBoolean(specifications.has_rear_view_camera)}</div>
            </div>
          )}
          {shouldDisplaySpec(specifications?.has_parking_control) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Parking Control</div>
              <div className="text-gray-600">{formatBoolean(specifications.has_parking_control)}</div>
            </div>
          )}
          {shouldDisplaySpec(specifications?.has_electric_windows) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Electric Windows</div>
              <div className="text-gray-600">{formatBoolean(specifications.has_electric_windows)}</div>
            </div>
          )}
          {shouldDisplaySpec(specifications?.has_electric_trunk) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Electric Trunk</div>
              <div className="text-gray-600">{formatBoolean(specifications.has_electric_trunk)}</div>
            </div>
          )}
        </div>
      </div>

      {/* Safety & Security */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-sm transition-all duration-200">
        <h3 className="text-lg text-gray-800 mb-6 pb-2 border-b border-gray-100 font-semibold">
          Safety & Security
        </h3>
        <div className="space-y-4">
          {shouldDisplaySpec(specifications?.has_alarm) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Alarm</div>
              <div className="text-gray-600">{formatBoolean(specifications.has_alarm)}</div>
            </div>
          )}
          {shouldDisplaySpec(specifications?.has_central_locking) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Central Locking</div>
              <div className="text-gray-600">{formatBoolean(specifications.has_central_locking)}</div>
            </div>
          )}
          {shouldDisplaySpec(specifications?.has_abs) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">ABS</div>
              <div className="text-gray-600">{formatBoolean(specifications.has_abs)}</div>
            </div>
          )}
          {shouldDisplaySpec(specifications?.has_esp) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">ESP</div>
              <div className="text-gray-600">{formatBoolean(specifications.has_esp)}</div>
            </div>
          )}
          {shouldDisplaySpec(specifications?.airbags_count) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Airbags</div>
              <div className="text-gray-600">{specifications.airbags_count}</div>
            </div>
          )}
          {shouldDisplaySpec(specifications?.has_fog_lights) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Fog Lights</div>
              <div className="text-gray-600">{formatBoolean(specifications.has_fog_lights)}</div>
            </div>
          )}
          {shouldDisplaySpec(specifications?.has_asr) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">ASR</div>
              <div className="text-gray-600">{formatBoolean(specifications.has_asr)}</div>
            </div>
          )}
          {shouldDisplaySpec(specifications?.is_cleared) && (
            <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
              <div className="font-medium text-gray-800">Is Cleared</div>
              <div className="text-gray-600">{formatBoolean(specifications.is_cleared)}</div>
            </div>
          )}
        </div>
      </div>

      {/* Convenience */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-sm transition-all duration-200">
        <h3 className="text-lg text-gray-800 mb-6 pb-2 border-b border-gray-100 font-semibold">
          Convenience
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
            <div className="font-medium text-gray-800">Cruise Control</div>
            <div className="text-gray-600">{formatBoolean(specifications?.has_cruise_control)}</div>
          </div>
          <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
            <div className="font-medium text-gray-800">Start/Stop System</div>
            <div className="text-gray-600">{formatBoolean(specifications?.has_start_stop)}</div>
          </div>
          <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
            <div className="font-medium text-gray-800">Panoramic Roof</div>
            <div className="text-gray-600">{formatBoolean(specifications?.has_panoramic_roof)}</div>
          </div>
          <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
            <div className="font-medium text-gray-800">Sunroof</div>
            <div className="text-gray-600">{formatBoolean(specifications?.has_sunroof)}</div>
          </div>
          <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
            <div className="font-medium text-gray-800">Alloy Wheels</div>
            <div className="text-gray-600">{formatBoolean(specifications?.has_alloy_wheels)}</div>
          </div>
          <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
            <div className="font-medium text-gray-800">Spare Tire</div>
            <div className="text-gray-600">{formatBoolean(specifications?.has_spare_tire)}</div>
          </div>
          <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
            <div className="font-medium text-gray-800">Disability Adapted</div>
            <div className="text-gray-600">{formatBoolean(specifications?.is_disability_adapted)}</div>
          </div>
          <div className="flex justify-between py-2 hover:bg-green-light rounded-lg px-3 transition-colors">
            <div className="font-medium text-gray-800">Hydraulics</div>
            <div className="text-gray-600">{formatBoolean(specifications?.has_hydraulics)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalSpecifications;