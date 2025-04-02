export const routes = {
  home: '/',
  carListing: '/cars',
  carDetails: '/cars/:id',
  profile: '/profile',
  admin: '/admin',
  adminDashboard: '/admin/dashboard',
  adminUsers: '/admin/users',
  adminCars: '/admin/cars',
  adminEditCar: '/admin/cars/edit/:id',
  adminSettings: '/admin/settings',
  addCar: '/profile/add-car',
  editCar: '/profile/cars/edit/:id',
  wishlist: '/wishlist',
  users: '/admin/users',
  cars: '/profile/cars',
  settings: '/admin/settings',
  profileHome: '/profile',
  favorites: '/profile/favorites',
  notifications: '/profile/notifications',
  profileSettings: '/profile/settings',
  auth: {
    login: '/login',
    register: '/register',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password'
  }
} as const;