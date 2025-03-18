export interface NewCarFormData {
  brand_id: string | number;
  category_id: string | number;
  model: string;
  year: number;
  price: string | number;
  transport_type: 'car' | 'motorcycle' | 'truck';
  status?: 'available' | 'sold' | 'pending';
  featured?: boolean;
  city: string;
  state: string;
  country: string;
  location_type: 'transit' | 'georgia' | 'international';
  
  description_en?: string;
  description_ka?: string;
  description_ru?: string;

  specifications: {
    engine_type?: string;
    transmission?: 'manual' | 'automatic' | 'tiptronic' | 'variator';
    fuel_type?: 'ბენზინი' | 'დიზელი' | 'ელექტრო' | 'ჰიბრიდი' | 'დატენვადი_ჰიბრიდი' | 
                'თხევადი_გაზი' | 'ბუნებრივი_გაზი' | 'წყალბადი';
    mileage?: string | number;
    mileage_unit?: 'km' | 'mi';
    engine_size?: string | number;
    horsepower?: string | number;
    doors?: 2 | 3 | 4 | 5 | 6 | 7 | 8;
    is_turbo?: boolean;
    cylinders?: number;
    manufacture_month?: number;
    body_type?: string;
    steering_wheel?: 'left' | 'right';
    drive_type?: 'front' | 'rear' | '4x4';
    interior_material?: 'ნაჭერი' | 'ტყავი' | 'ხელოვნური ტყავი' | 'კომბინირებული' | 'ალკანტარა';
    interior_color?: string;
    color?: string;
  };
  
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
}

export type FormSection = 'specifications' | 'features';

export interface BrandOption {
  id: number;
  name: string;
}

export interface CategoryOption {
  id: number;
  name: string;
  transport_type: 'car' | 'motorcycle' | 'truck';
}

// Constants for select options
export const TRANSMISSION_OPTIONS = ['manual', 'automatic', 'tiptronic', 'variator'] as const;

export const FUEL_TYPE_OPTIONS = [
  'ბენზინი',
  'დიზელი',
  'ელექტრო',
  'ჰიბრიდი',
  'დატენვადი_ჰიბრიდი',
  'თხევადი_გაზი',
  'ბუნებრივი_გაზი',
  'წყალბადი'
] as const;

export const DOORS_OPTIONS = [2, 3, 4, 5, 6, 7, 8] as const;

export const MILEAGE_UNIT_OPTIONS = ['km', 'mi'] as const;

export const STEERING_WHEEL_OPTIONS = ['left', 'right'] as const;

export const DRIVE_TYPE_OPTIONS = ['front', 'rear', '4x4'] as const;

export const INTERIOR_MATERIAL_OPTIONS = [
  'ნაჭერი',
  'ტყავი',
  'ხელოვნური ტყავი',
  'კომბინირებული',
  'ალკანტარა'
] as const;

export const LOCATION_TYPE_OPTIONS = ['transit', 'georgia', 'international'] as const;

export const TRANSPORT_TYPE_OPTIONS = ['car', 'motorcycle', 'truck'] as const;

export const MONTHS = [
  'იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი',
  'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'
] as const;