import React from 'react';
import { Container } from '../../components/ui';
import { Link } from 'react-router-dom';
import { ArrowRight, UserPlus, CarIcon, Upload, Check } from 'lucide-react';

const HowToSell = () => {
  return (
    <div className="bg-background min-h-screen rounded-lg p-4">
      {/* Hero Section */}
      <div className="bg-primary py-12 rounded-lg">
        <Container>
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              გაყიდეთ თქვენი მანქანა მარტივად
            </h1>
            <p className="text-lg opacity-90 mb-8">
              მხოლოდ რამდენიმე მარტივი ნაბიჯი გაშორებთ თქვენი მანქანის წარმატებულ გაყიდვამდე
            </p>
            <Link
              to="/profile/add-car"
              className="inline-flex items-center px-6 py-3 bg-white text-primary rounded-lg hover:bg-opacity-90 transition-all duration-300 text-base font-medium"
            >
              დაიწყეთ განცხადების დამატება
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </Container>
      </div>

      {/* Steps Section */}
      <Container>
        <div className="p-16">
          <div className="w-full">
            {/* First Row */}
            <div className="w-full flex flex-wrap gap-8 mb-8">
              {/* Step 1 */}
              <div className="flex-1 bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-greenLight flex items-center justify-center flex-shrink-0">
                    <UserPlus className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-primary font-medium mb-1">ნაბიჯი 1</div>
                    <h3 className="text-xl font-semibold text-gray-900">დარეგისტრირდით</h3>
                  </div>
                </div>
                <p className="text-grayDark mb-4">
                  შექმენით ანგარიში ან გაიარეთ ავტორიზაცია თუ უკვე ხართ დარეგისტრირებული.
                  რეგისტრაცია საჭიროა მანქანის განცხადების დასამატებლად.
                </p>
                <Link 
                  to="/register" 
                  className="inline-flex items-center text-primary hover:text-secondary font-medium"
                >
                  რეგისტრაცია
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              {/* Step 2 */}
              <div className="flex-1 bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-greenLight flex items-center justify-center flex-shrink-0">
                    <CarIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-primary font-medium mb-1">ნაბიჯი 2</div>
                    <h3 className="text-xl font-semibold text-gray-900">შეავსეთ ინფორმაცია</h3>
                  </div>
                </div>
                <p className="text-grayDark mb-4">
                  მიუთითეთ მანქანის დეტალური ინფორმაცია: მარკა, მოდელი, წელი, გარბენი და ფასი.
                  დეტალური ინფორმაცია ზრდის გაყიდვის შანსს.
                </p>
              </div>
            </div>

            {/* Second Row */}
            <div className="w-full flex flex-wrap gap-8">
              {/* Step 3 */}
              <div className="flex-1 bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-greenLight flex items-center justify-center flex-shrink-0">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-primary font-medium mb-1">ნაბიჯი 3</div>
                    <h3 className="text-xl font-semibold text-gray-900">დაამატეთ ფოტოები</h3>
                  </div>
                </div>
                <p className="text-grayDark mb-4">
                  ატვირთეთ მაღალი ხარისხის ფოტოები სხვადასხვა კუთხიდან.
                  კარგი ფოტოები მნიშვნელოვნად ზრდის მყიდველის დაინტერესებას.
                </p>
              </div>

              {/* Step 4 */}
              <div className="flex-1 bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-greenLight flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-primary font-medium mb-1">ნაბიჯი 4</div>
                    <h3 className="text-xl font-semibold text-gray-900">გამოაქვეყნეთ</h3>
                  </div>
                </div>
                <p className="text-grayDark mb-4">
                  შეამოწმეთ ინფორმაცია და გამოაქვეყნეთ განცხადება.
                  თქვენი მანქანა გამოჩნდება საიტზე და დაინტერესებული მყიდველები დაგიკავშირდებიან.
                </p>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="text-center mt-12">
              <Link
                to="/profile/add-car"
                className="inline-flex items-center px-8 py-4 bg-primary text-white rounded-lg hover:bg-secondary transition-all duration-300 text-sm font-semibold"
              >
                დაიწყეთ მანქანის დამატება
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HowToSell;