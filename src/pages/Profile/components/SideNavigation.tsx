import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Heart, Bell, Settings, LogOut, ChevronRight, PlusCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  badge?: number;
}

interface SideNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const SideNavigation: React.FC<SideNavigationProps> = ({ activeTab, onTabChange }) => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const navItems: NavItem[] = [
    { icon: <User size={20} />, label: 'პროფილი', path: '/profile' },
    { icon: <PlusCircle size={20} />, label: 'მანქანის დამატება', path: '/profile/add-car' },
    { icon: <Heart size={20} />, label: 'ფავორიტები', path: '/profile/favorites', badge: 5 },
    { icon: <Bell size={20} />, label: 'შეტყობინებები', path: '/profile/notifications', badge: 3 },
    { icon: <Settings size={20} />, label: 'პარამეტრები', path: '/profile/settings' },
  ];

  return (
    <div className="w-72 bg-white border-r border-gray-100 h-screen sticky top-0 shadow-sm rounded-lg">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white shadow-lg">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{user?.username}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-300 group hover:shadow-md ${
                location.pathname === item.path
                  ? 'bg-primary text-white shadow-lg transform scale-[1.02]'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`transition-transform duration-300 ${
                  location.pathname === item.path ? 'transform scale-110' : ''
                }`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    location.pathname === item.path
                      ? 'bg-white text-primary'
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {item.badge}
                  </span>
                )}
                <ChevronRight 
                  size={16} 
                  className={`transition-transform duration-300 ${
                    location.pathname === item.path ? 'translate-x-1 opacity-100' : 'opacity-0'
                  }`}
                />
              </div>
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100 bg-white rounded-lg">
        <button
          onClick={logout}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-red-600 hover:bg-red-50 transition-all duration-300 hover:shadow-md group"
        >
          <div className="flex items-center gap-3">
            <LogOut size={20} className="transition-transform duration-300 group-hover:-translate-x-1" />
            <span>გასვლა</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default SideNavigation;