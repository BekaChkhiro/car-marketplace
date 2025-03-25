export interface CarSpecifications {
  transmission: string;
  fuel_type: string;
  body_type: string;
  drive_type: string;
  steering_wheel?: string;
  engine_size?: number;
  mileage?: number;
  color?: string;
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
  // ძირითადი ინფო
  brand_id: string;
  model: string;
  category_id: string;
  year: number;
  price: number;
  
  // აღწერა
  description_ka: string;
  description_en?: string;
  description_ru?: string;
  
  // მდებარეობა
  city: string;
  state?: string;
  country: string;
  location_type: 'georgia' | 'transit' | 'international';
  transit_status?: string;
  
  // ტექნიკური მახასიათებლები
  specifications: {
    transmission: string;
    fuel_type: string;
    body_type: string;
    drive_type: string;
    steering_wheel?: string;
    engine_size?: number;
    mileage?: number;
    color?: string;
  };
  
  // დამატებითი ფუნქციები
  features: CarFeatures;
}

export interface FormSectionProps {
  formData: NewCarFormData;
  onChange: (field: string, value: any) => void;
  onSpecificationsChange?: (field: string, value: any) => void;
  errors?: { [key: string]: string };
}

export type FormSection = 'specifications' | 'features';

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
  'მექანიკური',
  'ავტომატური',
  'ტიპტრონიკი',
  'ვარიატორი'
].map(option => ({ value: option, label: option }));

export const FUEL_TYPE_OPTIONS: Option[] = [
  'ბენზინი',
  'დიზელი',
  'ჰიბრიდი',
  'ელექტრო',
  'ბუნებრივი გაზი',
  'თხევადი გაზი'
].map(option => ({ value: option, label: option }));

export const BODY_TYPE_OPTIONS = [
  'სედანი',
  'ჰეტჩბეკი',
  'უნივერსალი',
  'კუპე',
  'კაბრიოლეტი',
  'ჯიპი',
  'პიკაპი',
  'მინივენი',
  'მიკროავტობუსი',
  'ფურგონი'
];

export const DRIVE_TYPE_OPTIONS: Option[] = [
  'წინა',
  'უკანა',
  '4x4'
].map(option => ({ value: option, label: option }));

export const STEERING_WHEEL_OPTIONS = [
  'მარჯვენა',
  'მარცხენა'
];

export const COLOR_OPTIONS = [
  'შავი',
  'თეთრი',
  'ვერცხლისფერი',
  'რუხი',
  'ლურჯი',
  'წითელი',
  'ყავისფერი',
  'მწვანე',
  'ყვითელი',
  'ოქროსფერი',
  'ნარინჯისფერი',
  'სხვა'
];

export const INTERIOR_COLOR_OPTIONS = [
  'შავი',
  'რუხი',
  'ბეჟი',
  'ყავისფერი',
  'წითელი',
  'სხვა'
];

export const INTERIOR_MATERIAL_OPTIONS = [
  'ტყავი',
  'ნაჭერი',
  'კომბინირებული',
  'ალკანტარა',
  'ველიური'
];

export const DOORS_OPTIONS = ['2', '3', '4', '5'];

export const CYLINDER_OPTIONS = [2, 3, 4, 5, 6, 8, 10, 12];

export const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

export const MILEAGE_UNIT_OPTIONS = ['km', 'mi'];

export const CITY_OPTIONS = [
  'თბილისი',
  'ქუთაისი',
  'ბათუმი',
  'რუსთავი',
  'გორი',
  'ზუგდიდი',
  'ფოთი',
  'ხაშური',
  'სამტრედია',
  'სენაკი',
  'ზესტაფონი',
  'მარნეული',
  'თელავი',
  'ახალციხე',
  'ქობულეთი',
  'ოზურგეთი',
  'კასპი',
  'ჭიათურა',
  'წყალტუბო',
  'საგარეჯო',
  'გარდაბანი',
  'ბორჯომი',
  'სხვა'
] as const;

export const COUNTRY_OPTIONS = [
  'საქართველო',
  'გერმანია',
  'აშშ',
  'იაპონია',
  'კორეა',
  'დიდი ბრიტანეთი',
  'საფრანგეთი',
  'იტალია',
  'ესპანეთი',
  'ბელგია',
  'ნიდერლანდები',
  'შვეიცარია',
  'ავსტრია',
  'შვედეთი',
  'ნორვეგია',
  'დანია',
  'ფინეთი',
  'პოლონეთი',
  'ჩეხეთი',
  'სლოვაკეთი',
  'უნგრეთი',
  'რუმინეთი',
  'ბულგარეთი',
  'საბერძნეთი',
  'თურქეთი',
  'სხვა'
] as const;

export const LOCATION_TYPE_OPTIONS: Option[] = [
  { value: 'transit', label: 'ტრანზიტში' },
  { value: 'georgia', label: 'საქართველოში' },
  { value: 'international', label: 'საზღვარგარეთ' }
];

// Features and equipment options
export const SAFETY_FEATURES = [
  'ABS',
  'EBD',
  'მძღოლის უსაფრთხოების ბალიში',
  'მგზავრის უსაფრთხოების ბალიში',
  'გვერდითი უსაფრთხოების ბალიშები',
  'ESP',
  'სიგნალიზაცია',
  'ცენტრალური საკეტი',
  'იმობილაიზერი'
];

export const INTERIOR_FEATURES = [
  'კონდიციონერი',
  'კლიმატ-კონტროლი',
  'ტყავის სალონი',
  'ნავიგაცია',
  'ლუქი',
  'პანორამული ჭერი',
  'მულტისაჭე',
  'ელ.შუშები',
  'ელ.სავარძლები',
  'სავარძლების გათბობა',
  'სავარძლების ვენტილაცია',
  'საჭის გათბობა',
  'უკანა ხედვის კამერა',
  'კრუიზ-კონტროლი',
  'ბორტკომპიუტერი',
  'Bluetooth',
  'CD',
  'USB',
  'AUX'
];

export const EXTERIOR_FEATURES = [
  'სანისლე ფარები',
  'ქსენონის ფარები',
  'LED ფარები',
  'ალუმინის დისკები',
  'პარკტრონიკი',
  'ელ.სარკეები',
  'წვიმის სენსორი',
  'სინათლის სენსორი'
];

export interface ImageUploadResponse {
  url: string;
  thumbnail: string;
  medium: string;
  large: string;
}