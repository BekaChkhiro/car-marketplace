import React from 'react';
import { User, Shield, Star } from 'lucide-react';
import { useAuth } from '../../../../../context/AuthContext';

interface SellerProfileProps {
  seller: {
    name: string;
    verified?: boolean;
    rating?: number;
  };
}

const SellerProfile = ({ seller }: SellerProfileProps) => {
  const { user } = useAuth();
  const { name = 'Anonymous', verified = false, rating } = seller || {};
  
  // Use real user data if available
  const displayName = user ? 
    (user.first_name && user.last_name ? 
      `${user.first_name} ${user.last_name}` : 
      user.username) : 
    name;

  return (
    <div className="p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white text-lg sm:text-xl shadow-sm hover:shadow transform hover:-translate-y-0.5 transition-all duration-300">
          <User size={20} className="sm:w-6 sm:h-6" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-gray-dark truncate hover:text-primary transition-colors duration-200">
            {displayName}
          </h3>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 sm:mt-2">
            {verified && (
              <div className="inline-flex items-center gap-1 sm:gap-1.5 text-primary text-xs sm:text-sm font-medium bg-primary/10 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Verified</span>
              </div>
            )}
            {rating !== undefined && (
              <div className="inline-flex items-center gap-1 sm:gap-1.5 text-gray-dark text-xs sm:text-sm font-medium bg-yellow-50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
                <span>{Math.round(rating)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;