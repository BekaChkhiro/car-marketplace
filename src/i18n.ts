import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
// English translations
import enProfile from './locales/en/profile.json';
import enCarDetails from './locales/en/carDetails.json';
import enTransaction from './locales/en/transaction.json';
import enHome from './locales/en/home.json';
import enCar from './locales/en/car.json';
import enFilter from './locales/en/filter.json';
import enHeader from './locales/en/header.json';
import enAdmin from './locales/en/admin.json';
import enCarListing from './locales/en/carListing.json';

// Georgian translations
import kaProfile from './locales/ka/profile.json';
import kaCarDetails from './locales/ka/carDetails.json';
import kaTransaction from './locales/ka/transaction.json';
import kaHome from './locales/ka/home.json';
import kaCar from './locales/ka/car.json';
import kaFilter from './locales/ka/filter.json';
import kaHeader from './locales/ka/header.json';
import kaAdmin from './locales/ka/admin.json';
import kaCarListing from './locales/ka/carListing.json';

// Russian translations
import ruProfile from './locales/ru/profile.json';
import ruCarDetails from './locales/ru/carDetails.json';
import ruTransaction from './locales/ru/transaction.json';
import ruHome from './locales/ru/home.json';
import ruCar from './locales/ru/car.json';
import ruFilter from './locales/ru/filter.json';
import ruHeader from './locales/ru/header.json';
import ruAdmin from './locales/ru/admin.json';
import ruCarListing from './locales/ru/carListing.json';

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
  profile: 'profile',
  admin: 'admin'
};

// Translation resources
const resources = {
  en: {
    profile: enProfile,
    carDetails: enCarDetails,
    transaction: enTransaction,
    home: enHome,
    car: enCar,
    filter: enFilter,
    header: enHeader,
    admin: enAdmin,
    carListing: enCarListing,
    // Other namespaces will be added here as needed
  },
  ka: {
    profile: kaProfile,
    carDetails: kaCarDetails,
    transaction: kaTransaction,
    home: kaHome,
    car: kaCar,
    filter: kaFilter,
    header: kaHeader,
    admin: kaAdmin,
    carListing: kaCarListing,
    // Other namespaces will be added here as needed
  },
  ru: {
    profile: ruProfile,
    carDetails: ruCarDetails,
    transaction: ruTransaction,
    home: ruHome,
    car: ruCar,
    filter: ruFilter,
    header: ruHeader,
    admin: ruAdmin,
    carListing: ruCarListing,
    // Other namespaces will be added here as needed
  }
};

// Helper function to change language with URL redirection
export const changeLanguage = (lng: string) => {
  localStorage.setItem('i18nextLng', lng);
  
  // Get current path without language prefix
  const currentPath = window.location.pathname;
  const pathSegments = currentPath.split('/');
  
  // Check if the first segment is a language code
  const knownLanguages = ['ka', 'en', 'ru'];
  let newPath;
  
  if (pathSegments.length > 1 && knownLanguages.includes(pathSegments[1])) {
    // Replace language segment
    pathSegments[1] = lng;
    newPath = pathSegments.join('/');
  } else {
    // Add language segment
    newPath = `/${lng}${currentPath}`;
  }
  
  // Redirect to the new URL with the selected language
  window.location.href = newPath;
};

// Helper function to get language from URL
export const getLanguageFromUrl = (): string => {
  const pathname = window.location.pathname;
  const pathSegments = pathname.split('/');
  const knownLanguages = ['ka', 'en', 'ru'];
  
  // Check if the first segment after the root is a language code
  if (pathSegments.length > 1 && knownLanguages.includes(pathSegments[1])) {
    return pathSegments[1];
  }
  
  // Default to stored language or 'ka'
  return localStorage.getItem('i18nextLng') || 'ka';
};

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources,
    defaultNS: 'common',
    fallbackNS: 'common',
    lng: typeof window !== 'undefined' ? getLanguageFromUrl() : (localStorage.getItem('i18nextLng') || 'ka'),
    fallbackLng: 'en',
    ns: Object.values(namespaces), // Explicitly include all namespaces
    interpolation: {
      escapeValue: false // React already safes from XSS
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
