export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  age?: number;
  gender?: string;
  phone?: string;
  role: string;
  created_at: string;
  profile_completed: boolean;
  google_id?: string;
}

export interface UserProfileCompletion {
  age: number;
  gender: string;
  phone: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}
