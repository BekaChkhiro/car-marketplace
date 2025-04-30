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
      <div className="overflow-x-auto">
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
      </div>
    </motion.div>
  );
};

export default AdvertisementsList;
