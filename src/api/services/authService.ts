import api from '../config/axios';
import { setStoredToken, removeStoredToken, getRefreshToken } from '../utils/tokenStorage';
import {
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  Tokens
} from '../types/auth.types';

// Retry configuration
const RETRY_COUNT = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

class AuthService {
  private async retryOperation<T>(
    operation: () => Promise<T>,
    retries = RETRY_COUNT,
    delay = INITIAL_RETRY_DELAY
  ): Promise<T> {
    try {
      return await operation();
    } catch (error: any) {
      if (retries === 0 || error?.response?.status !== 500) {
        throw error;
      }

      console.log(`Retrying operation after ${delay}ms. Retries left: ${retries}`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return this.retryOperation(operation, retries - 1, delay * 2);
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await this.retryOperation(() => 
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
      console.error('Login error details:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async refreshToken(): Promise<Tokens> {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await this.retryOperation(() => 
        api.post<{ tokens: Tokens }>('/auth/refresh-token', { refreshToken })
      );

      if (response.data.tokens) {
        setStoredToken(response.data.tokens.accessToken, response.data.tokens.refreshToken);
        return response.data.tokens;
      }
      throw new Error('Invalid token response');
    } catch (error: any) {
      console.error('Token refresh error:', error.response?.data);
      removeStoredToken();
      throw new Error(error.response?.data?.message || 'Token refresh failed');
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await this.retryOperation(() => 
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
      console.error('Registration error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  async getProfile(): Promise<User> {
    try {
      // Attempt to refresh token before getting profile if needed
      const tokens = await this.ensureValidToken();
      
      const response = await this.retryOperation(() => 
        api.get<User>('/auth/profile', {
          headers: tokens ? { Authorization: `Bearer ${tokens.accessToken}` } : undefined
        })
      );
      
      return response.data;
    } catch (error: any) {
      console.error('Get profile error:', error.response?.data);
      // Don't throw on 401/403, let the axios interceptor handle token refresh
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        throw new Error(error.response?.data?.message || 'Failed to get profile');
      }
      throw error;
    }
  }

  private async ensureValidToken(): Promise<Tokens | null> {
    try {
      const currentToken = getRefreshToken();
      if (!currentToken) {
        return null;
      }
      return await this.refreshToken();
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await this.retryOperation(() => 
        api.put<{ user: User, message: string }>('/auth/profile', data)
      );
      return response.data.user;
    } catch (error: any) {
      console.error('Update profile error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await this.retryOperation(() => 
        api.put('/auth/change-password', {
          currentPassword,
          newPassword
        })
      );
    } catch (error: any) {
      console.error('Change password error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to change password');
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await this.retryOperation(() => 
        api.post('/auth/forgot-password', { email: email.trim() })
      );
    } catch (error: any) {
      console.error('Forgot password error:', error.response?.data);
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