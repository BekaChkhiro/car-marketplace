import React from 'react';
import { MapPin, Phone, Calendar, Globe, Building2, User, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dealer } from '../../../../api/types/dealer.types';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../../i18n';

interface DealerInfoCardProps {
  dealer: Dealer;
  authorPhone?: string;
}

const DealerInfoCard: React.FC<DealerInfoCardProps> = ({ dealer, authorPhone }) => {
  const { t } = useTranslation([namespaces.carDetails, namespaces.common]);

  const phoneNumber = authorPhone || dealer.user?.phone || '+995557409798';

  console.log(dealer.car_count);
  
  
  return (
    <div className="bg-white rounded-xl shadow-md border border-green-100 car-detail-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-green-100 bg-gradient-to-r from-green-50 to-green-100">
        <div className="flex items-center space-x-3">
          {dealer.logo_url ? (
            <img 
              src={dealer.logo_url} 
              alt={dealer.company_name}
              className="w-12 h-12 rounded-lg object-cover border-2 border-green-200"
            />
          ) : (
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{t('carDetails:dealerInfo.title')}</h3>
            <p className="text-sm text-primary font-medium">{dealer.company_name}</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">

        {/* Contact Person and Phone in separate boxes but same row */}
        <div className="flex gap-3">
          {/* Contact Person */}
          {dealer.user && (
            <div className="flex-1 flex items-center p-3 bg-green-50/50 rounded-xl transition-all hover:bg-green-50 border border-green-100">
              <div className="bg-primary/10 p-2 rounded-lg mr-3">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span className="text-xs text-gray-500 block">{t('carDetails:dealerInfo.contactPerson')}</span>
                <span className="font-semibold text-gray-900">
                  {dealer.user.first_name} {dealer.user.last_name}
                </span>
              </div>
            </div>
          )}

          {/* Phone */}
          <div className="flex-1 flex items-center p-3 bg-green-50/50 rounded-xl transition-all hover:bg-green-50 border border-green-100">
            <div className="bg-primary/10 p-2 rounded-lg mr-3">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="text-xs text-gray-500 block">{t('carDetails:specs.phone')}</span>
              <span className="font-semibold text-primary">{phoneNumber}</span>
            </div>
          </div>
        </div>

        {/* View Listings Button */}
          <Link
              to={`/ka/dealers/${dealer.user_id}`}
              className="flex-1 flex justify-center items-center bg-primary text-white py-3 px-6 rounded-lg hover:bg-secondary transition-colors font-medium min-h-[48px]"
            >
              განცხადებების ნახვა ({dealer.car_count || 0})
            </Link>
        {/* Call Button */}
        <a
          href={`tel:${phoneNumber}`}
          className="w-full bg-primary hover:bg-secondary text-white py-3 px-4 rounded-xl font-medium transition-colors shadow-md flex items-center justify-center gap-2 mt-4"
        >
          <Phone className="w-5 h-5" />
          <span>{phoneNumber}</span>
        </a>
      </div>
    </div>
  );
};

export default DealerInfoCard;