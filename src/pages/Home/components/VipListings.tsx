import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import VipCarsList from './VipCarsList';

const VipListings: React.FC = () => {
  const handleViewAllClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="w-full px-4 sm:px-6 py-8 sm:py-12 bg-gradient-to-b from-gray-50/15 to-background">
      <div className="w-full max-w-[1280px] mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="w-full sm:max-w-xl text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r text-primary">
              VIP განცხადებები
            </h2>
            <p className="text-gray-600">
              გამორჩეული განცხადებები საუკეთესო არჩევანისთვის
            </p>
          </div>
          
          <Link
            to="/cars?filter=vip"
            onClick={handleViewAllClick}
            className="flex items-center justify-center sm:justify-start gap-2 px-4 sm:px-6 py-2 sm:py-3 text-primary font-semibold border-2 border-primary/30 rounded-lg transition-all duration-300 hover:bg-primary/10 hover:-translate-y-0.5 group w-full sm:w-auto"
          >
            ყველა VIP განცხადება <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
        
        {/* SUPER VIP განცხადებები */}
        <VipCarsList vipType="super_vip" limit={4} />
        
        {/* VIP+ განცხადებები */}
        <VipCarsList vipType="vip_plus" limit={4} />
        
        {/* VIP განცხადებები */}
        <VipCarsList vipType="vip" limit={8} />
      </div>
    </section>
  );
};

export default VipListings;