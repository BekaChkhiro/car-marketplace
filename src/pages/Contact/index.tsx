import React from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';

const ContactPage: React.FC = () => {

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">დაგვიკავშირდით</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">გაქვთ შეკითხვები? გთხოვთ, დაგვიკავშირდეთ ქვემოთ მოცემული საკონტაქტო ინფორმაციის გამოყენებით.</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Contact Information */}
            <div className="bg-primary text-white p-8 md:p-12">
              <h2 className="text-2xl font-bold mb-6 text-white">საკონტაქტო ინფორმაცია</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 mr-4 mt-1 flex-shrink-0" />
                  <p className="text-white/90">
                    მცხეთის რაიონი, სოფელი მისაქციელი, 1-ლი ქუჩის VII შესახვევი, N10
                  </p>
                </div>
                
                <div className="flex items-center">
                  <Mail className="w-6 h-6 mr-4 flex-shrink-0" />
                  <a href="mailto:info@autovend.ge" className="text-white/90 hover:text-white transition-colors">
                    info@autovend.ge
                  </a>
                </div>
                
                <div className="flex items-center">
                  <Phone className="w-6 h-6 mr-4 flex-shrink-0" />
                  <a href="tel:+995595038888" className="text-white/90 hover:text-white transition-colors">
                    +995 595 03 88 88
                  </a>
                </div>
              </div>
              

            </div>
            
            {/* Map */}
            <div className="h-[400px] md:h-auto">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2972.6970352872837!2d44.71344!3d41.84532!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDUwJzQzLjIiTiA0NMKwNDInNDguNCJF!5e0!3m2!1sen!2sge!4v1623825837691!5m2!1sen!2sge" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy"
                title="Company Location"
              ></iframe>
            </div>
          </div>
        </div>
        
        {/* Additional Contact Methods */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">ტელეფონი</h3>
            <a href="tel:+995595038888" className="text-primary font-medium hover:underline">
                +995 595 03 88 88
            </a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">ელ-ფოსტა</h3>
            <a href="mailto:info@autovend.ge" className="text-primary font-medium hover:underline">
              info@autovend.ge
            </a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">მისამართი</h3>
            <p className="text-primary font-medium">
              მცხეთის რაიონი, სოფელი მისაქციელი, 1-ლი ქუჩის VII შესახვევი, N10
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
