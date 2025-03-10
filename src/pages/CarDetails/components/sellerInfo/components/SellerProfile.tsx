import React from 'react';
import { User, Shield, Star } from 'lucide-react';

interface SellerProfileProps {
  seller: {
    name: string;
    verified?: boolean;
    rating?: number;
  };
}

const SellerProfile = ({ seller }: SellerProfileProps) => {
  const { name = 'Anonymous', verified = false, rating } = seller || {};

  return (
    <div className="p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white text-xl shadow-sm hover:shadow transform hover:-translate-y-0.5 transition-all duration-300">
          <User size={24} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-gray-dark truncate hover:text-primary transition-colors duration-200">
            {name}
          </h3>
          <div className="flex items-center gap-3 mt-2">
            {verified && (
              <div className="inline-flex items-center gap-1.5 text-primary text-sm font-medium bg-primary/10 px-2.5 py-1 rounded-full">
                <Shield className="w-4 h-4" />
                <span>Verified</span>
              </div>
            )}
            {rating !== undefined && (
              <div className="inline-flex items-center gap-1.5 text-gray-dark text-sm font-medium bg-yellow-50 px-2.5 py-1 rounded-full">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span>{rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;