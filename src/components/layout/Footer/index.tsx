import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaFacebook, FaTwitter, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.darkGray};
  color: white;
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const FooterSection = styled.div`
  h3 {
    font-size: ${({ theme }) => theme.fontSizes.large};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const FooterList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FooterLink = styled(Link)`
  color: white;
  transition: color 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};

  a {
    color: white;
    font-size: ${({ theme }) => theme.fontSizes.xlarge};
    transition: color 0.3s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
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
        </FooterSection>

        <FooterSection>
          <h3>Quick Links</h3>
          <FooterList>
            <li><FooterLink to="/">Home</FooterLink></li>
            <li><FooterLink to="/cars">Cars</FooterLink></li>
            <li><FooterLink to="/about">About Us</FooterLink></li>
            <li><FooterLink to="/contact">Contact</FooterLink></li>
            <li><FooterLink to="/terms">Terms & Conditions</FooterLink></li>
            <li><FooterLink to="/privacy">Privacy Policy</FooterLink></li>
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
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
          </SocialLinks>
        </FooterSection>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;