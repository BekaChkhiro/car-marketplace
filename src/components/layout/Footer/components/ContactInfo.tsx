import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../../i18n';

const ContactInfo: React.FC = () => {
  const { t } = useTranslation(namespaces.footer);
  
  return (
    <div>
      <h3 className="text-xl font-bold mb-6 text-primary">{t('contactInfo.title')}</h3>
      <ul className="flex flex-col gap-4">
        <li>
          <div className="flex items-center gap-4 text-gray-dark hover:text-primary transition-colors">
            <MapPin className="text-primary" size={20} />
            <span>{t('contactInfo.address')}</span>
          </div>
        </li>
        <li>
          <div className="flex items-center gap-4 text-gray-dark hover:text-primary transition-colors">
            <Phone className="text-primary" size={20} />
            <span>{t('contactInfo.phone')}</span>
          </div>
        </li>
        <li>
          <div className="flex items-center gap-4 text-gray-dark hover:text-primary transition-colors">
            <Mail className="text-primary" size={20} />
            <span>{t('contactInfo.email')}</span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default ContactInfo;