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
          <h1 className="text-3xl font-bold mb-8 text-gray-800">ჩვენს შესახებ</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-100">
            <div className="mb-6">
              <p className="mb-2 text-gray-700">შპს „ბიგ ვეი" ს/ნ 436063867;</p>
              <p className="mb-2 text-gray-700">მისამართი: მცხეთის რაიონი, სოფელი მისაქციელი, 1-ლი ქუჩის VII შესახვევი, N10;</p>
              <p className="mb-2 text-gray-700">ელ. ფოსტა: <a href="mailto:info@autovend.ge" className="text-primary hover:underline">info@autovend.ge</a></p>
              <p className="mb-2 text-gray-700">საკონტაქტო ნომერი: <a href="tel:+995595038888" className="text-primary hover:underline">595 03 88 88</a></p>
            </div>
            
            <div className="text-gray-700 leading-relaxed">
              <p className="mb-4">
                www.autovend.ge არის განცხადებების განსათავსებელი პლატფორმა, სადაც სრულიად
                უფასოდ შეძლებთ ავტომანქანებისა და სათადარიგო ნაწილების სწრაფად და მარტივად
                გაყიდვის მიზნით განცხადებების განთავსებას.
              </p>
              <p className="mb-4">
                ასევე, სურვილის შემთხვევაში შესაძლებლობა გექნებათ ისარგებლოთ ფასიანი VIP 
                განცხადებების განთავსების სერვისით.
              </p>
              <p>
                პლატფორმაზე თქვენი ბიზნესისა თუ საქმიანობის პოპულარიზაციის მიზნით
                შეგიძლიათ განათავსოთ რეკლამა.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
