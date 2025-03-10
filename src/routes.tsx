import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CarListing from './pages/CarListing';
import CarDetails from './pages/CarDetails';
import ProfilePage from './pages/Profile';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { routeConfigs } from './config/routes';
import { useAuth } from './context/AuthContext';
import ProfileHome from './pages/Profile/pages/ProfileHome';
import Favorites from './pages/Profile/pages/Favorites';
import Notifications from './pages/Profile/pages/Notifications';
import Settings from './pages/Profile/pages/Settings';
import AddCar from './pages/Profile/pages/AddCar';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path={routeConfigs.home.path} element={<Home />} />
      
      {/* Public Car Routes */}
      <Route path={routeConfigs.carListing.path} element={<CarListing />} />
      <Route path={routeConfigs.carDetails.path} element={<CarDetails />} />
      
      {/* Protected Profile Routes */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;