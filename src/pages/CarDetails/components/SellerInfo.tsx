import React, { useState } from 'react';
import styled from 'styled-components';
import { FaUser, FaPhone, FaEnvelope, FaWhatsapp } from 'react-icons/fa';

const Container = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  padding: ${({ theme }) => theme.spacing.xl};
  position: sticky;
  top: 100px;
`;

const SellerProfile = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Avatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.lightGray};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 1.5em;
`;

const SellerName = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const MemberSince = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.secondary};
`;

const ContactButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &.primary {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    border: none;
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.success};
    }
  }
  
  &.secondary {
    background-color: white;
    color: ${({ theme }) => theme.colors.text};
    border: 1px solid ${({ theme }) => theme.colors.lightGray};
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.lightGray};
    }
  }
  
  &.whatsapp {
    background-color: #25D366;
    color: white;
    border: none;
    
    &:hover {
      background-color: #128C7E;
    }
  }
`;

const PhoneNumber = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
`;

interface SellerInfoProps {
  seller: {
    id: string;
    name: string;
    phone: string;
  };
}

const SellerInfo: React.FC<SellerInfoProps> = ({ seller }) => {
  const [showPhone, setShowPhone] = useState(false);

  const handleShowPhone = () => {
    setShowPhone(true);
  };

  const handleWhatsApp = () => {
    const phoneNumber = seller.phone.replace(/\D/g, '');
    window.open(`https://wa.me/${phoneNumber}`, '_blank');
  };

  return (
    <Container>
      <SellerProfile>
        <Avatar>
          <FaUser />
        </Avatar>
        <div>
          <SellerName>{seller.name}</SellerName>
          <MemberSince>Member since 2023</MemberSince>
        </div>
      </SellerProfile>

      <ContactButtons>
        {!showPhone ? (
          <Button className="primary" onClick={handleShowPhone}>
            <FaPhone /> Show Phone Number
          </Button>
        ) : (
          <PhoneNumber>{seller.phone}</PhoneNumber>
        )}

        <Button className="whatsapp" onClick={handleWhatsApp}>
          <FaWhatsapp /> Contact via WhatsApp
        </Button>

        <Button className="secondary">
          <FaEnvelope /> Send Message
        </Button>
      </ContactButtons>
    </Container>
  );
};

export default SellerInfo;