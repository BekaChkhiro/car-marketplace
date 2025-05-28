import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container } from '../../../../components/ui';
import { ArrowLeft, AlertCircle, Car } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../../i18n';

const NotFoundState: React.FC = () => {
  const { t } = useTranslation([namespaces.carDetails, namespaces.common]);
  const { lang } = useParams<{ lang: string }>();
  
  // Get current language from URL params or use default
  const currentLang = lang || 'ka';
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <Container>
        <div className="flex flex-col justify-center items-center min-h-[70vh] py-20">
          <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full border border-green-100">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">{t('carDetails:specs.notFound')}</h2>
            <p className="text-gray-600 text-center mb-8">{t('carDetails:specs.notFoundDescription', 'სამწუხაროდ, მითითებული ID-ით მანქანა ვერ მოიძებნა.')}</p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to={`/${currentLang}`} className="bg-green-50 text-primary px-6 py-3 rounded-lg transition-all duration-300 border border-primary hover:bg-green-100 flex items-center justify-center">
                <Car className="w-4 h-4 mr-2" />
                {t('carDetails:breadcrumb.home')}
              </Link>
              
              <Link to={`/${currentLang}/cars`} className="bg-primary hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('carDetails:specs.carsList', 'მანქანების სია')}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NotFoundState;
