import { CreateCarFormData } from '../../../../api/types/car.types';

export interface CarSpecifications {
  transmission: 'manual' | 'automatic';
  fuel_type: 'petrol' | 'diesel' | 'hybrid' | 'electric';
  body_type: string;
  drive_type: 'FWD' | 'RWD' | 'AWD' | '4WD';
  steering_wheel?: 'left' | 'right';
  engine_size?: number;
  mileage?: number;
  color?: string;
  cylinders?: number;
}

export interface CarFeatures {
  has_board_computer?: boolean;
  has_air_conditioning?: boolean;
  has_parking_control?: boolean;
  has_rear_view_camera?: boolean;
  has_navigation?: boolean;
  has_heated_seats?: boolean;
  has_ventilated_seats?: boolean;
  has_cruise_control?: boolean;
  has_multimedia?: boolean;
  has_bluetooth?: boolean;
  has_start_stop?: boolean;
  has_panoramic_roof?: boolean;
  has_sunroof?: boolean;
  has_leather_interior?: boolean;
  has_memory_seats?: boolean;
  has_memory_steering_wheel?: boolean;
  has_electric_mirrors?: boolean;
  has_electric_seats?: boolean;
  has_heated_steering_wheel?: boolean;
  has_electric_trunk?: boolean;
  has_keyless_entry?: boolean;
  has_alarm?: boolean;
  has_technical_inspection?: boolean;
}

export interface NewCarFormData {
  brand_id: string;
  model: string;
  category_id: string;
  year: number;
  price: number;
  description_ka: string;
  description_en?: string;
  description_ru?: string;
  city: string;
  state: string;
  country: string;
  location_type: string;
  specifications: CarSpecifications;
  features?: CarFeatures;
  transitStatus?: string;
  images?: File[];
}

export interface FormSectionProps {
  formData: NewCarFormData;
  onChange: (field: string, value: any) => void;
  onSpecificationsChange?: (field: string, value: any) => void;
  errors?: { [key: string]: string };
}

export interface FormSection {
  title: string;
  component: React.ComponentType<FormSectionProps>;
}

export interface BrandOption {
  id: number;
  name: string;
  models: string[];
}

export interface CategoryOption {
  id: number;
  name: string;
}

export interface Option {
  value: string;
  label: string;
}

// Constants for select options
export const TRANSMISSION_OPTIONS: Option[] = [
  { value: 'manual', label: 'მექანიკური' },
  { value: 'automatic', label: 'ავტომატური' }
];

export const FUEL_TYPE_OPTIONS: Option[] = [
  { value: 'petrol', label: 'ბენზინი' },
  { value: 'diesel', label: 'დიზელი' },
  { value: 'hybrid', label: 'ჰიბრიდი' },
  { value: 'electric', label: 'ელექტრო' }
];

export const DRIVE_TYPE_OPTIONS: Option[] = [
  { value: 'FWD', label: 'წინა წამყვანი' },
  { value: 'RWD', label: 'უკანა წამყვანი' },
  { value: 'AWD', label: '4x4' },
  { value: '4WD', label: 'სრული წამყვანი' }
];

export const STEERING_WHEEL_OPTIONS: Option[] = [
  { value: 'left', label: 'მარცხენა' },
  { value: 'right', label: 'მარჯვენა' }
];

export const CONDITION_OPTIONS: Option[] = [
  { value: 'new', label: 'ახალი' },
  { value: 'used', label: 'მეორადი' }
];

export const CITY_OPTIONS: Option[] = [
  { value: 'თბილისი', label: 'თბილისი' },
  { value: 'ბათუმი', label: 'ბათუმი' },
  { value: 'ქუთაისი', label: 'ქუთაისი' },
  { value: 'რუსთავი', label: 'რუსთავი' }
];

export const COUNTRY_OPTIONS: Option[] = [
  { value: 'საქართველო', label: 'საქართველო' }
];

export const LOCATION_TYPE_OPTIONS: Option[] = [
  { value: 'georgia', label: 'საქართველო' },
  { value: 'abroad', label: 'საზღვარგარეთ' }
];

export const CYLINDER_OPTIONS = [2, 3, 4, 5, 6, 8, 10, 12];

export interface ImageUploadResponse {
  url: string;
  thumbnail: string;
  medium: string;
  large: string;
}