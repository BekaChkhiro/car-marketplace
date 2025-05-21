import React from 'react';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from '../ScrollToTop';
import MobileBottomNav from './MobileBottomNav';

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <LayoutWrapper>
      <ScrollToTop />
      <Header />
      <main className="w-[100%] lg:w-[90%] mx-auto py-6 px-4 lg:px-0">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
    </LayoutWrapper>
  );
};

export default Layout;