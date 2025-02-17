import React, { useState } from 'react';
import styled from 'styled-components';
import { FaUser, FaPhone, FaEnvelope, FaWhatsapp, FaStar, FaShieldAlt } from 'react-icons/fa';

const Container = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.large};
  padding: ${({ theme }) => theme.spacing.xxl};
  position: sticky;
  top: 100px;
  transition: ${({ theme }) => theme.transition.default};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }
`;

const SellerProfile = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  background: ${({ theme }) => theme.colors.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const SellerDetails = styled.div`
  flex: 1;
`;

const SellerName = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SellerMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const VerifiedBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  
  svg {
    color: ${({ theme }) => theme.colors.success};
  }
`;

const MemberSince = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.secondary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.warning};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  
  svg {
    font-size: ${({ theme }) => theme.fontSizes.medium};
  }
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
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.default};
  
  &.primary {
    background: ${({ theme }) => theme.colors.gradient};
    color: white;
    border: none;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${({ theme }) => theme.shadows.medium};
    }
  }
  
  &.secondary {
    background-color: ${({ theme }) => theme.colors.lightGray};
    color: ${({ theme }) => theme.colors.text};
    border: none;
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.border};
      transform: translateY(-2px);
    }
  }
  
  &.whatsapp {
    background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
    color: white;
    border: none;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${({ theme }) => theme.shadows.medium};
    }
  }
`;

const PhoneNumberContainer = styled.div`
  background: ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const PhoneNumber = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const PhoneLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.secondary};
`;

const SafetyTip = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.info}10;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-start;

  svg {
    color: ${({ theme }) => theme.colors.info};
    font-size: ${({ theme }) => theme.fontSizes.large};
    flex-shrink: 0;
  }
`;

const SafetyText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

interface SellerInfoProps {
  seller: {
    id: string;
    name: string;
    phone: string;
    rating?: number;
    verified?: boolean;
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
        <SellerDetails>
          <SellerName>{seller.name}</SellerName>
          <SellerMeta>
            {seller.verified && (
              <VerifiedBadge>
                <FaShieldAlt /> Verified Seller
              </VerifiedBadge>
            )}
            {seller.rating && (
              <Rating>
                <FaStar /> {seller.rating.toFixed(1)}
              </Rating>
            )}
          </SellerMeta>
          <MemberSince>
            Member since 2023
          </MemberSince>
        </SellerDetails>
      </SellerProfile>

      <ContactButtons>
        {!showPhone ? (
          <Button className="primary" onClick={handleShowPhone}>
            <FaPhone /> Show Phone Number
          </Button>
        ) : (
          <PhoneNumberContainer>
            <PhoneNumber>{seller.phone}</PhoneNumber>
            <PhoneLabel>Available 9:00 AM - 8:00 PM</PhoneLabel>
          </PhoneNumberContainer>
        )}
        
        <Button className="whatsapp" onClick={handleWhatsApp}>
          <FaWhatsapp /> Contact via WhatsApp
        </Button>
        
        <Button className="secondary">
          <FaEnvelope /> Send Message
        </Button>
      </ContactButtons>

      <SafetyTip>
        <FaShieldAlt />
        <SafetyText>
          For your safety, always make transactions in person and avoid sending money in advance.
        </SafetyText>
      </SafetyTip>
    </Container>
  );
};

export default SellerInfo;