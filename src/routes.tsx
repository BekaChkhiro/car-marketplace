import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CarListing from './pages/CarListing';
import CarDetails from './pages/CarDetails';
import ProfilePage from './pages/Profile';
import AdminLayout from './pages/Admin/components/AdminLayout';
import AdminDashboard from './pages/Admin/Dashboard';
import UsersPage from './pages/Admin/Users';
import CarsPage from './pages/Admin/Cars';
import SettingsPage from './pages/Admin/Settings';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { routeConfigs } from './config/routes';
import { useAuth } from './context/AuthContext';
import ProfileHome from './pages/Profile/pages/ProfileHome';
import Favorites from './pages/Profile/pages/Favorites';
import Notifications from './pages/Profile/pages/Notifications';
import Settings from './pages/Profile/pages/Settings';
import AddCar from './pages/Profile/pages/AddCar';

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  // Redirect authenticated users based on their role
  const getAuthenticatedRedirect = () => {
    if (!isAuthenticated) return '/';
    if (user?.role === 'admin') return '/admin';
    return '/profile';
  };

  return (
    <Routes>
      <Route path={routeConfigs.home.path} element={<Home />} />
      
      {/* Auth Routes */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      
      {/* Public Car Routes */}
      <Route path={routeConfigs.carListing.path} element={<CarListing />} />
      <Route path={routeConfigs.carDetails.path} element={<CarDetails />} />
      
      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="transports" element={<CarsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      
      {/* Protected Profile Routes - Only for non-admin users */}
      <Route 
        path="/profile/*" 
        element={
          <ProtectedRoute requiredRole="user">
            <ProfilePage />
          </ProtectedRoute>
        }
      >
        <Route index element={<ProfileHome />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
        <Route path="add-car" element={<AddCar />} />
      </Route>

      {/* Catch all unmatched routes */}
      <Route path="*" element={<Navigate to={getAuthenticatedRedirect()} replace />} />
    </Routes>
  );
};

export default AppRoutes;