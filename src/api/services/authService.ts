import api from '../config/api';
import { AuthResponse, LoginCredentials, RegisterCredentials, UpdateProfileData, ChangePasswordData, User, Tokens } from '../types/auth.types';
import { setStoredToken, removeStoredToken, getRefreshToken } from '../utils/tokenStorage';
import { clearUserData } from '../../utils/userStorage';
import { clearPreferences } from '../../utils/userPreferences';


class AuthService {
  private async fetchWithRetry<T>(request: () => Promise<T>, maxRetries = 3, silent = false): Promise<T> {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await request();
      } catch (error: any) {
        lastError = error;
        if (!silent) {
          console.warn(`API request failed (attempt ${i + 1}/${maxRetries}):`, error.message || 'Unknown error');
        }
        
        // If server returns 401 (unauthorized), clear tokens and stop retrying
        if (error.response?.status === 401) {
          if (!silent) {
            console.error('Authentication failed (401), clearing tokens and stopping retry attempts');
          }
          removeStoredToken();
          clearUserData();
          clearPreferences();
          break;
        }

        // If server returns 500 or network error, immediately stop retrying and throw the error
        if (error.response?.status === 500 || error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
          if (!silent) {
            console.error('Server error or network issue detected, stopping retry attempts');
          }
          break;
        }
        
        if (i === maxRetries - 1) break;
        
        // Exponential backoff
        const delay = Math.pow(2, i) * 1000;
        if (!silent) {
          console.log(`Retrying in ${delay}ms...`);
        }
        await new Promise(resolve => setTimeout(resolve, delay));
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

  async registerWithFile(data: RegisterCredentials, logoFile?: File): Promise<AuthResponse> {
    try {
      const formData = new FormData();
      
      // Add all registration data
      Object.keys(data).forEach(key => {
        const value = data[key as keyof RegisterCredentials];
        if (value !== undefined) {
          if (typeof value === 'object' && value !== null) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      // Add logo file if provided
      if (logoFile) {
        formData.append('logo', logoFile);
      }

      const response = await this.fetchWithRetry(() => 
        api.post<AuthResponse>('/api/auth/register', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
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
        api.put<{ user: User, message: string }>('/api/user/update-profile', data)
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

  async uploadDealerLogo(dealerId: number, formData: FormData): Promise<{ logo_url: string }> {
    try {
      const response = await this.fetchWithRetry(() =>
        api.post(`/api/dealers/${dealerId}/logo`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'ლოგოს ატვირთვა ვერ მოხერხდა');
    }
  }

  // Admin methods
  async getAllUsers(): Promise<User[]> {
    try {
      console.log('Fetching users from server...');
      
      const response = await this.fetchWithRetry(
        () => api.get<{ users: User[] }>('/api/auth/users'),
        3
      );
      
      console.log('Successfully fetched users from server');
      return response.data.users;
    } catch (error: any) {
      console.error('Failed to fetch users from server:', error.message || 'Unknown error');
      
      // Log more detailed error information for debugging
      if (error.response) {
        console.error('Error response:', {
          status: error.response.status,
          data: error.response.data
        });
      } else {
        console.error('Network error or server unavailable:', error);
      }
      
      throw error;
    }
  }

  async getUserById(id: number): Promise<User> {
    try {
      const response = await this.fetchWithRetry(() => api.get<User>(`/api/auth/users/${id}`));
      return response.data;
    } catch (error: any) {
      console.error(`Failed to fetch user with ID ${id} from server:`, error.message || 'Unknown error');
      
      // Log more detailed error information for debugging
      if (error.response) {
        console.error('Error response:', {
          status: error.response.status,
          data: error.response.data
        });
      }
      
      throw error;
    }
  }

  async updateUserRole(userId: number, role: string): Promise<User> {
    try {
      const response = await this.fetchWithRetry(() => 
        api.put<{ user: User }>(`/api/auth/users/${userId}/role`, { role })
      );
      return response.data.user;
    } catch (error: any) {
      console.error(`Failed to update role for user with ID ${userId}:`, error.message || 'Unknown error');
      
      // Log more detailed error information for debugging
      if (error.response) {
        console.error('Error response:', {
          status: error.response.status,
          data: error.response.data
        });
      }
      
      throw error;
    }
  }

  async deleteUser(userId: number): Promise<boolean> {
    try {
      await this.fetchWithRetry(() => 
        api.delete(`/api/auth/users/${userId}`)
      );
      return true;
    } catch (error: any) {
      console.error(`Failed to delete user with ID ${userId}:`, error.message || 'Unknown error');
      
      // Log more detailed error information for debugging
      if (error.response) {
        console.error('Error response:', {
          status: error.response.status,
          data: error.response.data
        });
      }
      
      throw error;
    }
  }
}

export default new AuthService();