import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const AboutPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  // Set document title on component mount
  useEffect(() => {
    document.title = `${t('aboutUs')} | AutoVend.ge`;
  }, [t]);
  
  return (
    <div className="bg-white py-12">

      <div className="container mx-auto px-4 md:w-[90%]">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">{t('aboutUs')}</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-100">
            <div className="mb-6">
              <p className="mb-2 text-gray-700">{t('companyName')} ს/ნ 436063867;</p>
              <p className="mb-2 text-gray-700">{t('address')} მცხეთის რაიონი, სოფელი მისაქციელი, 1-ლი ქუჩის VII შესახვევი, N10;</p>
              <p className="mb-2 text-gray-700">{t('email')}: <a href="mailto:info@autovend.ge" className="text-primary hover:underline">info@autovend.ge</a></p>
              <p className="mb-2 text-gray-700">{t('contactNumber')}: <a href="tel:+995595038888" className="text-primary hover:underline">595 03 88 88</a></p>
            </div>
            
            <div className="text-gray-700 leading-relaxed">
              <p className="mb-4">
                {t('platformDescription')}
              </p>
              <p className="mb-4">
                {t('vipServices')}
              </p>
              <p>
                {t('advertising')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
