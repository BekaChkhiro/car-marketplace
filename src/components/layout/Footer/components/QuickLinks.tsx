import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const QuickLinks: React.FC = () => {
  return (
    <div>
      <h3 className="text-xl font-bold mb-6 text-primary">სწრაფი ბმულები</h3>
      <ul className="flex flex-col gap-4">
        {[
          { to: '/ka', text: 'მთავარი' },
          { to: '/ka/cars', text: 'მანქანები' },
          { to: '/ka/about', text: 'ჩვენს შესახებ' },
          { to: '/ka/contact', text: 'კონტაქტი' },
          { to: '/ka/terms', text: 'წესები და პირობები' },
        ].map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="text-gray-dark flex items-center gap-2 hover:text-primary transition-colors group"
            >
              <ChevronRight className="text-primary text-sm" />
              {link.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuickLinks;