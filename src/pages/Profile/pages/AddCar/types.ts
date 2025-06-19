import { CreateCarFormData } from '../../../../api/types/car.types';

export interface CarSpecifications {
  transmission: 'manual' | 'automatic';
  fuel_type: 'petrol' | 'diesel' | 'hybrid' | 'electric' | 'plug_in_hybrid' | 'lpg' | 'cng' | 'hydrogen';
  drive_type: 'FWD' | 'RWD' | 'AWD' | '4WD';
  steering_wheel: 'left' | 'right';
  engine_size?: number;
  mileage?: number;
  mileage_unit?: 'km' | 'mi';
  color?: string;
  cylinders?: number;
  interior_material?: string;
  interior_color?: string;
  airbags_count?: number;
  engine_type?: string;
  body_type?: string;
  horsepower?: number;
  has_board_computer?: boolean;
  has_alarm?: boolean;
}

export interface CarFeatures {
  has_hydraulics?: boolean; // ჰიდრავლიკა
  has_board_computer?: boolean; // ბორტკომპიუტერი
  has_air_conditioning?: boolean; // კონდიციონერი
  has_parking_control?: boolean; // პარკინგკონტროლი
  has_rear_view_camera?: boolean; // უკანა ხედვის კამერა
  has_electric_windows?: boolean; // ელექტრო შუშები
  has_climate_control?: boolean; // კლიმატკონტროლი
  has_cruise_control?: boolean; // კრუიზ-კონტროლი
  has_start_stop?: boolean; // Start/Stop სისტემა
  has_sunroof?: boolean; // ლუქი
  has_heated_seats?: boolean; // სავარძლის გათბობა
  has_memory_seats?: boolean; // სავარძლის მეხსიერება
  has_abs?: boolean; // ABS
  has_traction_control?: boolean; // მოცურების საწინააღმდეგო სისტემა
  has_central_locking?: boolean; // ცენტრალური საკეტი
  has_alarm?: boolean; // სიგნალიზაცია
  has_fog_lights?: boolean; // სანისლე ფარები
  has_navigation?: boolean; // მონიტორი (ნავიგაცია)
  has_aux?: boolean; // AUX
  has_bluetooth?: boolean; // Bluetooth
  has_multifunction_steering_wheel?: boolean; // მულტი საჭე
  has_alloy_wheels?: boolean; // დისკები
  has_spare_tire?: boolean; // სათადარიგო საბურავი
  has_disability_adapted?: boolean; // სსმპ ადაპტირებული
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
  vip_status: 'none' | 'vip' | 'vip_plus' | 'super_vip';
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



export const INTERIOR_MATERIAL_OPTIONS: Option[] = [
  { value: 'fabric', label: 'ნაჭერი' },
  { value: 'leather', label: 'ტყავი' },
  { value: 'synthetic_leather', label: 'ხელოვნური ტყავი' },
  { value: 'combined', label: 'კომბინირებული' },
  { value: 'alcantara', label: 'ალკანტარა' }
];

export const INTERIOR_COLOR_OPTIONS: Option[] = [
  { value: 'black', label: 'შავი' },
  { value: 'white', label: 'თეთრი' },
  { value: 'gray', label: 'რუხი' },
  { value: 'brown', label: 'ყავისფერი' },
  { value: 'beige', label: 'ჩალისფერი' },
  { value: 'red', label: 'წითელი' },
  { value: 'blue', label: 'ლურჯი' },
  { value: 'yellow', label: 'ყვითელი' },
  { value: 'orange', label: 'ნარინჯისფერი' },
  { value: 'burgundy', label: 'შინდისფერი' },
  { value: 'gold', label: 'ოქროსფერი' }
];

export const COLOR_OPTIONS: Option[] = [
  { value: 'white', label: 'თეთრი' },
  { value: 'black', label: 'შავი' },
  { value: 'silver', label: 'ვერცხლისფერი' },
  { value: 'gray', label: 'რუხი' },
  { value: 'red', label: 'წითელი' },
  { value: 'blue', label: 'ლურჯი' },
  { value: 'yellow', label: 'ყვითელი' },
  { value: 'green', label: 'მწვანე' },
  { value: 'orange', label: 'ნარინჯისფერი' },
  { value: 'gold', label: 'ოქროსფერი' },
  { value: 'purple', label: 'იისფერი' },
  { value: 'pink', label: 'ვარდისფერი' },
  { value: 'beige', label: 'ჩალისფერი' },
  { value: 'burgundy', label: 'შინდისფერი' },
  { value: 'lightblue', label: 'ცისფერი' },
  { value: 'brown', label: 'ყავისფერი' },
  { value: 'other', label: 'სხვა' }
];

export const ENGINE_SIZE_OPTIONS: Option[] = [
  { value: '0.05', label: '0.05' },
  { value: '0.1', label: '0.1' },
  { value: '0.2', label: '0.2' },
  { value: '0.3', label: '0.3' },
  { value: '0.4', label: '0.4' },
  { value: '0.5', label: '0.5' },
  { value: '0.6', label: '0.6' },
  { value: '0.7', label: '0.7' },
  { value: '0.8', label: '0.8' },
  { value: '0.9', label: '0.9' },
  { value: '1.0', label: '1.0' },
  { value: '1.1', label: '1.1' },
  { value: '1.2', label: '1.2' },
  { value: '1.3', label: '1.3' },
  { value: '1.4', label: '1.4' },
  { value: '1.5', label: '1.5' },
  { value: '1.6', label: '1.6' },
  { value: '1.7', label: '1.7' },
  { value: '1.8', label: '1.8' },
  { value: '1.9', label: '1.9' },
  { value: '2.0', label: '2.0' },
  { value: '2.1', label: '2.1' },
  { value: '2.2', label: '2.2' },
  { value: '2.3', label: '2.3' },
  { value: '2.4', label: '2.4' },
  { value: '2.5', label: '2.5' },
  { value: '2.6', label: '2.6' },
  { value: '2.7', label: '2.7' },
  { value: '2.8', label: '2.8' },
  { value: '2.9', label: '2.9' },
  { value: '3.0', label: '3.0' },
  { value: '3.1', label: '3.1' },
  { value: '3.2', label: '3.2' },
  { value: '3.3', label: '3.3' },
  { value: '3.4', label: '3.4' },
  { value: '3.5', label: '3.5' },
  { value: '3.6', label: '3.6' },
  { value: '3.7', label: '3.7' },
  { value: '3.8', label: '3.8' },
  { value: '3.9', label: '3.9' },
  { value: '4.0', label: '4.0' },
  { value: '4.1', label: '4.1' },
  { value: '4.2', label: '4.2' },
  { value: '4.3', label: '4.3' },
  { value: '4.4', label: '4.4' },
  { value: '4.5', label: '4.5' },
  { value: '4.6', label: '4.6' },
  { value: '4.7', label: '4.7' },
  { value: '4.8', label: '4.8' },
  { value: '4.9', label: '4.9' },
  { value: '5.0', label: '5.0' },
  { value: '5.1', label: '5.1' },
  { value: '5.2', label: '5.2' },
  { value: '5.3', label: '5.3' },
  { value: '5.4', label: '5.4' },
  { value: '5.5', label: '5.5' },
  { value: '5.6', label: '5.6' },
  { value: '5.7', label: '5.7' },
  { value: '5.8', label: '5.8' },
  { value: '5.9', label: '5.9' },
  { value: '6.0', label: '6.0' },
  { value: '6.1', label: '6.1' },
  { value: '6.2', label: '6.2' },
  { value: '6.3', label: '6.3' },
  { value: '6.4', label: '6.4' },
  { value: '6.5', label: '6.5' },
  { value: '6.6', label: '6.6' },
  { value: '6.7', label: '6.7' },
  { value: '6.8', label: '6.8' },
  { value: '6.9', label: '6.9' },
  { value: '7.0', label: '7.0' },
  { value: '7.1', label: '7.1' },
  { value: '7.2', label: '7.2' },
  { value: '7.3', label: '7.3' },
  { value: '7.4', label: '7.4' },
  { value: '7.5', label: '7.5' },
  { value: '7.6', label: '7.6' },
  { value: '7.7', label: '7.7' },
  { value: '7.8', label: '7.8' },
  { value: '7.9', label: '7.9' },
  { value: '8.0', label: '8.0' },
  { value: '8.1', label: '8.1' },
  { value: '8.2', label: '8.2' },
  { value: '8.3', label: '8.3' },
  { value: '8.4', label: '8.4' },
  { value: '8.5', label: '8.5' },
  { value: '8.6', label: '8.6' },
  { value: '8.7', label: '8.7' },
  { value: '8.8', label: '8.8' },
  { value: '8.9', label: '8.9' },
  { value: '9.0', label: '9.0' },
  { value: '9.1', label: '9.1' },
  { value: '9.2', label: '9.2' },
  { value: '9.3', label: '9.3' },
  { value: '9.4', label: '9.4' },
  { value: '9.5', label: '9.5' },
  { value: '9.6', label: '9.6' },
  { value: '9.7', label: '9.7' },
  { value: '9.8', label: '9.8' },
  { value: '9.9', label: '9.9' },
  { value: '10.0', label: '10.0' },
  { value: '10.1', label: '10.1' },
  { value: '10.2', label: '10.2' },
  { value: '10.3', label: '10.3' },
  { value: '10.4', label: '10.4' },
  { value: '10.5', label: '10.5' },
  { value: '10.6', label: '10.6' },
  { value: '10.7', label: '10.7' },
  { value: '10.8', label: '10.8' },
  { value: '10.9', label: '10.9' },
  { value: '11.0', label: '11.0' },
  { value: '11.1', label: '11.1' },
  { value: '11.2', label: '11.2' },
  { value: '11.3', label: '11.3' },
  { value: '11.4', label: '11.4' },
  { value: '11.5', label: '11.5' },
  { value: '11.6', label: '11.6' },
  { value: '11.7', label: '11.7' },
  { value: '11.8', label: '11.8' },
  { value: '11.9', label: '11.9' },
  { value: '12.0', label: '12.0' },
  { value: '12.1', label: '12.1' },
  { value: '12.2', label: '12.2' },
  { value: '12.3', label: '12.3' },
  { value: '12.4', label: '12.4' },
  { value: '12.5', label: '12.5' },
  { value: '12.6', label: '12.6' },
  { value: '12.7', label: '12.7' },
  { value: '12.8', label: '12.8' },
  { value: '12.9', label: '12.9' },
  { value: '13.0', label: '13.0' }
];

export const LOCATION_TYPE_OPTIONS: Option[] = [
  { value: 'georgia', label: 'საქართველოში' },
  { value: 'transit', label: 'ტრანზიტში' },
  { value: 'international', label: 'საზღვარგარეთ' }
];

export const VIP_STATUS_OPTIONS: Option[] = [
  { value: 'none', label: 'სტანდარტული' },
  { value: 'vip', label: 'VIP' },
  { value: 'vip_plus', label: 'VIP+' },
  { value: 'super_vip', label: 'SUPER VIP' }
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