import React, { useState } from 'react';
import { FaUser, FaPhone, FaEnvelope, FaWhatsapp, FaStar, FaShieldAlt } from 'react-icons/fa';

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
    <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-[100px] transition-all hover:shadow-lg">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-xl shadow-md">
            <FaUser />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-800 truncate">{seller.name}</h3>
            <div className="flex items-center gap-3 mt-1.5">
              {seller.verified && (
                <div className="inline-flex items-center gap-1 text-primary text-sm font-medium">
                  <FaShieldAlt className="text-green-500" />
                  <span>Verified</span>
                </div>
              )}
              {seller.rating && (
                <div className="inline-flex items-center gap-1 text-amber-500 font-medium">
                  <FaStar />
                  <span>{seller.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">Member since 2023</p>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100" />

        <div className="space-y-3">
          {!showPhone ? (
            <button 
              onClick={handleShowPhone}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-white
                bg-gradient-to-r from-primary to-secondary font-semibold
                transform transition-all active:scale-95 hover:-translate-y-0.5 hover:shadow-md"
            >
              <FaPhone className="text-sm" />
              <span>Show Phone Number</span>
            </button>
          ) : (
            <div className="animate-fadeIn">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-primary mb-1">{seller.phone}</div>
                  <div className="text-sm text-gray-500">Available 9:00 AM - 8:00 PM</div>
                </div>
              </div>
            </div>
          )}
          
          <button 
            onClick={handleWhatsApp}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-white
              bg-gradient-to-r from-[#25D366] to-[#128C7E] font-semibold
              transform transition-all active:scale-95 hover:-translate-y-0.5 hover:shadow-md"
          >
            <FaWhatsapp className="text-lg" />
            <span>WhatsApp</span>
          </button>
          
          <button 
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg
              text-gray-700 bg-gray-50 font-semibold hover:bg-gray-100
              transform transition-all active:scale-95 hover:-translate-y-0.5"
          >
            <FaEnvelope className="text-sm" />
            <span>Send Message</span>
          </button>
        </div>

        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
          <FaShieldAlt className="text-blue-500 text-lg flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600 leading-relaxed">
            უსაფრთხოებისთვის, გთხოვთ შეხვედრა დანიშნოთ საზოგადოებრივ ადგილას და თანხის გადახდა 
            განახორციელოთ მხოლოდ დათვალიერების შემდეგ.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerInfo;