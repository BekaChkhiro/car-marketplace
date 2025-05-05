import React, { useState } from 'react';
import { Phone, Heart } from 'lucide-react';

interface ContactButtonsProps {
  phone?: string;
}

const ContactButtons = ({ phone }: ContactButtonsProps) => {
  const [showPhone, setShowPhone] = useState(false);

  const togglePhone = () => {
    setShowPhone(!showPhone);
  };

  const getMaskedPhoneNumber = (phone: string) => {
    if (!phone) return 'ნომერი არ არის';
    
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
    <div className="flex gap-1 sm:gap-2">
      <button 
        onClick={togglePhone}
        disabled={!phone}
        className={`group w-10/12 flex items-center justify-between ${
          phone ? 'bg-primary hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'
        } text-white rounded-lg transition-all duration-200 p-0.5 sm:p-1`}
      >
        <div className="flex items-center gap-1 sm:gap-2 py-1.5 sm:py-2.5 pl-2 sm:pl-4">
          <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="text-sm sm:text-base font-medium tracking-wide truncate">
            {phone ? (
              showPhone ? phone.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3') : getMaskedPhoneNumber(phone)
            ) : (
              'ნომერი არ არის ხელმისაწვდომი'
            )}
          </span>
        </div>
        {phone && !showPhone && (
          <div className="h-full px-2 sm:px-3 py-1.5 sm:py-2.5 bg-white text-gray-600 text-xs sm:text-sm font-medium rounded-lg transition-colors">
            ნომრის ნახვა
          </div>
        )}
      </button>
      <button
        className={`w-2/12 flex items-center justify-center gap-1 sm:gap-2 ${
          phone ? 'bg-primary hover:bg-[#128C7E]' : 'bg-gray-300 cursor-not-allowed'
        } text-white px-2 sm:px-4 py-1.5 sm:py-3 rounded-lg transition-all duration-200`}
        disabled={!phone}
      >
        <Heart className='w-5 h-5 sm:w-6 sm:h-6' />
      </button>
    </div>
  );
};

export default ContactButtons;