import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import VipCarousel from './VipCarousel';
import { useTranslation } from 'react-i18next';

const VipListings: React.FC = () => {
  const { t } = useTranslation('home');
  
  const handleViewAllClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="w-full pt-6 sm:pt-12">
      <div className="w-full px-0 sm:px-4 mx-auto">
        
        
        {/* Super VIP Listings */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 px-2">{t('superVipListings')}</h2>
          <VipCarousel vipType="super_vip" limit={8} />
        </div>
        
        {/* VIP+ Listings */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 px-2">{t('vipPlusListings')}</h2>
          <VipCarousel vipType="vip_plus" limit={8} />
        </div>
        
        {/* VIP Listings */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4 px-2">{t('vipListings')}</h2>
          <VipCarousel vipType="vip" limit={12} />
        </div>
      </div>
    </section>
  );
};

export default VipListings;