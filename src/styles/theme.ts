export const theme = {
    colors: {
      primary: '#4CAF50',
      secondary: '#757575',
      background: '#FFFFFF',
      text: '#333333',
      lightGray: '#F5F5F5',
      darkGray: '#424242',
      success: '#4CAF50',
      error: '#F44336',
      warning: '#FFC107',
      info: '#2196F3'
    },
    fontSizes: {
      small: '0.875rem',
      medium: '1rem',
      large: '1.125rem',
      xlarge: '1.25rem',
      xxlarge: '1.5rem'
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      xxl: '3rem'
    },
    breakpoints: {
      mobile: '320px',
      tablet: '768px',
      desktop: '1024px',
      largeDesktop: '1440px'
    },
    borderRadius: {
      small: '4px',
      medium: '8px',
      large: '12px',
      round: '50%'
    },
    shadows: {
      small: '0 1px 3px rgba(0,0,0,0.12)',
      medium: '0 4px 6px rgba(0,0,0,0.1)',
      large: '0 10px 20px rgba(0,0,0,0.15)'
    }
  } as const;
  
  export type Theme = typeof theme;