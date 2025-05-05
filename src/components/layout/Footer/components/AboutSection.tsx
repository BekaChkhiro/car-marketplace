import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <div>
      <h3 className="text-xl font-bold mb-6 text-primary">ჩვენს შესახებ</h3>
      <p className="text-gray-dark leading-relaxed mb-6">
        CarMarket არის თქვენი სანდო პლატფორმა საქართველოში ავტომობილების ყიდვა-გაყიდვისთვის. 
        ჩვენ გთავაზობთ მარტივ გამოცდილებას ყველა თქვენი საავტომობილო საჭიროებისთვის.
      </p>
      
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-6 text-primary">სიახლეების გამოწერა</h3>
        <p className="text-gray-dark mb-4">გამოიწერეთ სიახლეები და მიიღეთ სპეციალური შეთავაზებები</p>
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            placeholder="შეიყვანეთ იმეილი"
            className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-dark placeholder:text-gray-400 focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="whitespace-nowrap px-4 py-2 bg-primary text-white rounded-xl hover:bg-secondary transition-all duration-200 transform hover:scale-105"
          >
            გამოწერა
          </button>
        </form>
      </div>
    </div>
  );
};

export default AboutSection;