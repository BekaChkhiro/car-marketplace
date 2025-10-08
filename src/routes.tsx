import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import { routes } from './config/routes';
import ProtectedRoute from './components/auth/ProtectedRoute';
import i18n, { getLanguageFromUrl } from './i18n';

// Eager load critical pages for initial render
import Home from './pages/Home';

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Lazy load non-critical pages
const CarListing = lazy(() => import('./pages/CarListing'));
const CarDetails = lazy(() => import('./pages/CarDetails'));
const PartListing = lazy(() => import('./pages/PartListing'));
const PartDetails = lazy(() => import('./pages/PartDetails'));
const DealerListing = lazy(() => import('./pages/DealerListing'));
const DealerProfile = lazy(() => import('./pages/DealerProfile'));
const AutosalonListing = lazy(() => import('./pages/AutosalonListing'));
const AutosalonProfile = lazy(() => import('./pages/AutosalonProfile'));
const SellerPage = lazy(() => import('./pages/SellerPage'));
const HowToSell = lazy(() => import('./pages/HowToSell'));
const TermsAndConditions = lazy(() => import('./pages/Terms'));
const AboutPage = lazy(() => import('./pages/About'));
const ContactPage = lazy(() => import('./pages/Contact'));
const AdvertisingSpaces = lazy(() => import('./pages/AdvertisingSpaces'));

// Lazy load Auth pages
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/Auth/ResetPassword'));
const GoogleCallback = lazy(() => import('./pages/Auth/GoogleCallback'));
const FacebookCallback = lazy(() => import('./pages/Auth/FacebookCallback'));

// Lazy load Profile pages (only loaded when user is authenticated)
const ProfilePage = lazy(() => import('./pages/Profile'));
const ProfileHome = lazy(() => import('./pages/Profile/pages/ProfileHome'));
const Settings = lazy(() => import('./pages/Profile/pages/Settings'));
const AddCar = lazy(() => import('./pages/Profile/pages/AddCar'));
const UserCars = lazy(() => import('./pages/Profile/pages/UserCars/index'));
const EditCar = lazy(() => import('./pages/Profile/pages/EditCar/index'));
const Wishlist = lazy(() => import('./pages/Profile/pages/Wishlist'));
const Balance = lazy(() => import('./pages/Profile/pages/Balance'));
const AddPart = lazy(() => import('./pages/Profile/AddPart'));
const UserParts = lazy(() => import('./pages/Profile/pages/UserParts'));
const EditPart = lazy(() => import('./pages/Profile/EditPart'));

// Lazy load Admin pages (only loaded when user is admin)
const AdminLayout = lazy(() => import('./pages/Admin/components/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const UsersPage = lazy(() => import('./pages/Admin/Users'));
const CarsPage = lazy(() => import('./pages/Admin/Cars'));
const AdminEditCar = lazy(() => import('./pages/Admin/Cars/pages/EditCar'));
const AdminNewEditCar = lazy(() => import('./pages/Admin/Cars/pages/EditCar/index'));
const AdminParts = lazy(() => import('./pages/Admin/Parts'));
const AdvertisementsPage = lazy(() => import('./pages/Admin/Advertisements/AdvertisementsPage'));
const AllAdvertisementsPage = lazy(() => import('./pages/Admin/Advertisements/pages/All'));
const SliderAdvertisementsPage = lazy(() => import('./pages/Admin/Advertisements/pages/Slider'));
const BannersAdvertisementsPage = lazy(() => import('./pages/Admin/Advertisements/pages/Banners'));
const AdvertisementAnalyticsPage = lazy(() => import('./pages/Admin/Advertisements/pages/Analytics'));
const NewAdvertisementPage = lazy(() => import('./pages/Admin/Advertisements/pages/NewAdvertisement'));
const EditAdvertisementPage = lazy(() => import('./pages/Admin/Advertisements/pages/EditAdvertisement'));
const SettingsPage = lazy(() => import('./pages/Admin/Settings'));
const VipSettingsPage = lazy(() => import('./pages/Admin/VipSettings'));
const TermsManagement = lazy(() => import('./pages/Admin/Terms'));
const Analytics = lazy(() => import('./pages/Admin/Analytics'));
const TransactionsPage = lazy(() => import('./pages/Admin/Transactions'));
const VipListingsPage = lazy(() => import('./pages/Admin/VipListings'));
const AutosalonsAdmin = lazy(() => import('./pages/Admin/Autosalons'));
const DealersAdmin = lazy(() => import('./pages/Admin/Dealers'));

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
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route index element={<Home />} />
        <Route path="cars" element={<CarListing />} />
        <Route path="cars/:id" element={<CarDetails />} />
      <Route path="parts" element={<PartListing />} />
      <Route path="parts/:id" element={<PartDetails />} />
      <Route path="dealers" element={<DealerListing />} />
      <Route path="dealers/:dealerId" element={<DealerProfile />} />
      <Route path="autosalons" element={<AutosalonListing />} />
      <Route path="autosalons/:autosalonId" element={<AutosalonProfile />} />
      <Route path="sellers/:sellerId" element={<SellerPage />} />
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
        <Route path="cars/:id/edit" element={<AdminEditCar />} />
        <Route path="cars/edit/:id" element={<AdminNewEditCar />} />
        <Route path="autosalons" element={<AutosalonsAdmin />} />
        <Route path="dealers" element={<DealersAdmin />} />
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
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="vip-settings" element={<VipSettingsPage />} />
        <Route path="terms" element={<TermsManagement />} />
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
    </Suspense>
  );
};

export default AppRoutes;