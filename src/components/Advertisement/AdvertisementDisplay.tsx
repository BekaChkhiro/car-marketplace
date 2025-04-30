import React, { useEffect, useState, useRef } from 'react';
import advertisementService, { Advertisement } from '../../api/services/advertisementService';

interface AdvertisementDisplayProps {
  placement: string;
  className?: string;
}

const AdvertisementDisplay: React.FC<AdvertisementDisplayProps> = ({ placement, className = '' }) => {
  const [advertisement, setAdvertisement] = useState<Advertisement | null>(null);
  const [loading, setLoading] = useState(true);
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
        <div className="text-gray-400">იტვირთება...</div>
      </div>
    );
  }

  if (!advertisement) {
    return null; // Don't show anything if no ad is available
  }

  const content = (
    <div className={`relative overflow-hidden ${className}`}>
      <img 
        src={advertisement.image_url} 
        alt={advertisement.title}
        className="w-full h-full object-cover"
      />
      
      {/* Optional label to show it's an advertisement */}
      <div className="absolute top-0 right-0 bg-black bg-opacity-50 text-white text-xs px-2 py-1">
        რეკლამა
      </div>
    </div>
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
