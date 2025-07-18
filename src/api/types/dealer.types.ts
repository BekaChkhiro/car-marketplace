export interface Dealer {
  id: number;
  user_id: number;
  company_name: string;
  logo_url?: string;
  established_year?: number;
  website_url?: string;
  social_media_url?: string;
  address?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role: string;
  };
  car_count?: number;
  cars?: DealerCar[]; // Add cars array to dealer profile
}

export interface DealerFilters {
  search?: string;
  established_year_min?: number;
  established_year_max?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export interface DealerResponse {
  dealers: Dealer[];
  total: number;
  page: number;
  totalPages: number;
}

export interface DealerCar {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  engine_size: number;
  fuel_type: string;
  transmission: string;
  body_type: string;
  featured_image?: string;
  images?: string[];
  is_vip: boolean;
  vip_type?: string;
  vip_expires_at?: string;
  created_at: string;
  updated_at: string;
}