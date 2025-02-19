import React from 'react';
import { Link } from 'react-router-dom';
import { FaCar, FaDollarSign, FaStar, FaArrowRight, FaClock, FaTrophy, FaShieldAlt } from 'react-icons/fa';

const categories = [
  {
    id: 'new',
    title: 'New Cars',
    description: 'Explore the latest models with cutting-edge features and modern design',
    icon: <FaCar />,
    link: '/cars?category=new',
    stats: [
      { value: '2024', label: 'Models' },
      { value: '100+', label: 'Available' }
    ]
  },
  {
    id: 'budget',
    title: 'Budget Friendly',
    description: 'Find reliable cars that offer the best value for your money',
    icon: <FaDollarSign />,
    link: '/cars?category=budget',
    stats: [
      { value: '500+', label: 'Cars' },
      { value: '30%', label: 'Savings' }
    ]
  },
  {
    id: 'luxury',
    title: 'Premium Cars',
    description: 'Experience luxury and performance with top-tier vehicles',
    icon: <FaTrophy />,
    link: '/cars?category=luxury',
    stats: [
      { value: '50+', label: 'Brands' },
      { value: '4.9', label: 'Rating' }
    ]
  }
];

const FeaturedCategories: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
            Find Your Perfect Match
          </h2>
          <p className="text-lg text-secondary">
            Explore our carefully curated categories to find the vehicle that perfectly suits your needs and preferences
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.link}
              className="group relative flex flex-col p-8 bg-white rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl overflow-hidden"
            >
              <div className="relative before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-primary before:to-primary-dark before:scale-x-0 before:transition-transform before:duration-300 group-hover:before:scale-x-100">
                <div className="w-20 h-20 mb-8 flex items-center justify-center rounded-full bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary-dark">
                  <div className="text-2xl text-primary group-hover:text-white transition-colors duration-300">
                    {category.icon}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center justify-between">
                  {category.title}
                  <FaArrowRight className="text-base text-primary opacity-0 transform transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1" />
                </h3>

                <p className="text-secondary mb-8 line-clamp-2">
                  {category.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mt-auto">
                  {category.stats.map((stat, index) => (
                    <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-primary mb-1">{stat.value}</div>
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