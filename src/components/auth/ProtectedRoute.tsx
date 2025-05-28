import React from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingOverlay from '../common/LoadingOverlay';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requiredRole?: 'admin' | 'user';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = '/',
  requiredRole
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  const { lang } = useParams<{ lang: string }>();

  if (isLoading) {
    return <LoadingOverlay isVisible={true} />;
  }

  if (!isAuthenticated) {
    // Include language prefix in redirect
    const localizedRedirect = lang ? `/${lang}${redirectTo === '/' ? '' : redirectTo}` : redirectTo;
    return <Navigate to={localizedRedirect} state={{ from: location }} replace />;
  }

  // Check for role-based access
  if (requiredRole && user?.role !== requiredRole) {
    // Create language-aware redirect path
    const adminPath = lang ? `/${lang}/admin` : '/admin';
    const homePath = lang ? `/${lang}` : '/';
    return <Navigate to={user?.role === 'admin' ? adminPath : homePath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;