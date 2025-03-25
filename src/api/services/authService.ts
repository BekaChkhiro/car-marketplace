import api from '../config/axios';
import { AuthResponse, LoginCredentials, RegisterCredentials, UpdateProfileData, ChangePasswordData, User, Tokens } from '../types/auth.types';
import { setStoredToken, removeStoredToken, getRefreshToken } from '../utils/tokenStorage';
import { clearUserData } from '../../utils/userStorage';
import { clearPreferences } from '../../utils/userPreferences';
import { clearCsrfToken } from '../utils/csrfProtection';

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
        api.post<AuthResponse>('/auth/login', credentials)
      );

      if (response.data.tokens) {
        const { accessToken, refreshToken } = response.data.tokens;
        setStoredToken(accessToken, refreshToken);
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'შესვლა ვერ მოხერხდა');
    }
  }

  async register(data: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await this.fetchWithRetry(() => 
        api.post<AuthResponse>('/auth/register', data)
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
        await api.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clean up all storage regardless of API call success
      removeStoredToken();
      clearUserData();
      clearPreferences();
      clearCsrfToken();
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
      return response.data.tokens;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Token refresh failed');
    }
  }

  async getProfile(): Promise<User> {
    try {
      const response = await this.fetchWithRetry(() => api.get<User>('/auth/profile'));
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Profile fetch failed');
    }
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await this.fetchWithRetry(() =>
        api.put<{ user: User, message: string }>('/auth/profile', data)
      );
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Profile update failed');
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await api.post('/auth/change-password', { currentPassword, newPassword });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'პაროლის შეცვლა ვერ მოხერხდა');
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await api.post('/auth/forgot-password', { email });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'პაროლის აღდგენა ვერ მოხერხდა');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await api.post('/auth/reset-password', {
        token,
        newPassword
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'პაროლის შეცვლა ვერ მოხერხდა');
    }
  }
}

export default new AuthService();