import api from '../config/axios';
import { AuthResponse, LoginCredentials, RegisterCredentials, UpdateProfileData, ChangePasswordData, User, Tokens } from '../types/auth.types';
import { setStoredToken, removeStoredToken, getRefreshToken } from '../utils/tokenStorage';
import { clearUserData } from '../../utils/userStorage';
import { clearPreferences } from '../../utils/userPreferences';

class AuthService {
  private async fetchWithRetry<T>(request: () => Promise<T>, maxRetries = 3): Promise<T> {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await request();
      } catch (error: any) {
        lastError = error;
        if (i === maxRetries - 1) break;
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
    throw lastError;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await this.fetchWithRetry(() => 
        api.post<AuthResponse>('/api/auth/login', credentials)
      );

      if (response.data.token && response.data.refreshToken) {
        setStoredToken(response.data.token, response.data.refreshToken);
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'შესვლა ვერ მოხერხდა');
    }
  }

  async register(data: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await this.fetchWithRetry(() => 
        api.post<AuthResponse>('/api/auth/register', data)
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'რეგისტრაცია ვერ მოხერხდა');
    }
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await api.post('/api/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clean up all storage regardless of API call success
      removeStoredToken();
      clearUserData();
      clearPreferences();
    }
  }

  async refreshToken(): Promise<Tokens> {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }
      const response = await this.fetchWithRetry(() =>
        api.post<{ token: string, refreshToken: string }>('/api/auth/refresh-token', { refreshToken })
      );
      return {
        accessToken: response.data.token,
        refreshToken: response.data.refreshToken
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Token refresh failed');
    }
  }

  async getProfile(): Promise<User> {
    try {
      const response = await this.fetchWithRetry(() => api.get<User>('/api/auth/profile'));
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Profile fetch failed');
    }
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await this.fetchWithRetry(() =>
        api.put<{ user: User, message: string }>('/api/auth/profile', data)
      );
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Profile update failed');
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await api.post('/api/auth/change-password', { currentPassword, newPassword });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'პაროლის შეცვლა ვერ მოხერხდა');
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await api.post('/api/auth/forgot-password', { email });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'პაროლის აღდგენა ვერ მოხერხდა');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await api.post('/api/auth/reset-password', {
        token,
        newPassword
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'პაროლის შეცვლა ვერ მოხერხდა');
    }
  }
}

export default new AuthService();