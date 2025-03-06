interface RouteConfig {
  path: string;
  requiresAuth: boolean;
}

export const routeConfigs: { [key: string]: RouteConfig } = {
  home: {
    path: '/',
    requiresAuth: false
  },
  carListing: {
    path: '/cars',
    requiresAuth: false
  },
  carDetails: {
    path: '/cars/:id',
    requiresAuth: false
  },
  profile: {
    path: '/profile',
    requiresAuth: true
  },
  addCar: {
    path: '/cars/add',
    requiresAuth: true
  },
  editCar: {
    path: '/cars/edit/:id',
    requiresAuth: true
  },
  wishlist: {
    path: '/wishlist',
    requiresAuth: true
  }
};

// Helper function to get the configured path for a route
export const getRoutePath = (routeName: keyof typeof routeConfigs): string => {
  return routeConfigs[routeName].path;
};

// Helper function to check if a route requires authentication
export const requiresAuth = (routeName: keyof typeof routeConfigs): boolean => {
  return routeConfigs[routeName].requiresAuth;
};