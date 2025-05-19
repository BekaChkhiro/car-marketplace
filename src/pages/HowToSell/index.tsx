import React from 'react';
import { Container } from '../../components/ui';
import { Link } from 'react-router-dom';
import { ArrowRight, UserPlus, CarIcon, Upload, Check } from 'lucide-react';

const HowToSell = () => {
  return (
    <div className="bg-background min-h-screen rounded-lg p-4">
      {/* Hero Section */}
      <div className="bg-primary py-8 md:py-12 rounded-lg">
        <Container>
          <div className="max-w-3xl mx-auto text-center text-white px-4 md:px-0">
            <h1 className="text-xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 text-white leading-tight">
              გაყიდეთ თქვენი მანქანა მარტივად
            </h1>
            <p className="text-sm sm:text-md md:text-lg opacity-90 mb-6 md:mb-8">
              მხოლოდ რამდენიმე მარტივი ნაბიჯი გაშორებთ თქვენი მანქანის წარმატებულ გაყიდვამდე
            </p>
            <Link
              to="/profile/add-car"
              className="inline-flex items-center px-5 py-2.5 md:px-6 md:py-3 bg-white text-primary rounded-lg hover:bg-opacity-90 transition-all duration-300 text-sm md:text-base font-medium"
            >
              დაიწყეთ განცხადების დამატება
              <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 ml-1.5 md:ml-2" />
            </Link>
          </div>
        </Container>
      </div>

      {/* Steps Section */}
      <Container>
        <div className="p-4 md:p-8 lg:p-16">
          <div className="w-full">
            {/* First Row */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-4 md:mb-8">
              {/* Step 1 */}
              <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-greenLight flex items-center justify-center flex-shrink-0">
                    <UserPlus className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs md:text-sm text-primary font-medium mb-0.5 md:mb-1">ნაბიჯი 1</div>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900">დარეგისტრირდით</h3>
                  </div>
                </div>
                <p className="text-sm md:text-base text-grayDark mb-3 md:mb-4">
                  შექმენით ანგარიში ან გაიარეთ ავტორიზაცია თუ უკვე ხართ დარეგისტრირებული.
                  რეგისტრაცია საჭიროა მანქანის განცხადების დასამატებლად.
                </p>
                <Link 
                  to="/register" 
                  className="inline-flex items-center text-primary hover:text-secondary font-medium text-sm md:text-base"
                >
                  რეგისტრაცია
                  <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 ml-1" />
                </Link>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-greenLight flex items-center justify-center flex-shrink-0">
                    <CarIcon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs md:text-sm text-primary font-medium mb-0.5 md:mb-1">ნაბიჯი 2</div>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900">შეავსეთ ინფორმაცია</h3>
                  </div>
                </div>
                <p className="text-sm md:text-base text-grayDark mb-3 md:mb-4">
                  მიუთითეთ მანქანის დეტალური ინფორმაცია: მარკა, მოდელი, წელი, გარბენი და ფასი.
                  დეტალური ინფორმაცია ზრდის გაყიდვის შანსს.
                </p>
              </div>
            </div>

            {/* Second Row */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              {/* Step 3 */}
              <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-greenLight flex items-center justify-center flex-shrink-0">
                    <Upload className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs md:text-sm text-primary font-medium mb-0.5 md:mb-1">ნაბიჯი 3</div>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900">დაამატეთ ფოტოები</h3>
                  </div>
                </div>
                <p className="text-sm md:text-base text-grayDark mb-3 md:mb-4">
                  ატვირთეთ მაღალი ხარისხის ფოტოები სხვადასხვა კუთხიდან.
                  კარგი ფოტოები მნიშვნელოვნად ზრდის მყიდველის დაინტერესებას.
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-greenLight flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs md:text-sm text-primary font-medium mb-0.5 md:mb-1">ნაბიჯი 4</div>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900">გამოაქვეყნეთ</h3>
                  </div>
                </div>
                <p className="text-sm md:text-base text-grayDark mb-3 md:mb-4">
                  შეამოწმეთ ინფორმაცია და გამოაქვეყნეთ განცხადება.
                  თქვენი მანქანა გამოჩნდება საიტზე და დაინტერესებული მყიდველები დაგიკავშირდებიან.
                </p>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="text-center mt-8 md:mt-12">
              <Link
                to="/profile/add-car"
                className="inline-flex items-center px-6 py-3 md:px-8 md:py-4 bg-primary text-white rounded-lg hover:bg-secondary transition-all duration-300 text-sm font-semibold"
              >
                დაიწყეთ მანქანის დამატება
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HowToSell;