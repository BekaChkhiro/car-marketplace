import React from 'react';
import { Phone } from 'lucide-react';
import { useAuth } from '../../../../../context/AuthContext';

interface ContactButtonsProps {
  phone?: string;
  carName?: string;
}

const ContactButtons = ({ phone, carName }: ContactButtonsProps) => {
  const { user } = useAuth();
  
  // Use the provided phone number or fall back to the authenticated user's phone
  const contactPhone = phone || user?.phone;

  // Format phone number for display
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return 'ნომერი არ არის';
    
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 9) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5)}`;
    } else if (cleaned.length === 12 && cleaned.startsWith('995')) {
      const national = cleaned.slice(3);
      return `${national.slice(0, 3)} ${national.slice(3, 5)} ${national.slice(5)}`;
    }
    return phone;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 border border-green-100 car-detail-card">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 border-b border-green-100 pb-2">გამყიდველთან დაკავშირება</h3>
      
      {/* Car Name */}
      {carName && (
        <div className="mb-3">
          <h4 className="text-sm text-gray-600 mb-1">ავტომობილი:</h4>
          <p className="text-base font-medium text-gray-800">{carName}</p>
        </div>
      )}
      
      {/* Seller Phone */}
      <div className="mb-4">
        <h4 className="text-sm text-gray-600 mb-1">ტელეფონი:</h4>
        <p className="text-base font-medium text-primary">
          {contactPhone ? formatPhoneNumber(contactPhone) : 'ნომერი არ არის ხელმისაწვდომი'}
        </p>
      </div>
      
      {/* Call Button */}
      <a 
        href={`tel:${contactPhone}`}
        className={`w-full flex items-center justify-center gap-2 ${
          contactPhone ? 'bg-primary hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'
        } text-white py-3 px-4 rounded-lg font-medium transition-colors`}
      >
        <Phone className="w-5 h-5" />
        <span>{contactPhone ? formatPhoneNumber(contactPhone) : 'ნომერი არ არის ხელმისაწვდომი'}</span>
      </a>
    </div>
  );
};

export default ContactButtons;