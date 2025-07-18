import React from 'react';
import { Link } from 'react-router-dom';
import { Dealer } from '../../../api/types/dealer.types';
import { MapPin, Phone, Globe, Calendar, Car } from 'lucide-react';

interface DealerCardProps {
  dealer: Dealer;
}

const DealerCard: React.FC<DealerCardProps> = ({ dealer }) => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="flex h-full">
        {/* Logo */}
        <div className="w-48 h-full bg-gray-100 flex items-center justify-center flex-shrink-0 relative">
          {dealer.logo_url ? (
            <div className="w-full h-full p-2 flex items-center justify-center">
              <img 
                src={dealer.logo_url} 
                alt={`${dealer.company_name} logo`}
                className="max-w-full max-h-full object-contain rounded-lg"
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.parentElement?.nextElementSibling as HTMLElement;
                  if (fallback) {
                    fallback.classList.remove('hidden');
                  }
                }}
              />
            </div>
          ) : null}
          <div className={`absolute inset-0 bg-gray-100 flex items-center justify-center ${dealer.logo_url ? 'hidden' : ''}`}>
            <span className="text-gray-500 font-bold text-2xl">
              {dealer.company_name.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Main Info */}
        <div className="flex-1 p-8 flex flex-col">
          <div className="flex-1">
            {/* Company Name */}
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              {dealer.company_name}
            </h3>
            
            {/* Contact Info - 2x2 Grid */}
            <div className="grid grid-cols-2 grid-rows-2 gap-4">
              {dealer.established_year && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{dealer.established_year} წლიდან</span>
                </div>
              )}
              
              {dealer.user?.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span className="truncate">{dealer.user.phone}</span>
                </div>
              )}
              
              {dealer.address && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{dealer.address}</span>
                </div>
              )}
              
              {dealer.website_url && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Globe className="w-4 h-4" />
                  <a 
                    href={dealer.website_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:text-secondary truncate"
                  >
                    ვებ გვერდი
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-6">
            <Link
              to={`/ka/dealers/${dealer.user_id}`}
              className="flex-1 flex justify-center items-center bg-primary text-white py-3 px-6 rounded-lg hover:bg-secondary transition-colors font-medium min-h-[48px]"
            >
              განცხადებების ნახვა ({dealer.car_count})
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerCard;