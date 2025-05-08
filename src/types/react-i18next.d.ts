import 'react-i18next';

declare module 'react-i18next' {
  export function useTranslation(ns?: string | string[]): {
    t: (key: string, options?: any) => string;
    i18n: {
      changeLanguage: (lng: string) => Promise<any>;
      language: string;
    };
  };
}
