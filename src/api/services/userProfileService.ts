import api from '../config/axios';
import { UserProfileCompletion } from '../../types/user';

/**
 * Service for user profile-related operations
 */
class UserProfileService {
  /**
   * Check if the user's profile is completed
   */
  async getProfileStatus(): Promise<boolean> {
    try {
      const response = await api.get('/user/profile-status');
      return response.data.profileCompleted;
    } catch (error) {
      console.error('Error checking profile status:', error);
      return true; // Default to true to avoid blocking UI if there's an error
    }
  }

  /**
   * Complete user profile with required fields
   */
  async completeProfile(profileData: UserProfileCompletion): Promise<any> {
    try {
      const response = await api.put('/api/user/complete-profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Error completing profile:', error);
      throw error;
    }
  }
}

export const userProfileService = new UserProfileService();
