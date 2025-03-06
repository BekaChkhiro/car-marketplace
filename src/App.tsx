import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import AppRoutes from './routes';
import Layout from './components/layout/Layout';
import { GlobalStyles } from './styles/globalStyles';
import { theme } from './styles/theme';
import { CurrencyProvider } from './context/CurrencyContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { LoadingProvider } from './context/LoadingContext';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles theme={theme} />
      <BrowserRouter>
        <LoadingProvider>
          <ToastProvider>
            <AuthProvider>
              <CurrencyProvider>
                <Layout>
                  <AppRoutes />
                </Layout>
              </CurrencyProvider>
            </AuthProvider>
          </ToastProvider>
        </LoadingProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;