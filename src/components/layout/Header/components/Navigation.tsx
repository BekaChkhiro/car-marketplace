import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface MenuItem {
  id: number;
  text?: string;
  href?: string;
  component?: React.ComponentType;
}

interface NavigationProps {
  menuItems: MenuItem[];
}

const Navigation: React.FC<NavigationProps> = ({ menuItems }) => {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  
  // Get current language from URL params or i18n
  const currentLang = lang || i18n.language || 'ka';
  
  // Helper function to prefix paths with current language
  const langPath = (path: string): string => {
    // If path already starts with lang code, don't add it again
    if (path.startsWith(`/${currentLang}/`)) return path;
    if (path === '/') return `/${currentLang}`;
    return `/${currentLang}${path}`;
  };
  return (
    <nav>
      <ul className="flex items-center space-x-8">
        {menuItems.map((item) => (
          <li key={item.id}>
            {item.component ? (
              <item.component />
            ) : (
              <Link
                to={langPath(item.href || '/')}
                className="text-gray-700 hover:text-primary transition-colors font-medium text-base"
              >
                {item.text}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;