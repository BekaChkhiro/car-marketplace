import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import AppRoutes from './routes';
import Layout from './components/layout/Layout';
import { GlobalStyles } from './styles/globalStyles';
import { theme } from './styles/theme';
import { CurrencyProvider } from './context/CurrencyContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { LoadingProvider } from './context/LoadingContext';
import { WishlistProvider } from './context/WishlistContext';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles theme={theme} />
      <BrowserRouter>
        <LoadingProvider>
          <ToastProvider>
            <AuthProvider>
              <CurrencyProvider>
                <WishlistProvider>
                  <Layout>
                    <Routes>
                      {/* Root path redirect to current language or default language */}
                      <Route path="/" element={<Navigate to={`/ka`} replace />} />
                      
                      {/* Redirect any non-language routes to include language prefix */}
                      <Route path="/cars/*" element={<Navigate to={`/ka/cars`} replace />} />
                      <Route path="/profile/*" element={<Navigate to={`/ka/profile`} replace />} />
                      <Route path="/wishlist" element={<Navigate to={`/ka/wishlist`} replace />} />
                      <Route path="/login" element={<Navigate to={`/ka/login`} replace />} />
                      <Route path="/register" element={<Navigate to={`/ka/register`} replace />} />
                      <Route path="/admin/*" element={<Navigate to={`/ka/admin`} replace />} />
                      
                      {/* Language-specific routes */}
                      <Route path="/:lang/*" element={<AppRoutes />} />
                    </Routes>
                  </Layout>
                </WishlistProvider>
              </CurrencyProvider>
            </AuthProvider>
          </ToastProvider>
        </LoadingProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;