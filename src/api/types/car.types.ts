export interface Car {
  id: number;
  user_id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  engine_size: number;
  transmission: 'manual' | 'automatic';
  fuel_type: 'petrol' | 'diesel' | 'hybrid' | 'electric';
  drive_type: 'FWD' | 'RWD' | 'AWD' | '4WD';
  steering_wheel: 'left' | 'right';
  color: string;
  category: string;
  condition: 'new' | 'used';
  description: string;
  features: string[];
  images: string[];
  created_at: string;
  updated_at: string;
  is_vip?: boolean;
}

export interface Brand {
  id: number;
  name: string;
  models: string[];
}

export interface CarFilters {
  brand?: string;
  model?: string;
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
  category?: string;
  condition?: string;
  features?: string[];
  isVip?: boolean;
  limit?: number;
  offset?: number;
}

export interface CreateCarFormData {
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  engine_size: number;
  transmission: 'manual' | 'automatic';
  fuel_type: 'petrol' | 'diesel' | 'hybrid' | 'electric';
  drive_type: 'FWD' | 'RWD' | 'AWD' | '4WD';
  steering_wheel: 'left' | 'right';
  color: string;
  category: string;
  condition: 'new' | 'used';
  description: string;
  features: string[];
  images: File[];
  is_vip?: boolean;
}

export interface UpdateCarFormData extends Partial<CreateCarFormData> {
  id: number;
}
