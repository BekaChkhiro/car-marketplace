import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Car, 
  Heart, 
  Bell, 
  Settings, 
  Home,
  LogOut,
  PlusCircle
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const SideNavigation: React.FC = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const menuItems = [
    {
      name: 'მთავარი',
      path: '/profile',
      icon: Home
    },
    {
      name: 'ჩემი განცხადებები',
      path: '/profile/cars',
      icon: Car
    },
    {
      name: 'მანქანის დამატება',
      path: '/profile/add-car',
      icon: PlusCircle
    },
    {
      name: 'ფავორიტები',
      path: '/profile/favorites',
      icon: Heart
    },
    {
      name: 'შეტყობინებები',
      path: '/profile/notifications',
      icon: Bell,
      hasNotifications: true
    },
    {
      name: 'პარამეტრები',
      path: '/profile/settings',
      icon: Settings
    }
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
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors relative ${
                  isActive
                    ? 'text-primary bg-primary/5'
                    : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
                {item.hasNotifications && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Link>
            );
          })}
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