import i18n from 'i18next';

/**
 * Get the appropriate locale based on the current language
 * @returns Locale string for date formatting
 */
const getLocaleFromLanguage = (locale?: string): string => {
  if (locale) return locale;
  
  const currentLang = i18n.language || localStorage.getItem('i18nextLng') || 'ka';
  
  switch (currentLang) {
    case 'ka':
      return 'ka-GE';
    case 'ru':
      return 'ru-RU';
    default:
      return 'en-US';
  }
};

/**
 * Format a date string into a localized date format
 * @param dateString - ISO date string
 * @param locale - Locale for formatting (optional, will use current language if not provided)
 * @returns Formatted date string
 */
export const formatDate = (dateString: string, locale?: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    const formattingLocale = getLocaleFromLanguage(locale);
    
    return new Intl.DateTimeFormat(formattingLocale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Format a date string into a relative time format (e.g., "2 days ago")
 * @param dateString - ISO date string
 * @param locale - Locale for formatting (optional, will use current language if not provided)
 * @returns Relative time string
 */
export const formatRelativeTime = (dateString: string, locale?: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const formattingLocale = getLocaleFromLanguage(locale);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    // Less than a minute
    if (diffInSeconds < 60) {
      return 'just now';
    }
    
    // Less than an hour
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    // Less than a day
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    // Less than a month
    if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
    
    // Less than a year
    if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    }
    
    // More than a year
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return dateString;
  }
};

/**
 * Format a date string into a short date format (e.g., "Jan 1, 2023")
 * @param dateString - ISO date string
 * @param locale - Locale for formatting (optional, will use current language if not provided)
 * @returns Short formatted date string
 */
export const formatShortDate = (dateString: string, locale?: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    const formattingLocale = getLocaleFromLanguage(locale);
    
    return new Intl.DateTimeFormat(formattingLocale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Error formatting short date:', error);
    return dateString;
  }
};
