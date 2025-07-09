import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import { routes } from './config/routes';
import Home from './pages/Home';
import CarListing from './pages/CarListing';
import CarDetails from './pages/CarDetails';
import PartListing from './pages/PartListing';
import PartDetails from './pages/PartDetails';
import ProfilePage from './pages/Profile';
import AdminLayout from './pages/Admin/components/AdminLayout';
import AdminDashboard from './pages/Admin/Dashboard';
import UsersPage from './pages/Admin/Users';
import CarsPage from './pages/Admin/Cars';
import AdminEditCar from './pages/Admin/Cars/pages/EditCar';
import AdminParts from './pages/Admin/Parts';
import AdvertisingSpaces from './pages/AdvertisingSpaces';
// იმპორტი ცალკე ფაილიდან, რომელიც ექსპორტირებას აკეთებს index.tsx-იდან
import AdvertisementsPage from './pages/Admin/Advertisements/AdvertisementsPage';
import AllAdvertisementsPage from './pages/Admin/Advertisements/pages/All';
import SliderAdvertisementsPage from './pages/Admin/Advertisements/pages/Slider';
import BannersAdvertisementsPage from './pages/Admin/Advertisements/pages/Banners';
import AdvertisementAnalyticsPage from './pages/Admin/Advertisements/pages/Analytics';
import NewAdvertisementPage from './pages/Admin/Advertisements/pages/NewAdvertisement';
import EditAdvertisementPage from './pages/Admin/Advertisements/pages/EditAdvertisement';
import SettingsPage from './pages/Admin/Settings';
import TransactionsPage from './pages/Admin/Transactions';
import VipListingsPage from './pages/Admin/VipListings';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import GoogleCallback from './pages/Auth/GoogleCallback';
import FacebookCallback from './pages/Auth/FacebookCallback';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import ProfileHome from './pages/Profile/pages/ProfileHome';
import Settings from './pages/Profile/pages/Settings';
import AddCar from './pages/Profile/pages/AddCar';
import ResetPassword from './pages/Auth/ResetPassword';
import UserCars from './pages/Profile/pages/UserCars/index';
import EditCar from './pages/Profile/pages/EditCar/index';
import Wishlist from './pages/Profile/pages/Wishlist';
import Balance from './pages/Profile/pages/Balance';
import AddPart from './pages/Profile/AddPart';
import UserParts from './pages/Profile/pages/UserParts';
import EditPart from './pages/Profile/EditPart';
import HowToSell from './pages/HowToSell';
import TermsAndConditions from './pages/Terms';
import AboutPage from './pages/About';
import ContactPage from './pages/Contact';
import i18n, { getLanguageFromUrl } from './i18n';

const AppRoutes = () => {
  const { lang } = useParams<{ lang: string }>();
  const location = useLocation();
  
  // Update i18n language when language parameter changes
  useEffect(() => {
    if (lang && ['ka', 'en', 'ru'].includes(lang)) {
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
        localStorage.setItem('i18nextLng', lang);
      }
    }
  }, [lang]);
  // Function to build path with language prefix removed
  const buildPath = (path: string): string => {
    // Convert paths like '/cars' to just 'cars' since we're already under /:lang/*
    return path.startsWith('/') ? path.substring(1) : path;
  };
  
  console.log('Current language in routes:', lang);

  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="cars" element={<CarListing />} />
      <Route path="cars/:id" element={<CarDetails />} />
      <Route path="parts" element={<PartListing />} />
      <Route path="parts/:id" element={<PartDetails />} />
      <Route path="how-to-sell" element={<HowToSell />} />
      <Route path="terms" element={<TermsAndConditions />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="contact" element={<ContactPage />} />
      <Route path="advertising-spaces" element={<AdvertisingSpaces />} />
      
      {/* Protected Admin Routes */}
      <Route path="admin" element={
        <ProtectedRoute requiredRole="admin">
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="cars" element={<CarsPage />} />
        <Route path="cars/edit/:id" element={<AdminEditCar />} />
        <Route path="parts" element={<AdminParts />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="vip-listings" element={<VipListingsPage />} />
        <Route path="advertisements" element={<AdvertisementsPage />}>
          <Route index element={<Navigate to="all" replace />} />
          <Route path="all" element={<AllAdvertisementsPage />} />
          <Route path="slider" element={<SliderAdvertisementsPage />} />
          <Route path="banners" element={<BannersAdvertisementsPage />} />
          <Route path="analytics" element={<AdvertisementAnalyticsPage />} />
          <Route path="new" element={<NewAdvertisementPage />} />
          <Route path="edit/:id" element={<EditAdvertisementPage />} />
        </Route>
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Protected Profile Routes */}
      <Route path="profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      }>
        <Route index element={<ProfileHome />} />
        <Route path="cars" element={<UserCars />} />
        <Route path="cars/edit/:id" element={<EditCar />} />
        <Route path="add-car" element={<AddCar />} />
        <Route path="parts" element={<UserParts />} />
        <Route path="parts/edit/:id" element={<EditPart />} />
        <Route path="add-part" element={<AddPart />} />
        <Route path="balance" element={<Balance />} />
        <Route path="settings" element={<Settings />} />
        <Route path="wishlist" element={<Wishlist />} />
      </Route>

      {/* Auth Routes */}
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password" element={<ResetPassword />} />
      <Route path="auth/google/callback" element={<GoogleCallback />} />
      <Route path="auth/facebook/callback" element={<FacebookCallback />} />
      <Route path="wishlist" element={<Wishlist />} />
    </Routes>
  );
};

export default AppRoutes;