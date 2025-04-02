import api from '../config/api';
import { AuthResponse, LoginCredentials, RegisterCredentials, UpdateProfileData, ChangePasswordData, User, Tokens } from '../types/auth.types';
import { setStoredToken, removeStoredToken, getRefreshToken } from '../utils/tokenStorage';
import { clearUserData } from '../../utils/userStorage';
import { clearPreferences } from '../../utils/userPreferences';

// Mock data for users when server connection fails
const mockUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    first_name: 'Admin',
    last_name: 'User',
    role: 'admin',
    phone: '+1234567890',
    age: 30,
    gender: 'male',
    status: 'active',
    created_at: '2023-01-15T10:30:00Z',
    updated_at: '2023-05-20T14:45:00Z'
  },
  {
    id: 2,
    username: 'user1',
    email: 'user1@example.com',
    first_name: 'Regular',
    last_name: 'User',
    role: 'user',
    phone: '+1234567891',
    age: 25,
    gender: 'female',
    status: 'active',
    created_at: '2023-02-10T09:15:00Z',
    updated_at: '2023-06-05T11:20:00Z'
  },
  {
    id: 3,
    username: 'user2',
    email: 'user2@example.com',
    first_name: 'Another',
    last_name: 'User',
    role: 'user',
    phone: '+1234567892',
    age: 35,
    gender: 'other',
    status: 'დაბლოკილი',
    created_at: '2023-03-22T16:40:00Z',
    updated_at: '2023-07-12T08:30:00Z'
  }
];

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

  // Admin methods
  // Flag to track if we've already shown the server error message
  private hasShownServerError = false;

  async getAllUsers(): Promise<User[]> {
    try {
      // Only log the first attempt to reduce console noise
      if (!this.hasShownServerError) {
        console.log('Attempting to fetch users from server...');
      }
      
      const response = await this.fetchWithRetry(
        () => api.get<{ users: User[] }>('/api/auth/users'),
        3,
        this.hasShownServerError // Silent mode if we've already shown errors
      );
      
      // Reset the flag if successful
      this.hasShownServerError = false;
      console.log('Successfully fetched users from server');
      return response.data.users;
    } catch (error: any) {
      // Only show detailed error messages the first time
      if (!this.hasShownServerError) {
        console.warn('Failed to fetch users from server, using mock data instead:', error.message || 'Unknown error');
        
        // Log more detailed error information for debugging
        if (error.response) {
          console.error('Error response:', {
            status: error.response.status,
            data: error.response.data
          });
        } else {
          console.error('Network error or server unavailable:', error);
        }
        
        console.log('Using mock user data as fallback');
        
        // Set the flag to avoid showing the same error messages repeatedly
        this.hasShownServerError = true;
      }
      
      // Return mock data as fallback
      return [...mockUsers]; // Return a copy to prevent mutation issues
    }
  }

  async getUserById(id: number): Promise<User> {
    try {
      const response = await this.fetchWithRetry(() => api.get<User>(`/api/auth/users/${id}`));
      return response.data;
    } catch (error: any) {
      console.warn(`Failed to fetch user with ID ${id} from server, using mock data instead:`, error.message || 'Unknown error');
      
      // Log more detailed error information for debugging
      if (error.response) {
        console.error('Error response:', {
          status: error.response.status,
          data: error.response.data
        });
      }
      
      // Return mock user as fallback
      const mockUser = mockUsers.find(user => user.id === id);
      if (mockUser) {
        return {...mockUser}; // Return a copy to prevent mutation issues
      }
      throw new Error(`User with ID ${id} not found`);
    }
  }

  async updateUserRole(userId: number, role: string): Promise<User> {
    try {
      const response = await this.fetchWithRetry(() => 
        api.put<{ user: User }>(`/api/auth/users/${userId}/role`, { role })
      );
      return response.data.user;
    } catch (error: any) {
      console.warn(`Failed to update role for user with ID ${userId} from server, using mock data instead:`, error.message || 'Unknown error');
      
      // Log more detailed error information for debugging
      if (error.response) {
        console.error('Error response:', {
          status: error.response.status,
          data: error.response.data
        });
      }
      
      // Create a copy of mockUsers to avoid mutating the original array
      const updatedMockUsers = [...mockUsers];
      const mockUserIndex = updatedMockUsers.findIndex(user => user.id === userId);
      
      if (mockUserIndex !== -1) {
        // Create a new user object with the updated role
        updatedMockUsers[mockUserIndex] = {
          ...updatedMockUsers[mockUserIndex],
          role: role
        };
        
        // Update the original mockUsers array
        mockUsers[mockUserIndex] = {...updatedMockUsers[mockUserIndex]};
        
        return {...mockUsers[mockUserIndex]};
      }
      throw new Error(`User with ID ${userId} not found`);
    }
  }
}

export default new AuthService();