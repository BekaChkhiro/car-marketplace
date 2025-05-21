import React from 'react';
import AboutSection from './components/AboutSection';
import QuickLinks from './components/QuickLinks';
import ContactInfo from './components/ContactInfo';
import SocialLinks from './components/SocialLinks';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-white text-gray-dark pt-8 sm:pt-12 md:pt-16 border-t">
      <div className="w-[90%] mx-auto px-4 py-4">
        {/* Main footer content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12">
          {/* About section takes full width on mobile for better readability */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <AboutSection />
          </div>
          
          {/* Other sections */}
          <div className="col-span-1">
            <QuickLinks />
          </div>
          <div className="col-span-1">
            <ContactInfo />
          </div>
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <SocialLinks />
          </div>
        </div>

        {/* Copyright section */}
        <div className="text-center mt-10 sm:mt-12 md:mt-16 pt-6 sm:pt-8 border-t">
          <p className="text-gray-dark text-sm pb-6">
            &copy; {new Date().getFullYear()} CarMarket. ყველა უფლება დაცულია.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;