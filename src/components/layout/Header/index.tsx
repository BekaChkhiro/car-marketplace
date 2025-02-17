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
  background-color: ${({ theme }) => theme.colors.background}F0;
  box-shadow: ${({ theme }) => theme.shadows.small};
  z-index: 1000;
  backdrop-filter: blur(8px);
  transition: ${({ theme }) => theme.transition.default};
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.xl}`};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
`;

const Logo = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  background: ${({ theme }) => theme.colors.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-decoration: none;
  transition: ${({ theme }) => theme.transition.default};
  
  &:hover {
    transform: scale(1.02);
  }
`;

const Navigation = styled.nav<{ isOpen: boolean }>`
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background-color: ${({ theme }) => theme.colors.background};
    padding: ${({ theme }) => theme.spacing.md};
    transform: translateY(${({ isOpen }) => (isOpen ? '0' : '-100%')});
    transition: transform 0.3s ease-in-out;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
  }
`;

const NavList = styled.ul`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const NavItem = styled.li`
  position: relative;
  
  &:hover > ul {
    display: block;
    opacity: 1;
    transform: translateY(0);
  }
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  text-decoration: none;
  transition: ${({ theme }) => theme.transition.default};
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    width: 0;
    height: 2px;
    background: ${({ theme }) => theme.colors.gradient};
    transition: ${({ theme }) => theme.transition.default};
  }
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    
    &:after {
      width: 100%;
      left: 0;
    }
  }
`;

const DropdownMenu = styled.ul`
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => theme.shadows.large};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  min-width: 220px;
  z-index: 1;
  opacity: 0;
  transform: translateY(10px);
  transition: ${({ theme }) => theme.transition.default};
  padding: ${({ theme }) => theme.spacing.sm} 0;
  
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
  background: none;
  border: none;
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
  
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
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  transition: ${({ theme }) => theme.transition.default};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  &.login {
    background-color: transparent;
    color: ${({ theme }) => theme.colors.primary};
    border: 2px solid ${({ theme }) => theme.colors.primary};
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.primary}10;
      transform: translateY(-1px);
    }
  }
  
  &.register {
    background: ${({ theme }) => theme.colors.gradient};
    color: white;
    border: none;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: ${({ theme }) => theme.shadows.medium};
    }
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