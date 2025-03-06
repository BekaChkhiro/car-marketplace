import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../api/services/authService';
import { User } from '../api/types/auth.types';
import { hasStoredToken, getAccessToken } from '../api/utils/tokenStorage';
import { useToast } from './ToastContext';
import { useLoading } from './LoadingContext';
import { getStoredPreferences } from '../utils/userPreferences';
import { storeUserData, clearUserData } from '../utils/userStorage';

// Auth context state interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (username: string, email: string, password: string, additionalData?: { 
    firstName?: string;
    lastName?: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { username?: string; email?: string; phone?: string }) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthState>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateProfile: async () => {},
  updatePassword: async () => {},
  forgotPassword: async () => {},
});

// Auth provider props interface
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { showLoading, hideLoading } = useLoading();
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const initializeAuth = async () => {
      if (!hasStoredToken()) {
        setIsInitializing(false);
        return;
      }

      try {
        showLoading();
        const userData = await authService.getProfile();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear auth state on error
        setUser(null);
        setIsAuthenticated(false);
        logout();
      } finally {
        hideLoading();
        setIsInitializing(false);
      }
    };

    // Initialize auth immediately
    initializeAuth();

    // Cleanup function
    return () => {
      hideLoading(); // Ensure loading is hidden when component unmounts
    };
  }, []); // Only run once on mount

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
    additionalData?: {
      firstName?: string;
      lastName?: string;
      phone?: string;
    }
  ) => {
    showLoading();
    try {
      const response = await authService.register({ username, email, password });
      
      // Store additional user data if provided
      if (additionalData) {
        storeUserData(additionalData);
      }
      
      setUser(response.user);
      setIsAuthenticated(true);
      showToast('რეგისტრაცია წარმატებით დასრულდა', 'success');
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
  const updateProfile = async (data: { username?: string; email?: string; phone?: string }) => {
    showLoading();
    try {
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
      showToast('პროფილი წარმატებით განახლდა', 'success');
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
  };

  if (isInitializing) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);
export default AuthContext;