import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const SocialLinks: React.FC = () => {
  return (
    <div>
      <h3 className="text-xl font-bold mb-6 text-primary">გამოგვყევით</h3>
      <p className="text-gray-dark mb-6">
        დაგვიკავშირდით სოციალურ ქსელებში სიახლეებისა და სპეციალური შეთავაზებებისთვის.
      </p>
      <div className="flex gap-4">
        {[
          { href: 'https://facebook.com', icon: <FaFacebook />, label: 'Facebook' },
          { href: 'https://twitter.com', icon: <FaTwitter />, label: 'Twitter' },
          { href: 'https://instagram.com', icon: <FaInstagram />, label: 'Instagram' },
        ].map((social) => (
          <a
            key={social.href}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 text-primary transition-all hover:bg-primary hover:text-white transform hover:scale-105"
          >
            {social.icon}
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialLinks;