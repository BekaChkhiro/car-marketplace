import React from 'react';
import AboutSection from './components/AboutSection';
import QuickLinks from './components/QuickLinks';
import ContactInfo from './components/ContactInfo';
import SocialLinks from './components/SocialLinks';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-white text-gray-dark pt-16 pb-4 border-t">      
      <div className="w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <AboutSection />
        <QuickLinks />
        <ContactInfo />
        <SocialLinks />
      </div>

      <div className="text-center mt-16 pt-8 border-t">
        <p className="text-gray-dark text-sm">
          &copy; {new Date().getFullYear()} CarMarket. ყველა უფლება დაცულია.
        </p>
      </div>
    </footer>
  );
};

export default Footer;