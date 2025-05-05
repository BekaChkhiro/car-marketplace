import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import advertisementService, { Advertisement } from '../../../api/services/advertisementService';

const FeaturedSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch advertisements for home slider
  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        const ads = await advertisementService.getByPlacement('home_slider');
        if (ads && ads.length > 0) {
          setAdvertisements(ads);
        } else {
          console.log('No slider advertisements found');
        }
      } catch (error) {
        console.error('Error fetching slider advertisements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertisements();
  }, []);
  
  const nextSlide = () => {
    if (advertisements.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % advertisements.length);
  };

  const prevSlide = () => {
    if (advertisements.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + advertisements.length) % advertisements.length);
  };
  
  // Auto-advance slides every 5 seconds
  useEffect(() => {
    if (advertisements.length <= 1) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [advertisements.length, currentSlide]);

  if (loading) {
    return (
      <section className="h-full bg-gray-100 rounded-2xl flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 w-48 bg-gray-300 rounded"></div>
        </div>
      </section>
    );
  }

  if (advertisements.length === 0) {
    return (
      <section className="h-full bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-2">გამოყოფილი მანქანებისთვის ადგილი</h2>
          <p className="text-gray-600">აქ მალე განთავსდება რეკლამები.</p>
        </div>
      </section>
    );
  }
  
  return (
    <section className="h-full">
      <div className="w-full h-full">
        <div className="relative h-full">
          <div className="overflow-hidden rounded-2xl h-full">
            <div 
              className="flex h-full transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {advertisements.map((ad, index) => (
                <div
                  key={ad.id || index}
                  className="w-full h-full flex-shrink-0"
                >
                  {ad.link_url ? (
                    <Link to={ad.link_url} className="w-full h-full block">
                      <div 
                        className="w-full h-full bg-cover bg-center flex flex-col justify-end"
                        style={{ backgroundImage: `url(${ad.image_url})` }}
                      >
                        <div className="bg-black bg-opacity-50 p-4 text-white">
                          <h3 className="text-xl font-bold">{ad.title}</h3>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div 
                      className="w-full h-full bg-cover bg-center flex flex-col justify-end"
                      style={{ backgroundImage: `url(${ad.image_url})` }}
                    >
                      <div className="bg-black bg-opacity-50 p-4 text-white">
                        <h3 className="text-xl font-bold">{ad.title}</h3>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {advertisements.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-primary hover:bg-white hover:scale-110 transition-all duration-200"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-primary hover:bg-white hover:scale-110 transition-all duration-200"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {advertisements.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentSlide === index ? 'bg-primary w-8' : 'bg-white hover:bg-white/90'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
          
          {/* Advertisement badge removed as requested */}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSlider;