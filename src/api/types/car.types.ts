export interface Car {
  id: number;
  brand_id: number;
  category_id: number;
  brand: string;
  model: string;
  title?: string;
  year: number;
  price: number;
  currency?: 'GEL' | 'USD';
  description_ka: string;
  description_en?: string;
  description_ru?: string;
  status: 'available' | 'sold' | 'pending';
  featured: boolean;
  seller_id: number;
  created_at: string;
  updated_at: string;
  specifications: CarSpecifications;
  location: CarLocation;
  images: CarImage[];
}

export interface CarSpecifications {
  id: number;
  engine_type?: string;
  transmission: 'manual' | 'automatic';
  fuel_type: string;
  mileage: number;
  mileage_unit: 'km' | 'mi';
  engine_size?: number;
  horsepower?: number;
  is_turbo?: boolean;
  cylinders?: number;
  color?: string;
  body_type?: string;
  steering_wheel: 'left' | 'right';
  drive_type: 'FWD' | 'RWD' | 'AWD' | '4WD';
  clearance_status?: 'cleared' | 'not_cleared' | 'in_progress';
  has_catalyst?: boolean;
  airbags_count?: number;
  interior_material?: string;
  interior_color?: string;
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

export interface CarLocation {
  id: number;
  city: string;
  country: string;
  location_type: 'georgia' | 'transit' | 'international';
  is_transit: boolean;
}

export interface CarImage {
  id: number;
  car_id: number;
  url: string;
  thumbnail_url: string;
  medium_url: string;
  large_url: string;
  is_primary: boolean;
}

export interface Brand {
  id: number;
  name: string;
  models: string[];
}

export interface Category {
  id: number;
  name: string;
}

export interface CarFilters {
  brand?: string;
  model?: string;
  category?: string;
  yearFrom?: number;
  yearTo?: number;
  priceFrom?: number;
  priceTo?: number;
  mileageFrom?: number;
  mileageTo?: number;
  transmission?: string;
  fuelType?: string;
  driveType?: string;
  steeringWheel?: string;
  features?: string[];
  bodyType?: string;
  location?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  featured?: boolean;
}

export interface CreateCarFormData {
  brand_id: number;
  category_id: number;
  model: string;
  title?: string;
  year: number;
  price: number;
  currency?: 'GEL' | 'USD';
  description_ka: string;
  description_en?: string;
  description_ru?: string;
  specifications: Partial<CarSpecifications>;
  features: string[];
  images: File[];
  location: {
    city: string;
    country: string;
    location_type?: string;
    is_transit?: boolean;
  };
}

export interface UpdateCarFormData extends Partial<CreateCarFormData> {
  id: number;
}
