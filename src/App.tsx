import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import AppRoutes from './routes';
import Layout from './components/layout/Layout';
import { GlobalStyles } from './styles/globalStyles';
import { theme } from './styles/theme';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles theme={theme} />
      <BrowserRouter>
        <Layout>
          <AppRoutes />
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;