import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const AdminNavigation: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'დეშბორდი', path: '/admin' },
    { icon: <Users size={20} />, label: 'მომხმარებლები', path: '/admin/users' },
    { icon: <Car size={20} />, label: 'განცხადებები', path: '/admin/transports' },
    { icon: <Settings size={20} />, label: 'პარამეტრები', path: '/admin/settings' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-100 h-screen sticky top-0 shadow-sm rounded-lg">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-bold text-primary">ადმინ პანელი</h1>
      </div>

      <div className="p-4">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
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
          ))}
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100">
        <button
          onClick={logout}
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