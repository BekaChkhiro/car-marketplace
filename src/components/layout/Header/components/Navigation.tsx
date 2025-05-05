import React from 'react';
import { Link } from 'react-router-dom';

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
  return (
    <nav>
      <ul className="flex items-center space-x-8">
        {menuItems.map((item) => (
          <li key={item.id}>
            {item.component ? (
              <item.component />
            ) : (
              <Link
                to={item.href || '/'}
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