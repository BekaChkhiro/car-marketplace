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
  private async fetchWithRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 2,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError;
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;
        if (error?.response?.status !== 500 || i === maxRetries) {
          throw error;
        }
        // Exponential backoff with jitter
        const delay = Math.min(baseDelay * Math.pow(2, i), 8000) + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw lastError;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await this.fetchWithRetry(() => 
        api.post<AuthResponse>('/auth/login', {
          email: credentials.email.trim(),
          password: credentials.password,
          rememberMe: credentials.rememberMe
        })
      );
      
      if (response.data.tokens) {
        setStoredToken(response.data.tokens.accessToken, response.data.tokens.refreshToken);
      } else if (response.data.token) {
        setStoredToken(response.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Login failed';
      console.error('Login error:', {
        status: error?.response?.status,
        message: errorMessage,
        data: error?.response?.data
      });
      throw new Error(errorMessage);
    }
  }

  async refreshToken(): Promise<Tokens> {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await this.fetchWithRetry(() => 
        api.post<{ tokens: Tokens }>('/auth/refresh-token', { refreshToken })
      );

      if (response.data.tokens) {
        setStoredToken(response.data.tokens.accessToken, response.data.tokens.refreshToken);
        return response.data.tokens;
      }
      throw new Error('Invalid token response');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Token refresh failed';
      console.error('Token refresh error:', {
        status: error?.response?.status,
        message: errorMessage,
        data: error?.response?.data
      });
      if (error?.response?.status !== 500) {
        removeStoredToken();
      }
      throw new Error(errorMessage);
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await this.fetchWithRetry(() => 
        api.post<AuthResponse>('/auth/register', {
          username: credentials.username.trim(),
          email: credentials.email.trim(),
          password: credentials.password,
          first_name: credentials.first_name.trim(),
          last_name: credentials.last_name.trim(),
          age: credentials.age,
          gender: credentials.gender,
          phone: credentials.phone.trim()
        })
      );
      
      if (response.data.tokens) {
        setStoredToken(response.data.tokens.accessToken, response.data.tokens.refreshToken);
      }
      return response.data;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Registration failed';
      console.error('Registration error:', {
        status: error?.response?.status,
        message: errorMessage,
        data: error?.response?.data
      });
      throw new Error(errorMessage);
    }
  }

  async getProfile(): Promise<User> {
    try {
      const response = await this.fetchWithRetry(() => api.get<User>('/auth/profile'));
      return response.data;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Failed to get profile';
      console.error('Get profile error:', {
        status: error?.response?.status,
        message: errorMessage,
        data: error?.response?.data
      });
      // Don't throw on 401/403, let the axios interceptor handle token refresh
      if (error?.response?.status !== 401 && error?.response?.status !== 403) {
        throw new Error(errorMessage);
      }
      throw error;
    }
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await this.fetchWithRetry(() => 
        api.put<{ user: User, message: string }>('/auth/profile', data)
      );
      return response.data.user;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Failed to update profile';
      console.error('Update profile error:', {
        status: error?.response?.status,
        message: errorMessage,
        data: error?.response?.data
      });
      throw new Error(errorMessage);
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await this.fetchWithRetry(() => 
        api.put('/auth/change-password', {
          currentPassword,
          newPassword
        })
      );
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Failed to change password';
      console.error('Change password error:', {
        status: error?.response?.status,
        message: errorMessage,
        data: error?.response?.data
      });
      throw new Error(errorMessage);
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await this.fetchWithRetry(() => 
        api.post('/auth/forgot-password', { email: email.trim() })
      );
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Failed to send password reset email';
      console.error('Forgot password error:', {
        status: error?.response?.status,
        message: errorMessage,
        data: error?.response?.data
      });
      throw new Error(errorMessage);
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