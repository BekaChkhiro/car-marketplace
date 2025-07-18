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
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    role: string;
    gender?: 'male' | 'female' | 'other';
    created_at: string;
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

// Admin operation types
export interface CreateDealerRequest {
  userData: {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
    gender: 'male' | 'female' | 'other';
  };
  dealerData: {
    company_name: string;
    logo_url?: string;
    established_year?: number;
    website_url?: string;
    social_media_url?: string;
    address?: string;
  };
}

export interface UpdateDealerRequest {
  company_name?: string;
  logo_url?: string;
  established_year?: number;
  website_url?: string;
  social_media_url?: string;
  address?: string;
}

export interface DealerApiResponse {
  success: boolean;
  message?: string;
  data?: Dealer;
}

export interface DealersListResponse {
  success: boolean;
  data: Dealer[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}