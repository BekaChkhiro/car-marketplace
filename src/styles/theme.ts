export const theme = {
  colors: {
    primary: '#2563EB', // Modern blue
    secondary: '#64748B', // Slate gray
    background: '#FFFFFF',
    text: '#1E293B', // Darker text for better readability
    lightGray: '#F8FAFC', // Lighter background
    darkGray: '#334155', // Darker gray for contrast
    success: '#10B981', // Modern green
    error: '#EF4444', // Modern red
    warning: '#F59E0B', // Modern amber
    info: '#3B82F6', // Modern blue
    accent: '#8B5CF6', // Purple accent
    border: '#E2E8F0', // Subtle border color
    cardBg: '#FFFFFF',
    gradient: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)'
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
  borderRadius: {
    small: '0.375rem',
    medium: '0.5rem',
    large: '0.75rem',
    xl: '1rem',
    round: '50%'
  },
  shadows: {
    small: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
    medium: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
    large: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
    xl: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'
  },
  typography: {
    fontFamily: {
      primary: '"Inter", system-ui, -apple-system, sans-serif',
      heading: '"Inter", system-ui, -apple-system, sans-serif'
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
  }
} as const;

export type Theme = typeof theme;