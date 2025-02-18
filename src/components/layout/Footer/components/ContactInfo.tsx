import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const ContactInfo: React.FC = () => {
  return (
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
  );
};

export default ContactInfo;