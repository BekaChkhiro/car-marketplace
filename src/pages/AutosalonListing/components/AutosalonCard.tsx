import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Autosalon } from '../../../api/types/autosalon.types';
import { MapPin, Phone, Globe, Calendar } from 'lucide-react';

interface AutosalonCardProps {
  autosalon: Autosalon;
}

const AutosalonCard: React.FC<AutosalonCardProps> = ({ autosalon }) => {
  const { lang } = useParams<{ lang: string }>();
  
  return (
    <div className="w-full bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="flex h-full">
        {/* Logo */}
        <div className="w-48 h-full bg-gray-100 flex items-center justify-center flex-shrink-0 relative">
          {autosalon.logo_url ? (
            <div className="w-full h-full p-2 flex items-center justify-center">
              <img 
                src={autosalon.logo_url} 
                alt={`${autosalon.company_name} logo`}
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
          <div className={`absolute inset-0 bg-gray-100 flex items-center justify-center ${autosalon.logo_url ? 'hidden' : ''}`}>
            <span className="text-gray-500 font-bold text-2xl">
              {autosalon.company_name.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Main Info */}
        <div className="flex-1 p-8 flex flex-col">
          <div className="flex-1">
            {/* Company Name */}
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              {autosalon.company_name}
            </h3>
            
            {/* Contact Info - 2x2 Grid */}
            <div className="grid grid-cols-2 grid-rows-2 gap-4">
              {autosalon.established_year && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{autosalon.established_year} წლიდან</span>
                </div>
              )}
              
              {(autosalon.user?.phone || (autosalon as any).phone) && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span className="truncate">{autosalon.user?.phone || (autosalon as any).phone}</span>
                </div>
              )}
              
              {autosalon.address && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{autosalon.address}</span>
                </div>
              )}
              
              {autosalon.website_url && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Globe className="w-4 h-4" />
                  <a 
                    href={autosalon.website_url} 
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
              to={`/${lang}/autosalons/${autosalon.id}`}
              className="flex-1 flex justify-center items-center bg-primary text-white py-3 px-6 rounded-lg hover:bg-secondary transition-colors font-medium min-h-[48px]"
            >
              განცხადებების ნახვა ({autosalon.car_count})
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutosalonCard;