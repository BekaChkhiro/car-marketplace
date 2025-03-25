import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { routes } from './config/routes';
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
import { useAuth } from './context/AuthContext';
import ProfileHome from './pages/Profile/pages/ProfileHome';
import Favorites from './pages/Profile/pages/Favorites';
import Notifications from './pages/Profile/pages/Notifications';
import Settings from './pages/Profile/pages/Settings';
import AddCar from './pages/Profile/pages/AddCar';
import ResetPassword from './pages/Auth/ResetPassword';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={routes.home} element={<Home />} />
      <Route path={routes.carListing} element={<CarListing />} />
      <Route path={routes.carDetails} element={<CarDetails />} />
      <Route path={routes.admin} element={<AdminLayout />} />
      <Route path={routes.profile} element={<ProfilePage />} />
      <Route path={routes.auth.login} element={<Login />} />
      <Route path={routes.auth.register} element={<Register />} />
      <Route path={routes.auth.forgotPassword} element={<ForgotPassword />} />
      <Route path={routes.auth.resetPassword} element={<ResetPassword />} />
      <Route path={routes.adminDashboard} element={<AdminDashboard />} />
      <Route path={routes.users} element={<UsersPage />} />
      <Route path={routes.cars} element={<CarsPage />} />
      <Route path={routes.settings} element={<SettingsPage />} />
      <Route path={routes.profileHome} element={<ProfileHome />} />
      <Route path={routes.favorites} element={<Favorites />} />
      <Route path={routes.notifications} element={<Notifications />} />
      <Route path={routes.profileSettings} element={<Settings />} />
      <Route path={routes.addCar} element={<AddCar />} />
    </Routes>
  );
};

export default AppRoutes;