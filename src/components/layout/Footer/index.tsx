import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt, FaChevronRight } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-white text-gray-dark py-16 border-t">      
      <div className="w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* About Section */}
        <div>
          <h3 className="text-xl font-bold mb-6 text-primary">ჩვენს შესახებ</h3>
          <p className="text-gray-dark leading-relaxed mb-6">CarMarket არის თქვენი სანდო პლატფორმა საქართველოში ავტომობილების ყიდვა-გაყიდვისთვის. ჩვენ გთავაზობთ მარტივ გამოცდილებას ყველა თქვენი საავტომობილო საჭიროებისთვის.</p>
          
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-6 text-primary">სიახლეების გამოწერა</h3>
            <p className="text-gray-dark mb-4">გამოიწერეთ სიახლეები და მიიღეთ სპეციალური შეთავაზებები</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="შეიყვანეთ იმეილი"
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-dark placeholder:text-gray-400 focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-secondary transition-all duration-200 transform hover:scale-105"
              >
                გამოწერა
              </button>
            </form>
          </div>
        </div>

        {/* Quick Links Section */}
        <div>
          <h3 className="text-xl font-bold mb-6 text-primary">სწრაფი ბმულები</h3>
          <ul className="flex flex-col gap-4">
            {[
              { to: '/', text: 'მთავარი' },
              { to: '/cars', text: 'მანქანები' },
              { to: '/about', text: 'ჩვენს შესახებ' },
              { to: '/contact', text: 'კონტაქტი' },
              { to: '/terms', text: 'წესები და პირობები' },
              { to: '/privacy', text: 'კონფიდენციალურობა' },
            ].map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-gray-dark flex items-center gap-2 hover:text-primary transition-colors group"
                >
                  <FaChevronRight className="text-primary text-sm" />
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info Section */}
        <div>
          <h3 className="text-xl font-bold mb-6 text-primary">საკონტაქტო ინფორმაცია</h3>
          <ul className="flex flex-col gap-4">
            <li>
              <div className="flex items-center gap-4 text-gray-dark hover:text-primary transition-colors">
                <FaMapMarkerAlt className="text-primary text-xl" />
                <span>ჭავჭავაძის 123, თბილისი, საქართველო</span>
              </div>
            </li>
            <li>
              <div className="flex items-center gap-4 text-gray-dark hover:text-primary transition-colors">
                <FaPhone className="text-primary text-xl" />
                <span>+995 555 123 456</span>
              </div>
            </li>
            <li>
              <div className="flex items-center gap-4 text-gray-dark hover:text-primary transition-colors">
                <FaEnvelope className="text-primary text-xl" />
                <span>info@carmarket.ge</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Social Links Section */}
        <div>
          <h3 className="text-xl font-bold mb-6 text-primary">გამოგვყევით</h3>
          <p className="text-gray-dark mb-6">დაგვიკავშირდით სოციალურ ქსელებში სიახლეებისა და სპეციალური შეთავაზებებისთვის.</p>
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
      </div>

      {/* Copyright Section */}
      <div className="text-center mt-16 pt-8 border-t">
        <p className="text-gray-dark text-sm">
          &copy; {new Date().getFullYear()} CarMarket. ყველა უფლება დაცულია.
        </p>
      </div>
    </footer>
  );
};

export default Footer;