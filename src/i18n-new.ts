import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import namespaces
import en_profile from './locales/en/profile.json';
import ka_profile from './locales/ka/profile.json';
import ru_profile from './locales/ru/profile.json';

// Define namespaces for better organization
export const namespaces = {
  common: 'common',
  balance: 'balance',
  transaction: 'transaction',
  vip: 'vip',
  error: 'error',
  filter: 'filter',
  home: 'home',
  header: 'header',
  car: 'car',
  carListing: 'carListing',
  carDetails: 'carDetails',
  profile: 'profile'
};

// Translation resources
const resources = {
  en: {
    profile: en_profile,
    // Other namespaces will be added here
  },
  ka: {
    profile: ka_profile,
    // Other namespaces will be added here
  },
  ru: {
    profile: ru_profile,
    // Other namespaces will be added here
  }
};

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ka',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    debug: process.env.NODE_ENV === 'development'
  });

export default i18n;
