export const routes = {
  home: '/',
  carListing: '/cars',
  carDetails: '/cars/:id',
  profile: '/profile',
  admin: '/admin',
  adminDashboard: '/admin/dashboard',
  adminUsers: '/admin/users',
  adminCars: '/admin/cars',
  adminSettings: '/admin/settings',
  addCar: '/cars/add',
  editCar: '/cars/edit/:id',
  wishlist: '/wishlist',
  users: '/admin/users',
  cars: '/admin/cars',
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