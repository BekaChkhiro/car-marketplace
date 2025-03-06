import api from '../config/axios';
import { setStoredToken, removeStoredToken } from '../utils/tokenStorage';
import {
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthResponse
} from '../types/auth.types';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', {
        email: credentials.email.trim(),
        password: credentials.password
      });
      
      if (response.data.token) {
        setStoredToken(response.data.token);
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', {
        username: credentials.username.trim(),
        email: credentials.email.trim(),
        password: credentials.password
      });
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  async getProfile(): Promise<User> {
    try {
      const response = await api.get<User>('/auth/profile');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get profile');
    }
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await api.put<{ user: User, message: string }>('/auth/profile', data);
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await api.put('/auth/change-password', {
        currentPassword,
        newPassword
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to change password');
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await api.post('/auth/forgot-password', { 
        email: email.trim() 
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send password reset email');
    }
  }

  logout(): void {
    try {
      removeStoredToken();
    } catch (error: any) {
      console.error('Logout error:', error);
    }
  }
}

export default new AuthService();