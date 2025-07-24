import React from 'react';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../../i18n';

const AboutSection: React.FC = () => {
  const { t } = useTranslation(namespaces.footer);
  
  return (
    <div>
      <h3 className="text-xl font-bold mb-6 text-primary">{t('aboutSection.title')}</h3>
      <p className="text-gray-dark leading-relaxed mb-6">
        {t('aboutSection.description')}
      </p>
    </div>
  );
};

export default AboutSection;