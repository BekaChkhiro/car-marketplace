import api from '../config/axios';
import { setStoredToken, removeStoredToken, getRefreshToken } from '../utils/tokenStorage';
import {
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  Tokens
} from '../types/auth.types';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', {
        email: credentials.email.trim(),
        password: credentials.password,
        rememberMe: credentials.rememberMe
      });
      
      if (response.data.tokens) {
        // Store both access and refresh tokens
        setStoredToken(response.data.tokens.accessToken, response.data.tokens.refreshToken);
      } else if (response.data.token) {
        // Backwards compatibility for old token format
        setStoredToken(response.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async refreshToken(): Promise<Tokens> {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post<{ tokens: Tokens }>('/auth/refresh-token', {
        refreshToken
      });

      if (response.data.tokens) {
        setStoredToken(response.data.tokens.accessToken, response.data.tokens.refreshToken);
        return response.data.tokens;
      }
      throw new Error('Invalid token response');
    } catch (error: any) {
      removeStoredToken(); // Clear tokens on refresh failure
      throw new Error(error.response?.data?.message || 'Token refresh failed');
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', {
        username: credentials.username.trim(),
        email: credentials.email.trim(),
        password: credentials.password,
        first_name: credentials.first_name.trim(),
        last_name: credentials.last_name.trim(),
        age: credentials.age,
        gender: credentials.gender,
        phone: credentials.phone.trim()
      });
      
      if (response.data.tokens) {
        setStoredToken(response.data.tokens.accessToken, response.data.tokens.refreshToken);
      }
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
      // Don't throw on 401/403, let the axios interceptor handle token refresh
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        throw new Error(error.response?.data?.message || 'Failed to get profile');
      }
      throw error;
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