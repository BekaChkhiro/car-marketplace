import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Plus, BarChart2, Edit, Trash, ExternalLink, LayoutGrid, Rows, SlidersHorizontal, PanelRight } from 'lucide-react';
import { routes } from '../../../config/routes';
import { motion } from 'framer-motion';
import advertisementService, { Advertisement } from '../../../api/services/advertisementService';
import AdvertisementForm from './components/AdvertisementForm';
import AdvertisementAnalyticsTable from './components/AdvertisementAnalytics';
import { useTranslation } from 'react-i18next';
import { getLanguageFromUrl } from '../../../i18n';

const AdvertisementsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { t } = useTranslation('admin');
  const currentLanguage = getLanguageFromUrl();

  // States for managing ads and UI
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [filteredAds, setFilteredAds] = useState<Advertisement[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAdvertisement, setCurrentAdvertisement] = useState<Advertisement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Helper function to check if we're on a specific route
  const isRoute = (path: string) => currentPath.includes(path);
  
  // Helper function to determine if we should show "Add" button
  const shouldShowAddButton = () => {
    return !currentPath.includes('analytics');
  };
  
  // Get button text based on current route
  const getAddButtonText = () => {
    if (currentPath.includes('slider')) {
      return t('advertisements.addSlider');
    } else if (currentPath.includes('banners')) {
      return t('advertisements.addBanner');
    } else if (currentPath.includes('sidebar')) {
      return t('advertisements.addSidebar');
    }
    return t('advertisements.newAdvertisement');
  };

  // Get correct path for creating new ads
  const getAddPath = () => {
    if (currentPath.includes('slider')) {
      return `/${currentLanguage}/admin/advertisements/new?placement=home_slider`;
    } else if (currentPath.includes('banners')) {
      return `/${currentLanguage}/admin/advertisements/new?placement=home_banner`;
    } else if (currentPath.includes('sidebar')) {
      return `/${currentLanguage}/admin/advertisements/new?placement=sidebar`;
    }
    return `/${currentLanguage}/admin/advertisements/new`;
  };
  
  // Animation variants for page transitions
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };
  
  // Animation variants for button hover
  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)' },
    tap: { scale: 0.95 }
  };
  
  // Fetch advertisements from API
  const fetchAdvertisements = async () => {
    setIsLoading(true);
    try {
      const data = await advertisementService.getAll();
      setAdvertisements(data);
      filterAdvertisements(data, activeTab);
    } catch (error) {
      console.error('Failed to fetch advertisements:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter advertisements based on the active tab
  const filterAdvertisements = (ads: Advertisement[], tab: string) => {
    if (tab === 'all') {
      setFilteredAds(ads);
    } else if (tab === 'slider') {
      setFilteredAds(ads.filter(ad => ad.placement === 'home_slider'));
    } else if (tab === 'banners') {
      setFilteredAds(ads.filter(ad => ad.placement === 'home_banner'));
    } else if (tab === 'sidebar') {
      setFilteredAds(ads.filter(ad => ad.placement === 'sidebar'));
    }
  };
  
  // Load advertisements when component mounts
  useEffect(() => {
    fetchAdvertisements();
  }, []);
  
  // Filter ads when tab changes
  useEffect(() => {
    if (advertisements.length > 0) {
      filterAdvertisements(advertisements, activeTab);
    }
  }, [activeTab]);
  
  // Handle edit advertisement
  const handleEdit = (advertisement: Advertisement) => {
    setCurrentAdvertisement(advertisement);
    setIsModalOpen(true);
  };
  
  // Handle delete advertisement
  const handleDelete = async (id: number) => {
    if (window.confirm(t('advertisements.deleteConfirmation'))) {
      try {
        await advertisementService.delete(id);
        // Use the correct number type for the comparison
        setAdvertisements(advertisements.filter(ad => ad.id !== id));
      } catch (error) {
        console.error('Failed to delete advertisement:', error);
      }
    }
  };
  
  // Handle save advertisement
  const handleSave = (advertisement: Advertisement) => {
    setIsModalOpen(false);
    fetchAdvertisements();
  };
  
  // Handle close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentAdvertisement(null);
  };
  
  // Get placement name
  const getPlacementName = (placement: string) => {
    switch (placement) {
      case 'home_slider':
        return t('advertisements.homeSlider');
      case 'home_banner':
        return t('advertisements.homeBanner');
      case 'sidebar':
        return t('advertisements.sidebarPanel');
      default:
        return placement;
    }
  };

  return (
    <motion.div 
      className="p-2 sm:p-8 bg-white rounded-lg shadow-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      
      {/* Navigation tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px grid grid-cols-2 sm:flex space-x-10" aria-label="Tabs">
            <NavLink
              to={`/${currentLanguage}${routes.adminAdvertisementsAll}`}
              className={({isActive}) => 
                `${isActive ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} 
                whitespace-nowrap py-4 px-3 border-b-2 font-medium text-sm flex items-center transition-all duration-200`
              }
            >
              <LayoutGrid className="mr-2 h-4 w-4" />
              {t('allAdvertisements')}
            </NavLink>
            <NavLink
              to={`/${currentLanguage}${routes.adminAdvertisementsSlider}`}
              className={({isActive}) => 
                `${isActive ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} 
                whitespace-nowrap py-4 px-3 border-b-2 font-medium text-sm flex items-center transition-all duration-200`
              }
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              {t('slider')}
            </NavLink>
            <NavLink
              to={`/${currentLanguage}${routes.adminAdvertisementsBanners}`}
              className={({isActive}) => 
                `${isActive ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} 
                whitespace-nowrap py-4 px-3 border-b-2 font-medium text-sm flex items-center transition-all duration-200`
              }
            >
              <Rows className="mr-2 h-4 w-4" />
              {t('banners')}
            </NavLink>
            {/* Sidebar advertisement navigation removed as requested */}
            <NavLink
              to={`/${currentLanguage}${routes.adminAdvertisementsAnalytics}`}
              className={({isActive}) => 
                `${isActive ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} 
                whitespace-nowrap py-4 px-3 border-b-2 font-medium text-sm flex items-center transition-all duration-200`
              }
            >
              <BarChart2 className="mr-2 h-4 w-4" />
              {t('advertisements.analytics.title')}
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Content area - will be replaced by the child routes */}
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.4 }}
        className="bg-gray-50 p-6 rounded-lg"
      >
        <Outlet />
      </motion.div>
    </motion.div>
  );
};

export default AdvertisementsPage;