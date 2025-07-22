import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../../i18n';

const QuickLinks: React.FC = () => {
  const { t } = useTranslation(namespaces.footer);
  
  const links = [
    { to: '/ka', key: 'home' },
    { to: '/ka/cars', key: 'cars' },
    { to: '/ka/about', key: 'about' },
    { to: '/ka/contact', key: 'contact' },
    { to: '/ka/terms', key: 'terms' },
  ];

  return (
    <div>
      <h3 className="text-xl font-bold mb-6 text-primary">{t('quickLinks.title')}</h3>
      <ul className="flex flex-col gap-4">
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="text-gray-dark flex items-center gap-2 hover:text-primary transition-colors group"
            >
              <ChevronRight className="text-primary text-sm" />
              {t(`quickLinks.${link.key}`)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuickLinks;