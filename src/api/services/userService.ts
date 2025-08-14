import api from '../config/api';
import { getAccessToken } from '../utils/tokenStorage';
import { User } from '../types/auth.types';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  role?: string;
  created_at?: string;
  profile_image?: string;
  rating?: number;
  total_listings?: number;
}

class UserService {
  async getUserProfile(userId: number): Promise<UserProfile> {
    try {
      const response = await api.get(`/api/users/${userId}/profile`);
      return response.data.user;
    } catch (error) {
      console.error('[UserService.getUserProfile] Error fetching user profile:', error);
      throw error;
    }
  }

  async getUserListingsCount(userId: number): Promise<{ cars: number; parts: number }> {
    try {
      const response = await api.get(`/api/users/${userId}/listings/count`);
      return response.data;
    } catch (error) {
      console.error('[UserService.getUserListingsCount] Error fetching user listings count:', error);
      return { cars: 0, parts: 0 };
    }
  }

  // This is a mock implementation since we don't have the actual API endpoint
  async getSellerInfo(userId: number): Promise<UserProfile> {
    try {
      const response = await api.get(`/api/users/${userId}/profile`);
      return response.data.user;
    } catch (error) {
      console.error('[UserService.getSellerInfo] Error fetching seller info:', error);
      // Return a minimal profile if API fails
      return {
        id: userId,
        username: 'Unknown User',
        email: '',
        phone: '',
        first_name: '',
        last_name: '',
        created_at: new Date().toISOString(),
        total_listings: 0
      };
    }
  }

  async syncContactToCars(options: { syncName?: boolean; syncPhone?: boolean }): Promise<{ updated: number }>{
    try {
      const response = await api.post('/api/user/sync-contact-to-cars', {
        syncName: Boolean(options.syncName),
        syncPhone: Boolean(options.syncPhone)
      });
      return { updated: response.data?.updated ?? 0 };
    } catch (error: any) {
      console.error('[UserService.syncContactToCars] Error:', error);
      throw error;
    }
  }
}

export default new UserService();
