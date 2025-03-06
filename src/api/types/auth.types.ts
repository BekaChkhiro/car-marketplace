export interface User {
  id: number;
  username: string;
  email: string;
  role?: string;
  phone?: string;
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
}

export interface AuthResponse {
  message: string;
  token?: string;
  tokens?: Tokens;
  user: User;
}

export interface UpdateProfileData {
  username?: string;
  email?: string;
  phone?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}