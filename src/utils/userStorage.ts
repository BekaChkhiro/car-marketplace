interface UserData {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

const USER_DATA_KEY = 'user_additional_data';

export const storeUserData = (data: UserData): void => {
  try {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};

export const getUserData = (): UserData | null => {
  try {
    const data = localStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return null;
  }
};

export const clearUserData = (): void => {
  try {
    localStorage.removeItem(USER_DATA_KEY);
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
};