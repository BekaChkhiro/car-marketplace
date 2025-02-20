import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import AppRoutes from './routes';
import Layout from './components/layout/Layout';
import { GlobalStyles } from './styles/globalStyles';
import { theme } from './styles/theme';
import { CurrencyProvider } from './context/CurrencyContext';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles theme={theme} />
      <BrowserRouter>
        <CurrencyProvider>
          <Layout>
            <AppRoutes />
          </Layout>
        </CurrencyProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;