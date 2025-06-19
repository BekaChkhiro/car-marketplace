export interface User {
  id: number;
  username: string;
  email: string;
  role?: string;
  phone: string;
  first_name: string;
  last_name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  status?: string;
  created_at?: string;
  updated_at?: string;
  profile_completed?: boolean;
  google_id?: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  refreshToken: string;
  user: User;
}

export interface UpdateProfileData {
  username?: string;
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}