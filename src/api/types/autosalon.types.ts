export interface Autosalon {
  id: number;
  user_id: number;
  company_name: string;
  logo_url?: string;
  phone?: string;
  established_year?: number;
  website_url?: string;
  address?: string;
  created_at: string;
  car_count?: number;
  
  // User information
  user?: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    gender?: 'male' | 'female' | 'other';
    role: string;
    created_at: string;
  };
}

export interface CreateAutosalonRequest {
  userData: {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
    gender: 'male' | 'female' | 'other';
  };
  autosalonData: {
    company_name: string;
    logo_url?: string;
    established_year?: number;
    website_url?: string;
    address?: string;
  };
}

export interface UpdateAutosalonRequest {
  company_name?: string;
  logo_url?: string;
  phone?: string;
  established_year?: number;
  website_url?: string;
  address?: string;
}

export interface AutosalonResponse {
  success: boolean;
  message?: string;
  data?: Autosalon;
}

export interface AutosalonsListResponse {
  success: boolean;
  data: Autosalon[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}