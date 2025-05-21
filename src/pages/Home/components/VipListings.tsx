import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import VipCarousel from './VipCarousel';

const VipListings: React.FC = () => {
  const handleViewAllClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="w-full py-8 sm:py-12">
      <div className="w-full px-4 mx-auto">
        
        
        {/* SUPER VIP განცხადებები */}
        <VipCarousel vipType="super_vip" limit={8} />
        
        {/* VIP+ განცხადებები */}
        <div>
        <VipCarousel vipType="vip_plus" limit={8} />
        </div>
        
        {/* VIP განცხადებები */}
        <div>
        <VipCarousel vipType="vip" limit={12} />
        </div>
      </div>
    </section>
  );
};

export default VipListings;