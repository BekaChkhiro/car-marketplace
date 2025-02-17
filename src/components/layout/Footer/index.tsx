import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaFacebook, FaTwitter, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt, FaChevronRight } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background: linear-gradient(to bottom, ${({ theme }) => theme.colors.darkGray}, #1a1a1a);
  color: white;
  padding: ${({ theme }) => theme.spacing.section} 0 ${({ theme }) => theme.spacing.xl};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ theme }) => theme.colors.gradient};
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.xl};
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xxl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const FooterSection = styled.div`
  h3 {
    font-size: ${({ theme }) => theme.fontSizes.xlarge};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    background: ${({ theme }) => theme.colors.gradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    position: relative;
    display: inline-block;
  }
  
  p {
    color: ${({ theme }) => theme.colors.secondary};
    line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

const FooterList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FooterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.secondary};
  transition: ${({ theme }) => theme.transition.default};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  svg {
    font-size: 0.8em;
    opacity: 0;
    transform: translateX(-10px);
    transition: ${({ theme }) => theme.transition.default};
  }
  
  &:hover {
    color: white;
    transform: translateX(5px);
    
    svg {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.secondary};
  transition: ${({ theme }) => theme.transition.default};
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
    font-size: ${({ theme }) => theme.fontSizes.large};
  }
  
  &:hover {
    color: white;
    transform: translateX(5px);
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
  
  a {
    width: 40px;
    height: 40px;
    border-radius: ${({ theme }) => theme.borderRadius.round};
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: ${({ theme }) => theme.fontSizes.large};
    transition: ${({ theme }) => theme.transition.default};
    
    &:hover {
      background: ${({ theme }) => theme.colors.gradient};
      transform: translateY(-3px);
    }
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.section};
  padding-top: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.fontSizes.small};
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Newsletter = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  
  input {
    flex: 1;
    padding: ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.borderRadius.large};
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
    color: white;
    
    &::placeholder {
      color: ${({ theme }) => theme.colors.secondary};
    }
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }
  
  button {
    padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
    background: ${({ theme }) => theme.colors.gradient};
    color: white;
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.large};
    cursor: pointer;
    transition: ${({ theme }) => theme.transition.default};
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${({ theme }) => theme.shadows.medium};
    }
  }
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>About Us</h3>
          <p>CarMarket is your trusted platform for buying and selling cars in Georgia. We provide a seamless experience for all your automotive needs.</p>
          <Newsletter>
            <h3>Newsletter</h3>
            <p>Subscribe to receive updates and special offers</p>
            <NewsletterForm onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" />
              <button type="submit">Subscribe</button>
            </NewsletterForm>
          </Newsletter>
        </FooterSection>
        
        <FooterSection>
          <h3>Quick Links</h3>
          <FooterList>
            {[
              { to: '/', text: 'Home' },
              { to: '/cars', text: 'Cars' },
              { to: '/about', text: 'About Us' },
              { to: '/contact', text: 'Contact' },
              { to: '/terms', text: 'Terms & Conditions' },
              { to: '/privacy', text: 'Privacy Policy' },
            ].map((link) => (
              <li key={link.to}>
                <FooterLink to={link.to}>
                  <FaChevronRight />
                  {link.text}
                </FooterLink>
              </li>
            ))}
          </FooterList>
        </FooterSection>
        
        <FooterSection>
          <h3>Contact Info</h3>
          <FooterList>
            <li>
              <ContactItem>
                <FaMapMarkerAlt />
                <span>123 Car Street, Tbilisi, Georgia</span>
              </ContactItem>
            </li>
            <li>
              <ContactItem>
                <FaPhone />
                <span>+995 555 123 456</span>
              </ContactItem>
            </li>
            <li>
              <ContactItem>
                <FaEnvelope />
                <span>info@carmarket.ge</span>
              </ContactItem>
            </li>
          </FooterList>
        </FooterSection>
        
        <FooterSection>
          <h3>Follow Us</h3>
          <p>Stay connected with us on social media for the latest updates and offers.</p>
          <SocialLinks>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
          </SocialLinks>
        </FooterSection>
      </FooterContent>
      
      <Copyright>
        <p>&copy; {new Date().getFullYear()} CarMarket. All rights reserved. Made with ❤️ in Georgia</p>
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;