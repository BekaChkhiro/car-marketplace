import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { Phone, Mail, MessageCircle, Shield, Star } from 'lucide-react';

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
    <div className="bg-white shadow-sm rounded-xl overflow-hidden sticky top-[100px]">
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center text-white text-xl">
            <FaUser />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-dark truncate">{seller.name}</h3>
            <div className="flex items-center gap-3 mt-2">
              {seller.verified && (
                <div className="inline-flex items-center gap-1.5 text-primary text-sm font-medium">
                  <Shield className="w-4 h-4" />
                  <span>Verified</span>
                </div>
              )}
              {seller.rating && (
                <div className="inline-flex items-center gap-1.5 text-gray-dark text-sm font-medium">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span>{seller.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        <div className="space-y-3">
          {!showPhone ? (
            <button 
              onClick={handleShowPhone}
              className="w-full flex items-center justify-center space-x-2 bg-primary text-white px-4 py-2.5 
                rounded-xl hover:bg-secondary transition-all duration-200 
                transform hover:scale-[1.02] shadow-sm hover:shadow-md"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">Show Phone Number</span>
            </button>
          ) : (
            <div className="animate-fadeIn">
              <div className="bg-green-light rounded-xl p-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">{seller.phone}</div>
                  <div className="text-xs text-gray-600 mt-1">Available 9:00 AM - 8:00 PM</div>
                </div>
              </div>
            </div>
          )}
          
          <button 
            onClick={handleWhatsApp}
            className="w-full flex items-center justify-center space-x-2 bg-[#25D366] text-white px-4 py-2.5 
              rounded-xl hover:bg-[#128C7E] transition-all duration-200 
              transform hover:scale-[1.02] shadow-sm hover:shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">WhatsApp</span>
          </button>
          
          <button 
            className="w-full flex items-center justify-center space-x-2 
              text-gray-dark hover:text-primary transition-colors px-4 py-2.5 rounded-xl
              hover:bg-green-light border border-gray-100"
          >
            <Mail className="w-4 h-4" />
            <span className="text-sm font-medium">Send Message</span>
          </button>
        </div>

        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
          <Shield className="w-5 h-5 text-primary flex-shrink-0" />
          <p className="text-xs text-gray-600 leading-relaxed">
            უსაფრთხოებისთვის, გთხოვთ შეხვედრა დანიშნოთ საზოგადოებრივ ადგილას და თანხის გადახდა 
            განახორციელოთ მხოლოდ დათვალიერების შემდეგ.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerInfo;