import api from '../config/axios';
import { AuthResponse } from '../types/auth.types';
import { setStoredToken } from '../utils/tokenStorage';

class SocialAuthService {
  // Redirect to Google OAuth login page
  initiateGoogleLogin(): string {
    return `${process.env.REACT_APP_API_URL || ''}/api/auth/google`;
  }

  // Handle Google OAuth callback
  async handleGoogleCallback(code: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/api/auth/google/callback', { code });
      
      if (response.data.token && response.data.refreshToken) {
        setStoredToken(response.data.token, response.data.refreshToken);
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Google login failed');
    }
  }

  // Legacy method for compatibility
  async googleLogin(accessToken: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/api/auth/google-token', { 
        access_token: accessToken 
      });
      
      if (response.data.token && response.data.refreshToken) {
        setStoredToken(response.data.token, response.data.refreshToken);
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Google login failed');
    }
  }

  async facebookLogin(accessToken: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/api/auth/facebook', { 
        access_token: accessToken 
      });
      
      if (response.data.token && response.data.refreshToken) {
        setStoredToken(response.data.token, response.data.refreshToken);
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Facebook login failed');
    }
  }

  // Method to link social account to existing account
  async linkSocialAccount(provider: 'google' | 'facebook', accessToken: string): Promise<void> {
    try {
      await api.post(`/api/auth/link/${provider}`, { access_token: accessToken });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || `Failed to link ${provider} account`);
    }
  }

  // Method to unlink social account
  async unlinkSocialAccount(provider: 'google' | 'facebook'): Promise<void> {
    try {
      await api.post(`/api/auth/unlink/${provider}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || `Failed to unlink ${provider} account`);
    }
  }
}

export default new SocialAuthService();