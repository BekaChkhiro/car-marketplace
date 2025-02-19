import React from 'react';
import { Link } from 'react-router-dom';
import { FaCar, FaDollarSign, FaStar, FaArrowRight, FaClock, FaTrophy, FaShieldAlt } from 'react-icons/fa';

const categories = [
  {
    id: 'new',
    title: 'ახალი ავტომობილები',
    description: 'აღმოაჩინეთ უახლესი მოდელები თანამედროვე ფუნქციებით და დიზაინით',
    icon: <FaCar />,
    link: '/cars?category=new',
    stats: [
      { value: '2024', label: 'მოდელები' },
      { value: '100+', label: 'ხელმისაწვდომი' }
    ]
  },
  {
    id: 'budget',
    title: 'ეკონომიური',
    description: 'იპოვეთ საუკეთესო ფასის მქონე საიმედო ავტომობილები',
    icon: <FaDollarSign />,
    link: '/cars?category=budget',
    stats: [
      { value: '500+', label: 'მანქანა' },
      { value: '30%', label: 'დაზოგვა' }
    ]
  },
  {
    id: 'luxury',
    title: 'პრემიუმ კლასი',
    description: 'გამოცადეთ ლუქსი და მაღალი წარმადობა პრემიუმ კლასის ავტომობილებით',
    icon: <FaTrophy />,
    link: '/cars?category=luxury',
    stats: [
      { value: '50+', label: 'ბრენდი' },
      { value: '4.9', label: 'შეფასება' }
    ]
  }
];

const FeaturedCategories: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background via-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
            იპოვეთ თქვენი იდეალური ავტომობილი
          </h2>
          <p className="text-lg text-secondary">
            დაათვალიერეთ ჩვენი გულდასმით შერჩეული კატეგორიები და იპოვეთ თქვენზე მორგებული ავტომობილი
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.link}
              className="group relative flex flex-col p-8 bg-white rounded-3xl shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl overflow-hidden border border-gray-100"
            >
              <div className="relative before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-primary before:to-primary-dark before:scale-x-0 before:transition-transform before:duration-300 group-hover:before:scale-x-100">
                <div className="w-24 h-24 mb-8 flex items-center justify-center rounded-2xl bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary-dark">
                  <div className="text-3xl text-primary group-hover:text-white transition-colors duration-300">
                    {category.icon}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center justify-between">
                  {category.title}
                  <FaArrowRight className="text-lg text-primary opacity-0 transform transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-2" />
                </h3>

                <p className="text-secondary mb-10 line-clamp-2 text-lg">
                  {category.description}
                </p>

                <div className="grid grid-cols-2 gap-6 mt-auto">
                  {category.stats.map((stat, index) => (
                    <div key={index} className="text-center p-4 bg-gray-50 rounded-xl group-hover:bg-primary/5 transition-colors duration-300">
                      <div className="text-xl font-bold text-primary mb-2">{stat.value}</div>
                      <div className="text-sm text-secondary">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;