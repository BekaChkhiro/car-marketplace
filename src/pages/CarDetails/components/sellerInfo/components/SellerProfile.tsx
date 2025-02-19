import React from 'react';
import { FaUser } from 'react-icons/fa';
import { Shield, Star } from 'lucide-react';

interface SellerProfileProps {
  seller: {
    name: string;
    verified?: boolean;
    rating?: number;
  };
}

const SellerProfile = ({ seller }: SellerProfileProps) => {
  return (
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
  );
};

export default SellerProfile;