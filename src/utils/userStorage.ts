import { User } from '../api/types/auth.types';

const USER_DATA_KEY = 'user_data';
const USER_DATA_TIMESTAMP_KEY = 'user_data_timestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const storeUserData = (user: User): void => {
  try {
    // Make sure gender is explicitly set to avoid undefined values
    const userToStore = {
      ...user,
      gender: user.gender || 'male' // Default to male if gender is undefined
    };
    
    console.log('Storing user data with gender:', userToStore.gender);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userToStore));
    localStorage.setItem(USER_DATA_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};

export const getCachedUserData = (): User | null => {
  try {
    const userData = localStorage.getItem(USER_DATA_KEY);
    const timestamp = localStorage.getItem(USER_DATA_TIMESTAMP_KEY);
    
    if (!userData || !timestamp) {
      return null;
    }

    // Check if cache is still valid
    const cacheAge = Date.now() - parseInt(timestamp, 10);
    if (cacheAge > CACHE_DURATION) {
      clearUserData();
      return null;
    }

    const parsedUser = JSON.parse(userData);
    
    // Ensure gender is properly set
    if (!parsedUser.gender) {
      console.warn('Retrieved user data with undefined gender, defaulting to male');
      parsedUser.gender = 'male';
    }
    
    console.log('Retrieved cached user data with gender:', parsedUser.gender);
    return parsedUser;
  } catch (error) {
    console.error('Error retrieving cached user data:', error);
    return null;
  }
};

export const clearUserData = (): void => {
  try {
    localStorage.removeItem(USER_DATA_KEY);
    localStorage.removeItem(USER_DATA_TIMESTAMP_KEY);
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
};

export const isUserDataCached = (): boolean => {
  return !!getCachedUserData();
};