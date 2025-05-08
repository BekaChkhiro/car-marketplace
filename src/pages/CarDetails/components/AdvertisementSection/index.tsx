import React from 'react';
import { ExternalLink, Megaphone } from 'lucide-react';

const AdvertisementSection: React.FC = () => {
  return (
    <div className="mt-8 bg-white rounded-xl shadow-md p-6 border border-green-100 car-detail-card">
      <div className="flex justify-between items-center mb-6 pb-3 border-b border-green-100">
        <div className="flex items-center">
          <Megaphone className="w-6 h-6 text-primary mr-3" />
          <h2 className="text-xl font-bold text-gray-800">რეკლამა</h2>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 ad-card">
          <div className="relative">
            <div className="absolute top-2 right-2 bg-white/80 text-primary text-xs font-medium px-2 py-1 rounded-full">სპონსორი</div>
            <div className="h-40 bg-gradient-to-r from-green-100 to-green-50 flex items-center justify-center">
              <img src="https://via.placeholder.com/400x200?text=Car+Service" alt="Car Service Ad" className="object-cover w-full h-full" />
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-800 mb-2">ავტომობილის სერვისი - 20% ფასდაკლება</h3>
            <p className="text-gray-600 text-sm mb-3">დაზოგეთ თქვენი მანქანა ჩვენთან და მიიღეთ საუკეთესო ფასდაკლება ყველა სერვისზე.</p>
            <a href="#" className="text-primary hover:text-green-700 transition-colors flex items-center text-sm font-medium">
              დეტალურად
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 ad-card">
          <div className="relative">
            <div className="absolute top-2 right-2 bg-white/80 text-primary text-xs font-medium px-2 py-1 rounded-full">სპონსორი</div>
            <div className="h-40 bg-gradient-to-r from-green-100 to-green-50 flex items-center justify-center">
              <img src="https://via.placeholder.com/400x200?text=Car+Insurance" alt="Car Insurance Ad" className="object-cover w-full h-full" />
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-800 mb-2">ავტოდაზღვევა საუკეთესო პირობებით</h3>
            <p className="text-gray-600 text-sm mb-3">მიიღეთ სრული დაზღვევა თქვენი მანქანისთვის საუკეთესო ფასად.</p>
            <a href="#" className="text-primary hover:text-green-700 transition-colors flex items-center text-sm font-medium">
              დეტალურად
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvertisementSection;
