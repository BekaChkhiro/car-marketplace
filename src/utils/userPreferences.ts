interface UserPreferences {
  language: string;
  currency: string;
  theme?: 'light' | 'dark';
  rememberMe?: boolean;
}

const PREFERENCES_KEY = 'user_preferences';

export const getStoredPreferences = (): UserPreferences => {
  try {
    const stored = localStorage.getItem(PREFERENCES_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading preferences:', error);
  }
  
  // Default preferences
  return {
    language: 'ka',
    currency: 'GEL',
    theme: 'light',
    rememberMe: false
  };
};

export const storePreferences = (preferences: Partial<UserPreferences>) => {
  try {
    const current = getStoredPreferences();
    const updated = { ...current, ...preferences };
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error storing preferences:', error);
    return null;
  }
};

export const clearPreferences = () => {
  try {
    localStorage.removeItem(PREFERENCES_KEY);
  } catch (error) {
    console.error('Error clearing preferences:', error);
  }
};