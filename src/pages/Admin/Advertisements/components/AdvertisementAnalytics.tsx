import React, { useEffect, useState } from 'react';
import { BarChart, ChevronDown, ChevronUp, Search, TrendingUp, BarChart2, Eye, MousePointerClick } from 'lucide-react';
import { motion } from 'framer-motion';
import advertisementService, { AdvertisementAnalytics } from '../../../../api/services/advertisementService';

const AdvertisementAnalyticsTable: React.FC = () => {
  const [analytics, setAnalytics] = useState<AdvertisementAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const data = await advertisementService.getAllAnalytics();
        setAnalytics(data);
        setError(null);
      } catch (err) {
        setError('ანალიტიკის მონაცემების ჩატვირთვა ვერ მოხერხდა');
        console.error('Error fetching analytics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const getPlacementName = (placement: string): string => {
    switch (placement) {
      case 'home_slider':
        return 'მთავარი გვერდის სლაიდერი';
      case 'home_banner':
        return 'მთავარი გვერდის ბანერი';
      case 'sidebar':
        return 'გვერდითი პანელი';
      case 'car_details_top':
        return 'მანქანის დეტალების გვერდი - ზედა';
      case 'car_details_bottom':
        return 'მანქანის დეტალების გვერდი - ქვედა';
      default:
        return placement;
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Stats cards calculation
  const totalImpressions = analytics.reduce((sum, ad) => sum + ad.impressions, 0);
  const totalClicks = analytics.reduce((sum, ad) => sum + ad.clicks, 0);
  const averageCTR = analytics.length > 0 
    ? (totalClicks / totalImpressions * 100).toFixed(2) 
    : "0.00";
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="w-12 h-12 border-l-2 border-t-2 border-primary rounded-full"
        />
        <p className="ml-4 font-medium text-gray-600">მონაცემების ჩატვირთვა...</p>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 border-l-4 border-red-500 text-red-700 p-5 rounded-lg shadow-sm" 
        role="alert"
      >
        <div className="flex items-center">
          <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="font-medium">{error}</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <motion.div 
          whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.1)' }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-6 flex items-center"
        >
          <div className="bg-blue-100 p-3 rounded-full">
            <Eye className="h-8 w-8 text-blue-600" />
          </div>
          <div className="ml-5">
            <p className="text-sm font-medium text-blue-600">ნახვები</p>
            <p className="text-2xl font-bold text-blue-800">{totalImpressions.toLocaleString()}</p>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(139, 92, 246, 0.1)' }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-md p-6 flex items-center"
        >
          <div className="bg-purple-100 p-3 rounded-full">
            <MousePointerClick className="h-8 w-8 text-purple-600" />
          </div>
          <div className="ml-5">
            <p className="text-sm font-medium text-purple-600">კლიკები</p>
            <p className="text-2xl font-bold text-purple-800">{totalClicks.toLocaleString()}</p>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.1)' }}
          className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl shadow-md p-6 flex items-center"
        >
          <div className="bg-emerald-100 p-3 rounded-full">
            <TrendingUp className="h-8 w-8 text-emerald-600" />
          </div>
          <div className="ml-5">
            <p className="text-sm font-medium text-emerald-600">CTR</p>
            <p className="text-2xl font-bold text-emerald-800">{averageCTR}%</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Table */}
      <motion.div 
        variants={itemVariants}
        className="bg-white overflow-hidden shadow-lg rounded-xl"
      >
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <BarChart2 className="h-5 w-5 mr-2 text-primary" />
              რეკლამების ანალიტიკა
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">ნახვებისა და დაკლიკების სტატისტიკა</p>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input 
              type="text" 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
              placeholder="მოძებნა..." 
            />
          </div>
        </div>

        <div className="shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  სახელი
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  განთავსება
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    ნახვები
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <MousePointerClick className="h-3 w-3 mr-1" />
                    კლიკები
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    CTR
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  სტატუსი
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <BarChart className="h-12 w-12 text-gray-300" />
                      <p className="text-sm">ანალიტიკის მონაცემები არ მოიძებნა</p>
                      <p className="text-xs text-gray-400">დაელოდეთ სანამ რეკლამა განთავსდება</p>
                    </div>
                  </td>
                </tr>
              ) : (
                analytics.map((item, index) => (
                  <motion.tr 
                    key={item.id}
                    variants={itemVariants}
                    className="hover:bg-gray-50 transition-colors duration-150"
                    whileHover={{ backgroundColor: "#f9fafb" }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 overflow-hidden rounded-md shadow-sm bg-gray-100 flex items-center justify-center">
                          {/* Use a placeholder for AdvertisementAnalytics since it doesn't have image_url */}
                          <span className="h-8 w-8 text-gray-400">
                            <BarChart2 className="h-6 w-6" />
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-700">
                        {getPlacementName(item.placement)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-700">
                        {item.impressions.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-700">
                        {item.clicks.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 h-4 bg-gray-200 rounded-full overflow-hidden mr-2">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(item.ctr * 2, 100)}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className={`h-full rounded-full ${item.ctr >= 5 ? 'bg-green-500' : item.ctr >= 2 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{item.ctr}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.is_active ? (
                        <span className="px-3 py-1.5 inline-flex items-center text-xs font-medium rounded-full bg-green-100 text-green-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-600 mr-1.5"></span>
                          აქტიური
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 inline-flex items-center text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-600 mr-1.5"></span>
                          არააქტიური
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdvertisementAnalyticsTable;
