# Big Way Frontend Technical Documentation

## Table of Contents
1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Core Features](#core-features)
5. [Components](#components)
6. [Pages](#pages)
7. [State Management](#state-management)
8. [API Integration](#api-integration)
9. [Styling](#styling)
10. [Authentication](#authentication)
11. [Internationalization](#internationalization)
12. [Development Guidelines](#development-guidelines)

## Overview

Big Way is a modern car marketplace built with React and TypeScript. The application provides a rich user interface for browsing, searching, and managing car listings with features like wishlists, user profiles, and an admin dashboard.

## Tech Stack

- **Core**: React 18+ with TypeScript
- **Routing**: React Router v6
- **Styling**: TailwindCSS with custom theming
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **UI Components**: Custom components with Lucide icons
- **State Management**: React Context API
- **Build Tool**: Create React App

## Project Structure

```
src/
├── api/          # API integration layer
├── components/   # Reusable UI components
├── context/      # Global state management
├── pages/        # Route components
├── styles/       # Global styles and theme
├── types/        # TypeScript type definitions
└── utils/        # Utility functions
```

### Key Directories

- **api/**: Contains API service definitions and type interfaces
- **components/**: Houses all reusable components
- **context/**: Global state management using Context API
- **pages/**: Main route components and page-specific components
- **styles/**: Global styles, theme configuration
- **utils/**: Helper functions and utilities

## Core Features

### Car Listing Management
- Browse cars with advanced filtering
- Detailed car view with image gallery
- Add/Edit/Delete car listings
- Multi-language descriptions (KA, EN, RU)

### User Features
- Authentication (Email, Google, Facebook)
- User profile management
- Wishlist functionality
- Personal car listings management

### Admin Dashboard
- User management
- Car listing management
- System settings
- Analytics overview

## Components

### Layout Components
- **Header**: Navigation, auth controls, language selector
- **Footer**: Site information, quick links
- **AdminLayout**: Admin panel layout with sidebar

### UI Components
- **CarCard**: Reusable car listing card
- **ImageUpload**: Image upload with preview
- **CustomSelect**: Styled select dropdown
- **Button**: Customizable button component
- **Loading**: Loading indicators
- **Toast**: Notification system

### Form Components
- Input fields with validation
- Select dropdowns
- File upload handlers
- Form validation

## Pages

### Public Pages
- **Home**: Featured listings, hero section
- **CarListing**: Car browse with filters
- **CarDetails**: Detailed car information

### Auth Pages
- **Login**: User authentication
- **Register**: New user registration
- **ForgotPassword**: Password recovery

### User Pages
- **Profile**: User information
- **AddCar**: Car listing creation
- **EditCar**: Car listing modification

### Admin Pages
- **Dashboard**: Overview statistics
- **Users**: User management
- **Cars**: Car listing management
- **Settings**: System configuration

## State Management

### Context Providers
- **AuthContext**: User authentication state
- **ToastContext**: Global notifications
- **CurrencyContext**: Currency preference
- **LoadingContext**: Global loading states

### Local State
- Component-level state using useState
- Form state management
- UI state management

## API Integration

### Service Structure
```typescript
api/
├── services/
│   ├── authService.ts
│   ├── carService.ts
│   └── socialAuthService.ts
├── types/
│   ├── auth.types.ts
│   └── car.types.ts
└── config/
    └── axios.ts
```

### API Features
- Axios instance configuration
- Request/response interceptors
- Error handling
- Token management

## Styling

### TailwindCSS Configuration
- Custom color palette
- Typography scale
- Spacing system
- Component variants

### Theme Structure
```javascript
theme: {
  colors: {
    primary: '#009C6D',
    secondary: '#00B67F',
    // ...other colors
  },
  // ...other theme configurations
}
```

### Design System
- Consistent spacing
- Color system
- Typography scale
- Component-specific styling

## Authentication

### Authentication Methods
- Email/Password
- Google OAuth
- Facebook OAuth

### Security Features
- JWT token handling
- Refresh token rotation
- Protected routes
- Role-based access

## Internationalization

### Supported Languages
- Georgian (ქართული)
- English
- Russian (Русский)

### Translation Structure
- Component-level translations
- Language switcher
- RTL support readiness

## Development Guidelines

### Code Style
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Component organization

### Best Practices
- Component composition
- State management patterns
- Performance optimization
- Error handling

### Component Structure
```typescript
// Component template
interface ComponentProps {
  // Props interface
}

const Component: React.FC<ComponentProps> = ({ props }) => {
  // Component logic
  return (
    // JSX
  );
};
```

### Testing
- Unit testing with Jest
- Component testing with Testing Library
- Integration testing
- E2E testing setup

### Performance Considerations
- Code splitting
- Lazy loading
- Image optimization
- Caching strategies

### Deployment
- Build optimization
- Environment configuration
- CI/CD setup
- Monitoring and analytics

---

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Create pull request
5. Code review process

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Detailed Technical Implementation

### API Layer Implementation

#### Axios Configuration (`api/config/axios.ts`)
```typescript
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptors for token management and error handling
axiosInstance.interceptors.request.use(
  (config) => {
    const token = TokenStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh or logout
    }
    return Promise.reject(error);
  }
);
```

#### Authentication Service (`api/services/authService.ts`)
```typescript
interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

const authService = {
  login: (credentials: LoginCredentials) => 
    axiosInstance.post<AuthResponse>('/auth/login', credentials),
  register: (userData: RegisterData) => 
    axiosInstance.post<AuthResponse>('/auth/register', userData),
  // ... other auth methods
};
```

#### Car Service (`api/services/carService.ts`)
```typescript
interface CarFilters {
  make?: string;
  model?: string;
  yearFrom?: number;
  yearTo?: number;
  priceFrom?: number;
  priceTo?: number;
  // ... other filter properties
}

const carService = {
  getCars: (filters: CarFilters) => 
    axiosInstance.get<Car[]>('/cars', { params: filters }),
  getCarById: (id: string) => 
    axiosInstance.get<Car>(`/cars/${id}`),
  createCar: (carData: CarCreateInput) => 
    axiosInstance.post<Car>('/cars', carData),
  // ... other car-related methods
};
```

### Component Architecture

#### Layout Components

##### Header Component (`components/layout/Header/index.tsx`)
```typescript
interface HeaderProps {
  transparent?: boolean;
}

const Header: React.FC<HeaderProps> = ({ transparent }) => {
  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  
  // Navigation items structure
  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Cars', path: '/cars' },
    // ... other nav items
  ];

  return (
    <header className={`${transparent ? 'bg-transparent' : 'bg-white'}`}>
      {/* Header implementation */}
    </header>
  );
};
```

##### CarCard Component (`components/CarCard.tsx`)
```typescript
interface CarCardProps {
  car: Car;
  featured?: boolean;
  onClick?: (id: string) => void;
}

const CarCard: React.FC<CarCardProps> = ({ car, featured, onClick }) => {
  const { formatPrice } = usePrice();
  
  return (
    <div className="car-card">
      {/* Car information display */}
    </div>
  );
};
```

### Context Management

#### Auth Context Implementation (`context/AuthContext.tsx`)
```typescript
interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    setUser(response.data.user);
    TokenStorage.setToken(response.data.token);
  };

  // ... other auth methods
};
```

### Form Handling and Validation

#### Car Creation Form Example
```typescript
interface CarFormData {
  make: string;
  model: string;
  year: number;
  price: number;
  description: string;
  features: string[];
  images: File[];
}

const validationSchema = yup.object().shape({
  make: yup.string().required('Make is required'),
  model: yup.string().required('Model is required'),
  year: yup.number()
    .min(1900)
    .max(new Date().getFullYear() + 1)
    .required('Year is required'),
  price: yup.number().positive().required('Price is required'),
  // ... other validations
});
```

### Styling System

#### Tailwind Custom Configuration (`tailwind.config.js`)
```javascript
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4FD1C5',
          DEFAULT: '#009C6D',
          dark: '#007F59',
        },
        secondary: {
          light: '#38B2AC',
          DEFAULT: '#00B67F',
          dark: '#009669',
        },
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '2rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
```

### Type Definitions

#### Car Types (`types/car.ts`)
```typescript
interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: FuelType;
  transmission: TransmissionType;
  features: CarFeature[];
  images: CarImage[];
  seller: User;
  status: CarStatus;
  createdAt: string;
  updatedAt: string;
}

enum FuelType {
  PETROL = 'PETROL',
  DIESEL = 'DIESEL',
  HYBRID = 'HYBRID',
  ELECTRIC = 'ELECTRIC',
}

enum TransmissionType {
  MANUAL = 'MANUAL',
  AUTOMATIC = 'AUTOMATIC',
  SEMI_AUTOMATIC = 'SEMI_AUTOMATIC',
}

interface CarImage {
  id: string;
  url: string;
  isFeatured: boolean;
  order: number;
}
```

### Route Management

#### Route Configuration (`config/routes.ts`)
```typescript
interface RouteConfig {
  path: string;
  component: React.ComponentType;
  isPrivate?: boolean;
  roles?: UserRole[];
}

const routes: RouteConfig[] = [
  {
    path: '/',
    component: HomePage,
    isPrivate: false,
  },
  {
    path: '/cars',
    component: CarListingPage,
    isPrivate: false,
  },
  {
    path: '/admin',
    component: AdminDashboard,
    isPrivate: true,
    roles: ['ADMIN'],
  },
  // ... other routes
];
```

### Image Handling

#### Image Upload Component (`components/ImageUpload.tsx`)
```typescript
interface ImageUploadProps {
  onImageUpload: (files: File[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  maxFileSize?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  maxFiles = 10,
  acceptedTypes = ['image/jpeg', 'image/png'],
  maxFileSize = 10 * 1024 * 1024, // 10MB
}) => {
  // Image upload implementation with preview
};
```

### Utility Functions

#### Price Formatting (`utils/priceFormatter.ts`)
```typescript
interface PriceFormatOptions {
  currency?: string;
  locale?: string;
  exchangeRate?: number;
}

const formatPrice = (
  amount: number,
  options: PriceFormatOptions = {}
) => {
  const {
    currency = 'GEL',
    locale = 'ka-GE',
    exchangeRate = 1
  } = options;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount * exchangeRate);
};
```

### Testing Configuration

#### Jest Configuration
```javascript
module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  setupFilesAfterEnv: [
    '@testing-library/jest-dom/extend-expect',
  ],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testEnvironment: 'jsdom',
};
```

#### Example Test Case
```typescript
describe('CarCard Component', () => {
  const mockCar = {
    id: '1',
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    price: 25000,
    // ... other properties
  };

  it('renders car information correctly', () => {
    render(<CarCard car={mockCar} />);
    
    expect(screen.getByText('Toyota Camry')).toBeInTheDocument();
    expect(screen.getByText('2022')).toBeInTheDocument();
    expect(screen.getByText('25,000 ₾')).toBeInTheDocument();
  });
});
```

### Error Handling

#### Global Error Boundary
```typescript
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service
    console.error('Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}
```

### Performance Optimization

#### Code Splitting Example
```typescript
// Lazy loading routes
const CarDetails = React.lazy(() => import('./pages/CarDetails'));
const AdminDashboard = React.lazy(() => import('./pages/Admin/Dashboard'));

// Usage in routes
<Suspense fallback={<LoadingSpinner />}>
  <Route path="/cars/:id" component={CarDetails} />
  <Route path="/admin" component={AdminDashboard} />
</Suspense>
```

### Security Measures

#### CSRF Protection
```typescript
// Axios configuration for CSRF
axiosInstance.defaults.xsrfCookieName = 'XSRF-TOKEN';
axiosInstance.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';
axiosInstance.defaults.withCredentials = true;
```

### Build and Deployment

#### Production Build Optimization
```javascript
// craco.config.js
module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
        require('cssnano'),
      ],
    },
  },
  webpack: {
    configure: (webpackConfig) => {
      // Split chunks optimization
      webpackConfig.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        // ... other optimizations
      };
      return webpackConfig;
    },
  },
};
```

## Development Workflow

### Git Workflow
1. Feature branches follow the pattern: `feature/description`
2. Hotfix branches: `hotfix/description`
3. Release branches: `release/v1.x.x`

### Code Review Guidelines
1. Performance impact assessment
2. Security vulnerability check
3. Code style compliance
4. Test coverage requirements
5. Documentation updates

### Monitoring and Analytics
- Error tracking with Sentry
- Performance monitoring with Google Analytics
- User behavior tracking
- A/B testing infrastructure

## Deployment Pipeline

### CI/CD Configuration
```yaml
# .github/workflows/main.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
      # ... deployment steps
```

This detailed documentation provides a comprehensive overview of the technical implementation details of the Big Way frontend application. Each section includes actual code examples and explanations of the patterns and practices used throughout the codebase.