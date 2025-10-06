import React from 'react';
import { Phone, User, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../../i18n';

interface RegularUserInfoCardProps {
  authorName?: string;
  authorPhone?: string;
  sellerId?: number;
}

const RegularUserInfoCard: React.FC<RegularUserInfoCardProps> = ({
  authorName,
  authorPhone,
  sellerId
}) => {
  const { t } = useTranslation([namespaces.carDetails, namespaces.common]);

  const phoneNumber = authorPhone || '+995557409798';
  const sellerName = authorName || t('carDetails:priceCard.carOwner', 'Car Owner');

  return (
    <div className="bg-white rounded-xl shadow-md border border-green-100 car-detail-card overflow-hidden">
      {/* Contact Header */}
      <div className="p-4 border-b border-green-100">
        <h3 className="text-lg font-semibold text-gray-800">{t('carDetails:priceCard.contactSeller')}</h3>
      </div>

      <div className="p-5 space-y-4">
        {/* Author Name */}
        <div className="flex items-center p-3 bg-green-50/50 rounded-xl transition-all hover:bg-green-50 border border-green-100">
          <div className="bg-primary/10 p-2 rounded-lg mr-3">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="text-xs text-gray-500 block">{t('carDetails:specs.name')}</span>
            <span className="font-semibold text-gray-900">{sellerName}</span>
          </div>
        </div>

        {/* Seller Phone */}
        <div className="flex items-center p-3 bg-green-50/50 rounded-xl transition-all hover:bg-green-50 border border-green-100">
          <div className="bg-primary/10 p-2 rounded-lg mr-3">
            <Phone className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="text-xs text-gray-500 block">{t('carDetails:specs.phone')}</span>
            <span className="font-semibold text-primary">{phoneNumber}</span>
          </div>
        </div>

        {/* View Seller Button */}
        {sellerId && (
          <Link
            to={`/ka/sellers/${sellerId}`}
            className="w-full flex justify-center items-center bg-primary text-white py-3 px-6 rounded-lg hover:bg-secondary transition-colors font-medium min-h-[48px]"
          >
            {t('carDetails:viewSeller', 'View Seller')}
          </Link>
        )}

        {/* Call Button */}
        <a
          href={`tel:${phoneNumber}`}
          className="w-full bg-primary hover:bg-green-600 text-white py-3 px-4 rounded-xl font-medium transition-colors shadow-md flex items-center justify-center gap-2 mt-2"
        >
          <Phone className="w-5 h-5" />
          <span>{phoneNumber}</span>
        </a>

        {/* Favorite Button */}
        <button className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-green-200 hover:bg-green-50 transition-colors mt-2">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            <span className="font-medium">{t('carDetails:header.addToWishlist')}</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default RegularUserInfoCard;