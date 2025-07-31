import React, { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Car,
  Settings,
  LogOut,
  Image,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  SlidersHorizontal,
  Rows,
  PanelRight,
  BarChart2,
  CreditCard,
  Award,
  Package,
  X,
  Activity,
  Building,
  UserCheck,
  User,
  DollarSign,
  FileText
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../../i18n';

interface AdminNavigationProps {
  onCloseMobileMenu?: () => void;
}

const AdminNavigation: React.FC<AdminNavigationProps> = ({ onCloseMobileMenu }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const { lang } = useParams<{ lang: string }>();
  const { t } = useTranslation([namespaces.admin]);

  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  // Check if advertisements menu should be expanded based on current path
  const isAdvertisementsPath = location.pathname.includes('/admin/advertisements');
  
  // Check if settings menu should be expanded based on current path
  const isSettingsPath = location.pathname.includes('/admin/settings') || location.pathname.includes('/admin/vip-settings') || location.pathname.includes('/admin/terms');
  
  // Toggle submenu expansion
  const toggleMenu = (menu: string) => {
    if (expandedMenus.includes(menu)) {
      setExpandedMenus(expandedMenus.filter(item => item !== menu));
    } else {
      setExpandedMenus([...expandedMenus, menu]);
    }
  };

  // Helper to build language-aware paths
  const buildPath = (path: string): string => {
    return lang ? `/${lang}${path}` : path;
  };

  // Navigation sections with items
  const navSections = [
    {
      title: 'მთავარი',
      items: [
        { icon: <LayoutDashboard size={20} />, label: t('admin:navigation.dashboard'), path: buildPath('/admin') },
        { icon: <Activity size={20} />, label: t('admin:navigation.analytics'), path: buildPath('/admin/analytics') },
      ]
    },
    {
      title: 'მომხმარებლები',
      items: [
        { icon: <Users size={20} />, label: t('admin:navigation.users'), path: buildPath('/admin/users') },
        { icon: <Building size={20} />, label: t('admin:navigation.autosalons'), path: buildPath('/admin/autosalons') },
        { icon: <UserCheck size={20} />, label: t('admin:navigation.dealers'), path: buildPath('/admin/dealers') },
      ]
    },
    {
      title: 'კონტენტის მართვა',
      items: [
        { icon: <Car size={20} />, label: t('admin:navigation.cars'), path: buildPath('/admin/cars') },
        { icon: <Package size={20} />, label: t('admin:navigation.parts'), path: buildPath('/admin/parts') },
        { icon: <Award size={20} />, label: t('admin:navigation.vipListings'), path: buildPath('/admin/vip-listings') },
        { 
          icon: <Image size={20} />, 
          label: t('admin:navigation.advertisements'), 
          path: buildPath('/admin/advertisements'),
          hasSubmenu: true,
          submenuId: 'advertisements',
          submenu: [
            { icon: <LayoutGrid size={18} />, label: t('admin:advertisements.allAdvertisements'), path: buildPath('/admin/advertisements/all') },
            { icon: <SlidersHorizontal size={18} />, label: t('admin:advertisements.slider'), path: buildPath('/admin/advertisements/slider') },
            { icon: <Rows size={18} />, label: t('admin:advertisements.banners'), path: buildPath('/admin/advertisements/banners') },
            { icon: <BarChart2 size={18} />, label: t('advertisements.analytics.title'), path: buildPath('/admin/advertisements/analytics') },
          ]
        },
      ]
    },
    {
      title: 'ფინანსები',
      items: [
        { icon: <CreditCard size={20} />, label: t('admin:navigation.transactions'), path: buildPath('/admin/transactions') },
        { icon: <DollarSign size={20} />, label: t('admin:navigation.vipPricing'), path: buildPath('/admin/vip-settings') },
      ]
    },
    {
      title: 'კონფიგურაცია',
      items: [
        { icon: <User size={20} />, label: t('admin:navigation.profile'), path: buildPath('/admin/settings') },
        { icon: <FileText size={20} />, label: 'წესები & პირობები', path: buildPath('/admin/terms') },
      ]
    }
  ];
  
  // Auto-expand advertisements menu if we're in that section
  React.useEffect(() => {
    let newExpandedMenus = [...expandedMenus];
    
    if (isAdvertisementsPath && !expandedMenus.includes('advertisements')) {
      newExpandedMenus.push('advertisements');
    }
    
    if (newExpandedMenus.length !== expandedMenus.length) {
      setExpandedMenus(newExpandedMenus);
    }
  }, [location.pathname, isAdvertisementsPath, expandedMenus]);
  return (
    <div className="w-64 bg-white border-r border-gray-100 shadow-sm rounded-lg flex flex-col h-full">
      {/* Mobile close button only */}
      {onCloseMobileMenu && (
        <div className="lg:hidden p-4 border-b border-gray-100 flex justify-end">
          <button 
            onClick={onCloseMobileMenu}
            className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
      )}

      <div className="p-4 flex-1 overflow-y-auto">
        <nav className="space-y-4">
          {navSections.map((section, sectionIndex) => (
            <div key={section.title}>
              {/* Section Header */}
              <div className="px-2 mb-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {section.title}
                </h3>
              </div>
              
              {/* Section Items */}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path || 
                    (item.hasSubmenu && item.submenu?.some(subItem => location.pathname === subItem.path));
                  
                  const isExpanded = item.hasSubmenu && expandedMenus.includes(item.submenuId!);
                  
                  return (
                    <div key={item.path} className="flex flex-col">
                      {/* Main menu item */}
                      {item.hasSubmenu ? (
                        <button
                          onClick={() => toggleMenu(item.submenuId!)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                            isActive ? 'bg-primary/10 text-primary font-medium' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {item.icon}
                            <span className="text-sm">{item.label}</span>
                          </div>
                          {isExpanded ? 
                            <ChevronDown size={16} className="text-gray-400" /> : 
                            <ChevronRight size={16} className="text-gray-400" />}
                        </button>
                      ) : (
                        <Link
                          to={item.path}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                            location.pathname === item.path
                              ? 'bg-primary text-white shadow-sm'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {item.icon}
                          <span className="text-sm">{item.label}</span>
                        </Link>
                      )}
                      
                      {/* Submenu items, shown when expanded */}
                      {item.hasSubmenu && item.submenu && isExpanded && (
                        <div className="pl-8 mt-1 mb-1 space-y-1">
                          {item.submenu.map(subItem => (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-left text-sm transition-all duration-200 ${
                                location.pathname === subItem.path
                                  ? 'bg-primary/10 text-primary font-medium'
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              {subItem.icon}
                              <span>{subItem.label}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Section Divider */}
              {sectionIndex < navSections.length - 1 && (
                <div className="mt-3 border-t border-gray-200"></div>
              )}
            </div>
          ))}
        </nav>
      </div>
      
      <div className="border-t border-gray-100 bg-white p-4">
        <button
          onClick={() => {
            if (onCloseMobileMenu) onCloseMobileMenu();
            logout();
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-red-600 hover:bg-red-50 transition-all duration-300"
        >
          <LogOut size={20} />
          <span>{t('admin:navigation.logout')}</span>
        </button>
      </div>
    </div>
  );
};

export default AdminNavigation;