import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Share2, Heart, Car as CarIcon } from 'lucide-react';
import { Container } from '../../../../components/ui';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../../i18n';

interface CarHeaderProps {
  isFavorite: boolean;
  handleShare: () => void;
  toggleFavorite: () => void;
}

const CarHeader: React.FC<CarHeaderProps> = ({ 
  isFavorite, 
  handleShare, 
  toggleFavorite 
}) => {
  const { t } = useTranslation([namespaces.carDetails, namespaces.common]);
  const { lang } = useParams<{ lang: string }>();
  
  // Get current language from URL params or use default
  const currentLang = lang || 'ka';
  return (
    <div className="bg-white shadow-md border-b border-green-100">
      <Container>
        <div className="py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link to={`/${currentLang}/cars`} className="flex items-center text-gray-700 hover:text-primary transition-colors mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">{t('common:back')}</span>
            </Link>
            
            <div className="hidden md:flex items-center text-primary">
              <CarIcon className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">{t('carDetails:specs.title', 'მანქანის დეტალები')}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleShare}
              className="p-2.5 bg-green-50 rounded-full shadow-sm hover:shadow-md transition-all action-button"
              aria-label={t('carDetails:specs.shareButton')}
            >
              <Share2 className="w-4 h-4 text-primary" />
            </button>
            <button 
              onClick={toggleFavorite}
              className={`p-2.5 ${isFavorite ? 'bg-red-50' : 'bg-green-50'} rounded-full shadow-sm hover:shadow-md transition-all action-button`}
              aria-label={t('common:addToFavorites', 'რჩეულებში დამატება')}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-current' : 'text-primary'}`} />
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CarHeader;
