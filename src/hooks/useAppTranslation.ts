import { useTranslation } from 'react-i18next';
import { namespaces } from '../i18n';

/**
 * Custom hook for translations that combines multiple namespaces for convenience
 * @param ns - Additional namespaces to load beyond the default ones
 * @returns The translation function and i18n instance
 */
export const useAppTranslation = (ns: string[] = []) => {
  // Always include common namespace plus any additional ones
  const namespaceArray = [namespaces.common, ...ns];
  
  // Use react-i18next's useTranslation hook with our namespaces
  return useTranslation(namespaceArray);
};

export default useAppTranslation;
