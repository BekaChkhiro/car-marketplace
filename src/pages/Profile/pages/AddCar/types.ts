import { CreateCarFormData } from '../../../../api/types/car.types';

export interface CarSpecifications {
  transmission: 'manual' | 'automatic';
  fuel_type: 'petrol' | 'diesel' | 'hybrid' | 'electric' | 'plug_in_hybrid' | 'lpg' | 'cng' | 'hydrogen';
  body_type: 'sedan' | 'suv' | 'coupe' | 'hatchback' | 'wagon' | 'convertible' | 'pickup' | 'van' | 'limousine' | 'crossover';
  drive_type: 'FWD' | 'RWD' | 'AWD' | '4WD';
  steering_wheel: 'left' | 'right';
  engine_size?: number;
  mileage?: number;
  mileage_unit?: 'km' | 'mi';
  color?: string;
  cylinders?: number;
  horsepower?: number;
  interior_material?: string;
  interior_color?: string;
  airbags_count?: number;
  engine_type?: string;
}

export interface CarFeatures {
  has_abs?: boolean;
  has_esp?: boolean;
  has_asr?: boolean;
  has_traction_control?: boolean;
  has_central_locking?: boolean;
  has_alarm?: boolean;
  has_fog_lights?: boolean;
  has_board_computer?: boolean;
  has_multimedia?: boolean;
  has_bluetooth?: boolean;
  has_air_conditioning?: boolean;
  has_climate_control?: boolean;
  has_heated_seats?: boolean;
  has_ventilated_seats?: boolean;
  has_cruise_control?: boolean;
  has_start_stop?: boolean;
  has_panoramic_roof?: boolean;
  has_sunroof?: boolean;
  has_leather_interior?: boolean;
  has_memory_seats?: boolean;
  has_memory_steering_wheel?: boolean;
  has_electric_mirrors?: boolean;
  has_electric_seats?: boolean;
  has_heated_steering_wheel?: boolean;
  has_electric_windows?: boolean;
  has_electric_trunk?: boolean;
  has_keyless_entry?: boolean;
  has_parking_control?: boolean;
  has_rear_view_camera?: boolean;
  has_navigation?: boolean;
  has_technical_inspection?: boolean;
}

export interface NewCarFormData {
  brand_id: string;  // as string since it comes from form input
  model: string;
  title: string;
  category_id: string;
  year: number;
  price: number;
  currency: 'GEL' | 'USD';  // Currency for the price (GEL or USD)
  description_ka: string;
  description_en?: string;
  description_ru?: string;
  location: {
    city: string;
    state: string;
    country: string;
    location_type: string;
    is_transit: boolean;
  };
  specifications: CarSpecifications;
  features?: CarFeatures;
  images?: File[];
}

export interface FormSectionProps {
  formData: NewCarFormData;
  onChange: (field: string, value: any) => void;
  onSpecificationsChange?: (field: string, value: any) => void;
  errors?: { [key: string]: string };
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
  { value: 'electric', label: 'ელექტრო' },
  { value: 'plug_in_hybrid', label: 'დატენვადი ჰიბრიდი' },
  { value: 'lpg', label: 'გაზი (LPG)' },
  { value: 'cng', label: 'ბუნებრივი აირი (CNG)' },
  { value: 'hydrogen', label: 'წყალბადი' }
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

export const BODY_TYPE_OPTIONS: Option[] = [
  { value: 'sedan', label: 'სედანი' },
  { value: 'suv', label: 'ჯიპი' },
  { value: 'coupe', label: 'კუპე' },
  { value: 'hatchback', label: 'ჰეჩბეკი' },
  { value: 'wagon', label: 'უნივერსალი' },
  { value: 'convertible', label: 'კაბრიოლეტი' },
  { value: 'pickup', label: 'პიკაპი' },
  { value: 'van', label: 'მინივენი' },
  { value: 'limousine', label: 'ლიმუზინი' },
  { value: 'crossover', label: 'კროსოვერი' }
];

export const INTERIOR_MATERIAL_OPTIONS: Option[] = [
  { value: 'fabric', label: 'ნაჭერი' },
  { value: 'leather', label: 'ტყავი' },
  { value: 'alcantara', label: 'ალკანტარა' },
  { value: 'combined', label: 'კომბინირებული' }
];

export const COLOR_OPTIONS: Option[] = [
  { value: 'black', label: 'შავი' },
  { value: 'white', label: 'თეთრი' },
  { value: 'silver', label: 'ვერცხლისფერი' },
  { value: 'gray', label: 'რუხი' },
  { value: 'red', label: 'წითელი' },
  { value: 'blue', label: 'ლურჯი' },
  { value: 'green', label: 'მწვანე' },
  { value: 'brown', label: 'ყავისფერი' },
  { value: 'beige', label: 'ბეჟი' },
  { value: 'gold', label: 'ოქროსფერი' },
  { value: 'orange', label: 'ნარინჯისფერი' },
  { value: 'yellow', label: 'ყვითელი' },
  { value: 'purple', label: 'იისფერი' },
  { value: 'other', label: 'სხვა' }
];

export const LOCATION_TYPE_OPTIONS: Option[] = [
  { value: 'georgia', label: 'საქართველოში' },
  { value: 'transit', label: 'ტრანზიტში' },
  { value: 'international', label: 'საზღვარგარეთ' }
];

// Georgian cities
export const CITY_OPTIONS: Option[] = [
  { value: 'თბილისი', label: 'თბილისი' },
  { value: 'ბათუმი', label: 'ბათუმი' },
  { value: 'ქუთაისი', label: 'ქუთაისი' },
  { value: 'რუსთავი', label: 'რუსთავი' },
  { value: 'გორი', label: 'გორი' },
  { value: 'ზუგდიდი', label: 'ზუგდიდი' },
  { value: 'ფოთი', label: 'ფოთი' },
  { value: 'ხაშური', label: 'ხაშური' },
  { value: 'სამტრედია', label: 'სამტრედია' },
  { value: 'სენაკი', label: 'სენაკი' }
];

// Add country options based on the server's configuration
export const COUNTRY_OPTIONS: Option[] = [
  { value: 'გერმანია', label: 'გერმანია' },
  { value: 'აშშ', label: 'აშშ' },
  { value: 'იაპონია', label: 'იაპონია' },
  { value: 'დიდი ბრიტანეთი', label: 'დიდი ბრიტანეთი' },
  { value: 'საფრანგეთი', label: 'საფრანგეთი' },
  { value: 'იტალია', label: 'იტალია' },
  { value: 'ესპანეთი', label: 'ესპანეთი' },
  { value: 'ნიდერლანდები', label: 'ნიდერლანდები' },
  { value: 'ჩინეთი', label: 'ჩინეთი' },
  { value: 'კანადა', label: 'კანადა' },
  { value: 'თურქეთი', label: 'თურქეთი' },
  { value: 'პოლონეთი', label: 'პოლონეთი' },
  { value: 'სომხეთი', label: 'სომხეთი' }
];