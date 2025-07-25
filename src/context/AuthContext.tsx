import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../api/services/authService';
import { User } from '../api/types/auth.types';
import { hasStoredToken, getAccessToken, isTokenExpired, getRefreshToken } from '../api/utils/tokenStorage';
import { useToast } from './ToastContext';
import { useLoading } from './LoadingContext';
import { getStoredPreferences } from '../utils/userPreferences';
import { storeUserData, clearUserData, getCachedUserData } from '../utils/userStorage';

// Auth context state interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (username: string, email: string, password: string, additionalData: { 
    first_name: string;
    last_name: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    phone: string;
    isDealer?: boolean;
    dealerData?: {
      company_name: string;
      established_year?: number;
      website_url?: string;
      social_media_url?: string;
      address?: string;
      images?: File[];
      featuredImageIndex?: number;
    };
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { username?: string; email?: string; phone?: string; first_name?: string; last_name?: string; age?: number; gender?: 'male' | 'female' | 'other' }) => Promise<User>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  refreshUserData: () => Promise<any>;
}

// Create context with default values
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { showLoading, hideLoading } = useLoading();
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [serverErrorCount, setServerErrorCount] = useState(0);
  const MAX_SERVER_RETRIES = 3;
  const RETRY_DELAY = 2000; // 2 seconds

  // Listen for auth:required events
  useEffect(() => {
    const handleAuthRequired = (event: CustomEvent<{ message: string }>) => {
      clearAuthState();
      showToast(event.detail.message, 'error');
    };

    window.addEventListener('auth:required' as any, handleAuthRequired);
    return () => {
      window.removeEventListener('auth:required' as any, handleAuthRequired);
    };
  }, []);

  const clearAuthState = () => {
    setUser(null);
    setIsAuthenticated(false);
    clearUserData();
    navigate('/', { replace: true });
  };

  const handleServerError = async (error: any, retryFn: () => Promise<any>) => {
    if (error?.response?.status === 500 && serverErrorCount < MAX_SERVER_RETRIES) {
      setServerErrorCount(prev => prev + 1);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return retryFn();
    }
    throw error;
  };

  const initializeWithCachedData = () => {
    const cachedUser = getCachedUserData();
    if (cachedUser) {
      setUser(cachedUser);
      setIsAuthenticated(true);
      showToast('Using cached profile data. Some features may be limited.', 'warning');
      return true;
    }
    return false;
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      if (!hasStoredToken()) {
        setIsInitializing(false);
        return;
      }

      try {
        showLoading();
        const accessToken = getAccessToken();
        const refreshToken = getRefreshToken();

        // Check if we need to refresh the token
        if (accessToken && isTokenExpired(accessToken) && refreshToken) {
          try {
            await authService.refreshToken();
          } catch (refreshError: any) {
            // If token refresh fails with 500, try using cached data
            if (refreshError?.response?.status === 500 && initializeWithCachedData()) {
              hideLoading();
              setIsInitializing(false);
              return;
            }
            throw refreshError;
          }
        }

        try {
          const userData = await authService.getProfile();
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
            storeUserData(userData);
            setServerErrorCount(0); // Reset error count on success
          }
        } catch (profileError: any) {
          // If profile fetch fails with 500, try using cached data
          if (profileError?.response?.status === 500) {
            if (initializeWithCachedData()) {
              return;
            }
            // If no cached data, retry with exponential backoff
            return handleServerError(profileError, initializeAuth);
          }
          throw profileError;
        }
      } catch (error: any) {
        console.error('Error initializing auth:', error);
        // Only clear auth if it's not a server error or we've exceeded retries
        if (error?.response?.status !== 500 || serverErrorCount >= MAX_SERVER_RETRIES) {
          clearAuthState();
        }
      } finally {
        hideLoading();
        setIsInitializing(false);
      }
    };

    initializeAuth();
    return () => {
      hideLoading();
    };
  }, []);

  // Login handler
  const login = async (email: string, password: string, rememberMe?: boolean) => {
    showLoading();
    try {
      const response = await authService.login({ 
        email, 
        password,
        rememberMe: rememberMe ?? getStoredPreferences().rememberMe
      });
      setUser(response.user);
      setIsAuthenticated(true);
      storeUserData(response.user);
      showToast('წარმატებით შეხვედით სისტემაში', 'success');
    } catch (err: any) {
      const message = err.message || 'შესვლა ვერ მოხერხდა';
      showToast(message, 'error');
      throw err;
    } finally {
      hideLoading();
    }
  };

  // Register handler
  const register = async (
    username: string, 
    email: string, 
    password: string,
    additionalData: {
      first_name: string;
      last_name: string;
      age: number;
      gender: 'male' | 'female' | 'other';
      phone: string;
      isDealer?: boolean;
      dealerData?: {
        company_name: string;
        established_year?: number;
        website_url?: string;
        social_media_url?: string;
        address?: string;
        images?: File[];
        featuredImageIndex?: number;
      };
    }
  ) => {
    showLoading();
    try {
      // For now, register without image first, then upload separately
      const registrationData: any = {
        username,
        email,
        password,
        ...additionalData
      };

      // If dealer, set isDealer flag for backend
      if (additionalData.isDealer) {
        registrationData.isDealer = true;
        
        // Prepare dealer data
        if (additionalData.dealerData) {
          registrationData.dealerData = {
            company_name: additionalData.dealerData.company_name,
            established_year: additionalData.dealerData.established_year,
            website_url: additionalData.dealerData.website_url,
            social_media_url: additionalData.dealerData.social_media_url,
            address: additionalData.dealerData.address
            // logo_url will be set after image upload
          };
        }
      }

      // Register the user/dealer with logo file if available
      let response;
      if (additionalData.isDealer && additionalData.dealerData?.images && additionalData.dealerData.images.length > 0) {
        console.log('🔄 Registering dealer with logo file');
        const logoFile = additionalData.dealerData.images[0];
        response = await authService.registerWithFile(registrationData, logoFile);
        console.log('✅ Registration with logo completed:', response);
      } else {
        console.log('🔄 Registering user without logo');
        response = await authService.register(registrationData);
      }
      
      setUser(response.user);
      setIsAuthenticated(true);
      storeUserData(response.user);
      
      // For dealer registrations, show success message
      if (additionalData.isDealer && additionalData.dealerData?.images && additionalData.dealerData.images.length > 0) {
        showToast('დილერის რეგისტრაცია და ლოგოს ატვირთვა წარმატებით დასრულდა!', 'success');
      } else if (additionalData.isDealer) {
        showToast('დილერის რეგისტრაცია წარმატებით დასრულდა!', 'success');
      } else {
        showToast('რეგისტრაცია წარმატებით დასრულდა!', 'success');
      }
      
    } catch (err: any) {
      const message = err.message || 'რეგისტრაცია ვერ მოხერხდა';
      showToast(message, 'error');
      throw err;
    } finally {
      hideLoading();
    }
  };

  // Logout handler
  const logout = () => {
    authService.logout();
    clearUserData(); // Clear additional user data
    setUser(null);
    setIsAuthenticated(false);
    showToast('წარმატებით გამოხვედით სისტემიდან', 'info');
    navigate('/', { replace: true });
  };

  // Update profile handler
  const updateProfile = async (data: { username?: string; email?: string; phone?: string; first_name?: string; last_name?: string; age?: number; gender?: 'male' | 'female' | 'other' }) => {
    showLoading();
    try {
      console.log('AuthContext: Updating profile with data:', data);
      const updatedUser = await authService.updateProfile(data);
      console.log('AuthContext: Received updated user from service:', updatedUser);
      
      // Make sure we have a valid user object
      if (updatedUser) {
        // Ensure gender is properly set in the user object
        if (data.gender && (!updatedUser.gender || updatedUser.gender !== data.gender)) {
          updatedUser.gender = data.gender;
        }
        
        setUser(updatedUser);
        storeUserData(updatedUser); // Store updated user data in cache
      }
      
      showToast('პროფილი წარმატებით განახლდა', 'success');
      return updatedUser; // Return the updated user data
    } catch (err: any) {
      const message = err.message || 'პროფილის განახლება ვერ მოხერხდა';
      showToast(message, 'error');
      throw err;
    } finally {
      hideLoading();
    }
  };

  // Change password handler
  const updatePassword = async (currentPassword: string, newPassword: string) => {
    showLoading();
    try {
      await authService.changePassword(currentPassword, newPassword);
      showToast('პაროლი წარმატებით შეიცვალა', 'success');
    } catch (err: any) {
      const message = err.message || 'პაროლის განახლება ვერ მოხერხდა';
      showToast(message, 'error');
      throw err;
    } finally {
      hideLoading();
    }
  };

  // Forgot password handler
  const forgotPassword = async (email: string) => {
    showLoading();
    try {
      await authService.forgotPassword(email);
    } catch (err: any) {
      const message = err.message || 'პაროლის აღდგენა ვერ მოხერხდა';
      showToast(message, 'error');
      throw err;
    } finally {
      hideLoading();
    }
  };

  // Reset password handler
  const resetPassword = async (token: string, newPassword: string) => {
    try {
      await authService.resetPassword(token, newPassword);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'პაროლის შეცვლა ვერ მოხერხდა');
    }
  };

  // Refresh user data handler
  const refreshUserData = async () => {
    showLoading();
    try {
      const userData = await authService.getProfile();
      if (userData) {
        setUser(userData);
        storeUserData(userData);
        return userData;
      }
    } catch (err: any) {
      const message = err.message || 'პროფილის განახლება ვერ მოხერხდა';
      showToast(message, 'error');
      throw err;
    } finally {
      hideLoading();
    }
  };

  // Context value
  const value = {
    user,
    isAuthenticated,
    isLoading: isInitializing,
    login,
    register,
    logout,
    updateProfile,
    updatePassword,
    forgotPassword,
    resetPassword,
    refreshUserData,
  };

  if (isInitializing) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export default AuthContext;