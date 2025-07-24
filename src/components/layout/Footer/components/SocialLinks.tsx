import React from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../../i18n';

const SocialLinks: React.FC = () => {
  const { t } = useTranslation(namespaces.footer);
  
  const socialLinks = [
    { href: 'https://facebook.com', icon: Facebook, key: 'facebook' },
    { href: 'https://twitter.com', icon: Twitter, key: 'twitter' },
    { href: 'https://instagram.com', icon: Instagram, key: 'instagram' },
  ];

  return (
    <div>
      <h3 className="text-xl font-bold mb-6 text-primary">{t('socialLinks.title')}</h3>
      <p className="text-gray-dark mb-6">
        {t('socialLinks.description')}
      </p>
      <div className="flex gap-4">
        {socialLinks.map((social) => (
          <a
            key={social.href}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t(`socialLinks.${social.key}`)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 text-primary transition-all hover:bg-primary hover:text-white transform hover:scale-105"
          >
            {React.createElement(social.icon, { size: 20 })}
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialLinks;