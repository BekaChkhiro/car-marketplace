import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, Eye, EyeOff } from 'lucide-react';

interface ContactButtonsProps {
  phone: string;
}

const ContactButtons = ({ phone }: ContactButtonsProps) => {
  const [showPhone, setShowPhone] = useState(false);

  const handleWhatsApp = () => {
    const phoneNumber = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${phoneNumber}`, '_blank');
  };

  const togglePhone = () => {
    setShowPhone(!showPhone);
  };

  const getMaskedPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 9) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 6)}**`;
    } else if (cleaned.length === 12 && cleaned.startsWith('995')) {
      const national = cleaned.slice(3);
      return `${national.slice(0, 3)} ${national.slice(3, 5)} ${national.slice(5, 6)}**`;
    }
    return phone;
  };

  return (
    <div className="space-y-3">
      <button 
        onClick={togglePhone}
        className="group w-full flex items-center justify-between bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 p-1"
      >
        <div className="flex items-center gap-2 py-2.5 pl-4">
          <Phone className="w-4 h-4" />
          <span className="text-base font-medium tracking-wide">
            {showPhone ? (
              phone.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
            ) : (
              getMaskedPhoneNumber(phone)
            )}
          </span>
        </div>
        {!showPhone && (
          <div className="h-full px-3 py-2.5 bg-white text-gray-600 text-sm font-medium rounded-lg transition-colors">
            ნომრის ნახვა
          </div>
        )}
      </button>
      
      <button 
        onClick={handleWhatsApp}
        className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-3
          rounded-lg hover:bg-[#128C7E] transition-all duration-200"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="font-medium">WhatsApp</span>
      </button>
      
      <button 
        className="w-full flex items-center justify-center gap-2 
          text-gray-dark hover:text-primary transition-colors px-4 py-3 rounded-lg
          hover:bg-green-50 border border-gray-200"
      >
        <Mail className="w-5 h-5" />
        <span className="font-medium">Send Message</span>
      </button>
    </div>
  );
};

export default ContactButtons;