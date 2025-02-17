import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaSearch, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import data from '../../../data/cars.json';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  z-index: 1000;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
`;

const Logo = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;

const Navigation = styled.nav<{ isOpen: boolean }>`
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    position: fixed;
    top: 80px;
    left: 0;
    right: 0;
    background-color: ${({ theme }) => theme.colors.background};
    padding: ${({ theme }) => theme.spacing.md};
    transform: translateY(${({ isOpen }) => (isOpen ? '0' : '-100%')});
    transition: transform 0.3s ease-in-out;
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const NavList = styled.ul`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

const NavItem = styled.li`
  position: relative;
  
  &:hover > ul {
    display: block;
  }
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const DropdownMenu = styled.ul`
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  min-width: 200px;
  z-index: 1;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    position: static;
    box-shadow: none;
    padding-left: ${({ theme }) => theme.spacing.md};
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.text};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Button = styled.button`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  
  &.login {
    background-color: transparent;
    color: ${({ theme }) => theme.colors.primary};
  }
  
  &.register {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
  }
`;

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { brands } = data;

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">CarMarket</Logo>
        
        <MobileMenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </MobileMenuButton>
        
        <Navigation isOpen={isMenuOpen}>
          <NavList>
            <NavItem>
              <NavLink to="/">Home</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/cars">Cars</NavLink>
              <DropdownMenu>
                {brands.map((brand) => (
                  <NavItem key={brand.id}>
                    <NavLink to={`/cars?brand=${brand.name}`}>{brand.name}</NavLink>
                  </NavItem>
                ))}
              </DropdownMenu>
            </NavItem>
            <NavItem>
              <NavLink to="/about">About</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/contact">Contact</NavLink>
            </NavItem>
          </NavList>
        </Navigation>
        
        <Actions>
          <Button className="login">
            <FaUser /> Login
          </Button>
          <Button className="register">Register</Button>
        </Actions>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;