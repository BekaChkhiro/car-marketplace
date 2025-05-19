import React from 'react';
import { Edit, Trash, ExternalLink, Eye, Clock, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Advertisement } from '../../../../api/services/advertisementService';

interface AdvertisementsListProps {
  advertisements: Advertisement[];
  onEdit: (advertisement: Advertisement) => void;
  onDelete: (id: number) => void;
}

const AdvertisementsList: React.FC<AdvertisementsListProps> = ({
  advertisements,
  onEdit,
  onDelete,
}) => {
  const getPlacementName = (placement: string) => {
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
      case 'car_details':
        return 'მანქანის დეტალების გვერდი';
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
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  if (advertisements.length === 0) {
    return (
      <motion.div 
        className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200 border-dashed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Eye className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">რეკლამები არ არის</h3>
          <p className="text-gray-500 max-w-sm">დაამატეთ პირველი რეკლამა რომ დაიწყოთ კამპანიის მართვა.</p>
        </div>
      </motion.div>
    );
  }
  return (
    <motion.div 
      className="overflow-hidden rounded-lg shadow"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Desktop Table View (hidden on mobile) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                რეკლამა
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                განთავსების ადგილი
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  პერიოდი
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                სტატუსი
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                მოქმედებები
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {advertisements.map((advertisement, index) => {
              const isActive = advertisement.is_active && 
                new Date(advertisement.start_date) <= new Date() && 
                new Date(advertisement.end_date) >= new Date();
              
              return (
                <motion.tr 
                  key={advertisement.id}
                  variants={itemVariants}
                  className="hover:bg-gray-50 transition-colors duration-150"
                  whileHover={{ backgroundColor: "#f9fafb" }}
                >
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 relative overflow-hidden rounded-md shadow-sm">
                        <motion.img 
                          whileHover={{ scale: 1.1 }} 
                          className="h-12 w-12 object-cover" 
                          src={advertisement.image_url} 
                          alt={advertisement.title} 
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {advertisement.title}
                        </div>
                        {advertisement.link_url && (
                          <a
                            href={advertisement.link_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:text-blue-700 flex items-center mt-1"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            <span className="truncate max-w-[200px]">{advertisement.link_url}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm text-gray-700 font-medium">
                      {getPlacementName(advertisement.placement)}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-sm text-gray-700">
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                          დაწყება
                        </span>
                        <span className="ml-2">
                          {new Date(advertisement.start_date).toLocaleDateString('ka-GE')}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md">
                          დასრულება
                        </span>
                        <span className="ml-2">
                          {new Date(advertisement.end_date).toLocaleDateString('ka-GE')}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    {isActive ? (
                      <span className="px-3 py-1.5 inline-flex items-center text-xs font-medium rounded-full bg-green-100 text-green-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-600 mr-1.5"></span>
                        აქტიური
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 inline-flex items-center text-xs font-medium rounded-full bg-red-100 text-red-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 mr-1.5"></span>
                        არააქტიური
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.15, color: '#4f46e5' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onEdit(advertisement)}
                        className="text-indigo-500 hover:text-indigo-700 transition-colors duration-200"
                      >
                        <Edit className="h-5 w-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.15, color: '#f43f5e' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onDelete(advertisement.id)}
                        className="text-red-500 hover:text-red-700 transition-colors duration-200"
                      >
                        <Trash className="h-5 w-5" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>      {/* Mobile Card View (shown only on mobile) */}
      <div className="md:hidden">
        <div className="grid gap-4 p-4">
          {advertisements.map((advertisement) => {
            const isActive = advertisement.is_active && 
              new Date(advertisement.start_date) <= new Date() && 
              new Date(advertisement.end_date) >= new Date();
            
            return (
              <motion.div
                key={advertisement.id}
                variants={itemVariants}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
                whileHover={{ 
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" 
                }}
              >
                <div className="p-4 space-y-4">
                  {/* Advertisement Header with Status Badge */}
                  <div className="flex items-center gap-3">
                    <div className="h-16 w-16 relative overflow-hidden rounded-lg shadow-sm flex-shrink-0">
                      <motion.img
                        whileHover={{ scale: 1.1 }}
                        className="h-16 w-16 object-cover"
                        src={advertisement.image_url}
                        alt={advertisement.title}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="text-base font-medium text-gray-900 truncate mb-1">
                          {advertisement.title}
                        </h3>
                        <div className="ml-2 flex-shrink-0">
                          {isActive ? (
                            <span className="px-2.5 py-1 inline-flex items-center text-xs font-medium rounded-full bg-green-100 text-green-800">
                              <span className="w-2 h-2 rounded-full bg-green-600 mr-1.5"></span>
                              აქტიური
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 inline-flex items-center text-xs font-medium rounded-full bg-red-100 text-red-800">
                              <span className="w-2 h-2 rounded-full bg-red-600 mr-1.5"></span>
                              არააქტიური
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {advertisement.link_url && (
                        <a
                          href={advertisement.link_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-500 hover:text-blue-700 flex items-center mt-1"
                        >
                          <ExternalLink className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                          <span className="truncate">{advertisement.link_url}</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Advertisement Details */}
                  <div className="mt-1 bg-gray-50 rounded-md p-3 space-y-4">
                    {/* Placement */}
                    <div className="flex items-center justify-between">
                      <div className="w-1/3 text-xs font-semibold text-gray-500 uppercase tracking-wider pt-1">
                        განთავსების ადგილი
                      </div>
                      <div className="w-1/3 text-xs text-gray-800 font-medium">
                        {getPlacementName(advertisement.placement)}
                      </div>
                    </div>

                    {/* Period */}
                    <div className="space-y-2">
                      <div className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <Calendar className="mr-1.5 h-3.5 w-3.5" />
                        პერიოდი
                      </div>
                      <div className="bg-white rounded-md p-2 divide-y divide-gray-100">
                        <div className="flex items-center justify-between py-1.5">
                          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-medium">დაწყება</span>
                          <span className="text-sm text-gray-700 font-medium">
                            {new Date(advertisement.start_date).toLocaleDateString('ka-GE')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-1.5 pt-2">
                          <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-md font-medium">დასრულება</span>
                          <span className="text-sm text-gray-700 font-medium">
                            {new Date(advertisement.end_date).toLocaleDateString('ka-GE')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 pt-3 flex justify-between border-t border-gray-200 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => onEdit(advertisement)}
                      className="flex-1 flex items-center justify-center px-4 py-2.5 rounded-md bg-indigo-50 text-indigo-700 font-medium shadow-sm hover:bg-indigo-100 transition-colors"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => onDelete(advertisement.id)}
                      className="flex-1 flex items-center justify-center px-4 py-2.5 rounded-md bg-red-50 text-red-700 font-medium shadow-sm hover:bg-red-100 transition-colors"
                    >
                      <Trash className="h-4 w-4 mr-2" />
                    
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default AdvertisementsList;