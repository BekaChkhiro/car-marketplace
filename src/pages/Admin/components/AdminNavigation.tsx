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
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface AdminNavigationProps {
  onCloseMobileMenu?: () => void;
}

const AdminNavigation: React.FC<AdminNavigationProps> = ({ onCloseMobileMenu }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const { lang } = useParams<{ lang: string }>();

  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  // Check if advertisements menu should be expanded based on current path
  const isAdvertisementsPath = location.pathname.includes('/admin/advertisements');
  
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

  // Top level nav items
  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'დაფა', path: buildPath('/admin') },
    { icon: <Users size={20} />, label: 'მომხმარებლები', path: buildPath('/admin/users') },
    { icon: <Car size={20} />, label: 'განცხადებები', path: buildPath('/admin/cars') },
    { icon: <Building size={20} />, label: 'ავტოსალონები', path: buildPath('/admin/autosalons') },
    { icon: <UserCheck size={20} />, label: 'დილერების მართვა', path: buildPath('/admin/dealers') },
    { icon: <Package size={20} />, label: 'ნაწილები', path: buildPath('/admin/parts') },
    { icon: <CreditCard size={20} />, label: 'ტრანზაქციები', path: buildPath('/admin/transactions') },
    { icon: <Award size={20} />, label: 'VIP განცხადებები', path: buildPath('/admin/vip-listings') },
    { icon: <Activity size={20} />, label: 'ანალიტიკა', path: buildPath('/admin/analytics') },
    { 
      icon: <Image size={20} />, 
      label: 'რეკლამები', 
      path: buildPath('/admin/advertisements'),
      hasSubmenu: true,
      submenuId: 'advertisements',
      submenu: [
        { icon: <LayoutGrid size={18} />, label: 'ყველა რეკლამა', path: buildPath('/admin/advertisements/all') },
        { icon: <SlidersHorizontal size={18} />, label: 'სლაიდერი', path: buildPath('/admin/advertisements/slider') },
        { icon: <Rows size={18} />, label: 'ბანერები', path: buildPath('/admin/advertisements/banners') },
        { icon: <BarChart2 size={18} />, label: 'ანალიტიკა', path: buildPath('/admin/advertisements/analytics') },
      ]
    },
    { icon: <Settings size={20} />, label: 'პარამეტრები', path: buildPath('/admin/settings') },
  ];
  
  // Auto-expand advertisements menu if we're in that section
  React.useEffect(() => {
    if (isAdvertisementsPath && !expandedMenus.includes('advertisements')) {
      setExpandedMenus([...expandedMenus, 'advertisements']);
    }
  }, [location.pathname, isAdvertisementsPath, expandedMenus]);
  return (
    <div className="w-64 bg-white border-r border-gray-100  shadow-sm rounded-lg overflow-y-auto">
      <div className="p-4 sm:p-6 border-b border-gray-100 flex items-left justify-center relative">
        <h1 className="text-lg sm:text-xl  font-bold text-primary  mr-2">ადმინ პანელი</h1>
        {/* Close button for mobile - positioned absolute right */}
        {onCloseMobileMenu && (
          <button 
            onClick={onCloseMobileMenu}
            className="lg:hidden p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 absolute right-4"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="p-4">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.hasSubmenu && item.submenu?.some(subItem => location.pathname === subItem.path));
            
            const isExpanded = item.hasSubmenu && expandedMenus.includes(item.submenuId!);
            
            return (
              <div key={item.path} className="flex flex-col">
                {/* Main menu item */}
                {item.hasSubmenu ? (
                  <button
                    onClick={() => toggleMenu(item.submenuId!)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                      isActive ? 'bg-primary/10 text-primary font-medium' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 ">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {isExpanded ? 
                      <ChevronDown size={18} className="text-gray-400" /> : 
                      <ChevronRight size={18} className="text-gray-400" />}
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                      location.pathname === item.path
                        ? 'bg-primary text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                )}
                
                {/* Submenu items, shown when expanded */}
                {item.hasSubmenu && item.submenu && isExpanded && (
                  <div className="pl-4 mt-1 mb-1 space-y-1 overflow-hidden transition-all duration-300">
                    {item.submenu.map(subItem => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left text-sm transition-all duration-300 ${
                          location.pathname === subItem.path
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-gray-600 hover:bg-gray-100'
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
        </nav>
      </div>      <div className="sticky bottom-0 left-0 right-0 p-4 sm:p-6 border-t border-gray-100 bg-white mt-8">
        <button
          onClick={() => {
            if (onCloseMobileMenu) onCloseMobileMenu();
            logout();
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-red-600 hover:bg-red-50 transition-all duration-300"
        >
          <LogOut size={20} />
          <span>გასვლა</span>
        </button>
      </div>
    </div>
  );
};

export default AdminNavigation;