import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import advertisementService, { Advertisement } from '../../api/services/advertisementService';

interface AdvertisementDisplayProps {
  placement: string;
  className?: string;
}

const AdvertisementDisplay: React.FC<AdvertisementDisplayProps> = ({ placement, className = '' }) => {
  const { t } = useTranslation('common');
  const [advertisement, setAdvertisement] = useState<Advertisement | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  // Add a timestamp to force re-fetch on each mount
  const refreshKey = useRef(Date.now()).current;

  useEffect(() => {
    // Function to fetch a random advertisement
    const fetchAdvertisement = async () => {
      try {
        // Handle backward compatibility for car_details placement
        let placementValues = [placement];
        
        // For the top banner position, also check the old general car_details placement
        if (placement === 'car_details_top') {
          placementValues.push('car_details');
        }
        // For the bottom banner position, also check the old general car_details placement
        else if (placement === 'car_details_bottom') {
          placementValues.push('car_details');
        }
        
        // Get ads for all relevant placements
        let allAds: Advertisement[] = [];
        
        // Fetch ads for each placement value
        for (const placementValue of placementValues) {
          const adsForPlacement = await advertisementService.getByPlacement(placementValue);
          if (adsForPlacement && adsForPlacement.length > 0) {
            allAds = [...allAds, ...adsForPlacement];
          }
        }
        
        // Randomly select one advertisement from all available ads
        if (allAds.length > 0) {
          // Get a random index between 0 and allAds.length-1
          const randomIndex = Math.floor(Math.random() * allAds.length);
          // Set the randomly selected advertisement
          const selectedAd = allAds[randomIndex];
          setAdvertisement(selectedAd);
          console.log(`Selected advertisement ${randomIndex + 1} of ${allAds.length} for placement ${placement}`);
          
          // Record impression when ad is loaded
          if (selectedAd && selectedAd.id) {
            try {
              advertisementService.recordImpression(selectedAd.id);
              console.log(`Recorded impression for ad id ${selectedAd.id}`);
            } catch (error) {
              console.error('Error recording impression:', error);
            }
          }
        } else {
          console.log(`No advertisements found for placement ${placement}`);
        }
      } catch (error) {
        console.error(`Error fetching advertisement for placement ${placement}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertisement();
    
    // This effect should run on:
    // 1. Initial mount
    // 2. When placement changes
    // 3. The refreshKey is regenerated on each component mount
  }, [placement, refreshKey]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 animate-pulse ${className}`}>
        <div className="text-gray-400">{t('loading')}</div>
      </div>
    );
  }

  if (!advertisement) {
    // Display placeholder with "რეკლამა" text and phone number when no ad is available
    const placeholderContent = (
      <div className={`flex flex-col items-center justify-center bg-[#009c6d] ${className} cursor-pointer transition-transform duration-300 hover:scale-[1.02]`} style={{ minHeight: '150px', padding: '20px' }}>
        <div className="text-white font-medium text-xl">რეკლამა</div>
        <div className="text-white text-md mt-2">+995 595 03 88 88</div>
      </div>
    );
    
    // Make the placeholder clickable to navigate to an advertisement page
    return (
      <a 
        href="/advertisements" 
        target="_blank" 
        rel="noopener noreferrer"
        className="block"
        onClick={() => console.log('Advertisement placeholder clicked')}
      >
        {placeholderContent}
      </a>
    );
  }
  
  const content = (
    <motion.div 
      className={`relative overflow-hidden ${className} cursor-pointer`}
      initial={{ opacity: 0.9 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.01, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <img 
        src={advertisement.image_url} 
        alt={advertisement.title}
        className="w-full h-full object-cover transition-transform duration-700 ease-in-out"
        style={{ 
          transform: isHovered ? 'scale(1.03)' : 'scale(1)' 
        }}
      />
      
      {/* Subtle overlay effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Advertisement badge removed as requested */}
    </motion.div>
  );

  // Function to record click
  const handleAdClick = () => {
    if (advertisement && advertisement.id) {
      try {
        advertisementService.recordClick(advertisement.id);
        console.log(`Recorded click for ad id ${advertisement.id}`);
      } catch (error) {
        console.error('Error recording click:', error);
      }
    }
  };

  return advertisement.link_url ? (
    <a 
      href={advertisement.link_url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block"
      onClick={handleAdClick}
    >
      {content}
    </a>
  ) : (
    content
  );
};

export default AdvertisementDisplay;
