/**
 * Format a number as currency
 * @param value - Number to format as currency
 * @param currency - Currency code (default: 'GEL')
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number, currency: string = 'GEL'): string => {
  // Format the number with thousand separators
  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);

  // Return with currency symbol/code
  if (currency === 'GEL') {
    return `${formattedNumber} ₾`;
  } else if (currency === 'USD') {
    return `$${formattedNumber}`;
  } else if (currency === 'EUR') {
    return `€${formattedNumber}`;
  } else {
    return `${formattedNumber} ${currency}`;
  }
};

/**
 * Format a date to a human-readable string
 * @param date - Date to format
 * @param format - Format type ('short', 'long', 'relative')
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string, format: 'short' | 'long' | 'relative' = 'short'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'short') {
    return dateObj.toLocaleDateString();
  } else if (format === 'long') {
    return dateObj.toLocaleString();
  } else if (format === 'relative') {
    const now = new Date();
    const diffInMs = now.getTime() - dateObj.getTime();
    const diffInSecs = Math.floor(diffInMs / 1000);
    const diffInMins = Math.floor(diffInSecs / 60);
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSecs < 60) {
      return 'just now';
    } else if (diffInMins < 60) {
      return `${diffInMins} minute${diffInMins === 1 ? '' : 's'} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    } else {
      return dateObj.toLocaleDateString();
    }
  }
  
  return dateObj.toLocaleDateString();
};

/**
 * Format a file size to a human-readable string
 * @param bytes - Number of bytes
 * @returns Formatted file size string (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Math.round(bytes / Math.pow(k, i))} ${sizes[i]}`;
};
