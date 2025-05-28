import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../../../../components/ui';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../../../i18n';

const EmptyState: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation([namespaces.profile, namespaces.common]);
  const { lang } = useParams<{ lang: string }>();
  
  // Get current language from URL params or use default
  const currentLang = lang || 'ka';

  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-sm p-12 text-center my-8">
      <img 
        src="/assets/images/empty-cars.svg" 
        alt="No cars" 
        className="w-48 h-48 mb-6 opacity-80"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = 'https://placehold.co/200x200?text=No+Cars';
        }}
      />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('profile:cars.emptyState')}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{t('profile:cars.emptyStateDescription', 'დაამატეთ თქვენი პირველი განცხადება და გაყიდეთ თქვენი ავტომობილი სწრაფად')}</p>
      <Button 
        onClick={() => navigate(`/${currentLang}/profile/add-car`)}
        className="flex items-center gap-2 px-6 py-3 transition-all duration-300 hover:-translate-y-0.5"
      >
        <Plus size={18} />
        {t('profile:cars.addYourFirstListing', 'პირველი განცხადების დამატება')}
      </Button>
    </div>
  );
};

export default EmptyState;