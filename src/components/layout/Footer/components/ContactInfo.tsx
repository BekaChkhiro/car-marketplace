import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const ContactInfo: React.FC = () => {
  return (
    <div>
      <h3 className="text-xl font-bold mb-6 text-primary">საკონტაქტო ინფორმაცია</h3>
      <ul className="flex flex-col gap-4">
        <li>
          <div className="flex items-center gap-4 text-gray-dark hover:text-primary transition-colors">
            <MapPin className="text-primary" size={20} />
            <span>მცხეთის რაიონი, სოფელი მისაქციელი, 1-ლი ქუჩის VII შესახვევი, N10</span>
          </div>
        </li>
        <li>
          <div className="flex items-center gap-4 text-gray-dark hover:text-primary transition-colors">
            <Phone className="text-primary" size={20} />
            <span>+995 595 03 88 88</span>
          </div>
        </li>
        <li>
          <div className="flex items-center gap-4 text-gray-dark hover:text-primary transition-colors">
            <Mail className="text-primary" size={20} />
            <span>info@autovend.ge</span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default ContactInfo;