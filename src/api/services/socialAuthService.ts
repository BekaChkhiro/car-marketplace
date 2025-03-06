import api from '../config/axios';
import { AuthResponse } from '../types/auth.types';
import { setStoredToken } from '../utils/tokenStorage';

class SocialAuthService {
  async googleLogin(accessToken: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/google', { 
        access_token: accessToken 
      });
      
      if (response.data.tokens) {
        const { accessToken, refreshToken } = response.data.tokens;
        setStoredToken(accessToken, refreshToken);
      } else if (response.data.token) {
        setStoredToken(response.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Google login failed');
    }
  }

  async facebookLogin(accessToken: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/facebook', { 
        access_token: accessToken 
      });
      
      if (response.data.tokens) {
        const { accessToken, refreshToken } = response.data.tokens;
        setStoredToken(accessToken, refreshToken);
      } else if (response.data.token) {
        setStoredToken(response.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Facebook login failed');
    }
  }

  // Method to link social account to existing account
  async linkSocialAccount(provider: 'google' | 'facebook', accessToken: string): Promise<void> {
    try {
      await api.post(`/auth/link/${provider}`, { access_token: accessToken });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || `Failed to link ${provider} account`);
    }
  }

  // Method to unlink social account
  async unlinkSocialAccount(provider: 'google' | 'facebook'): Promise<void> {
    try {
      await api.post(`/auth/unlink/${provider}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || `Failed to unlink ${provider} account`);
    }
  }
}

export default new SocialAuthService();