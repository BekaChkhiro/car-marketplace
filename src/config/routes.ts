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
    path: '/transports',
    requiresAuth: false
  },
  carDetails: {
    path: '/transports/:id',
    requiresAuth: false
  },
  profile: {
    path: '/profile',
    requiresAuth: true
  },
  admin: {
    path: '/admin',
    requiresAuth: true
  },
  adminUsers: {
    path: '/admin/users',
    requiresAuth: true
  },
  adminCars: {
    path: '/admin/transports',
    requiresAuth: true
  },
  adminSettings: {
    path: '/admin/settings',
    requiresAuth: true
  },
  addCar: {
    path: '/transports/add',
    requiresAuth: true
  },
  editCar: {
    path: '/transports/edit/:id',
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