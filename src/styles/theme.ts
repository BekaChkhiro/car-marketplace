export const theme = {
  colors: {
    primary: '#4CAF50',
    secondary: '#388E3C',
    background: '#F5F5F5',
    text: '#333333',
    textLight: '#FFFFFF',
    grayDark: '#444444',
    grayLight: '#F0F0F0',
    greenLight: '#E8F5E9',
    greenLighter: '#C8E6C9',
    success: '#45A049',
    error: '#F44336',
    warning: '#FFEB3B',
    info: '#2E7D32',
    accent: '#C8E6C9',
    border: '#E8F5E9',
    cardBg: '#FFFFFF'
  },
  fontSizes: {
    xs: '0.75rem',
    small: '0.875rem',
    medium: '1rem',
    large: '1.25rem',
    xlarge: '1.5rem',
    xxlarge: '2rem',
    hero: '3rem'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
    section: '6rem'
  },
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    largeDesktop: '1440px'
  },
  typography: {
    fontFamily: {
      primary: '"Helvetica", "Helvetica Neue", Arial, sans-serif',
      heading: '"Helvetica", "Helvetica Neue", Arial, sans-serif'
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75'
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    }
  },
  transition: {
    default: 'all 0.3s ease',
    fast: 'all 0.15s ease',
    slow: 'all 0.45s ease'
  },
  borderRadius: {
    small: '0.375rem',
    medium: '0.5rem',
    large: '0.75rem',
    xl: '1rem'
  },
  shadows: {
    small: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
    medium: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
    large: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
    xl: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'
  }
} as const;

export type Theme = typeof theme;