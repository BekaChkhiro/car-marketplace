import { User, LogOut, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';
import { useAuth } from '../../../../context/AuthContext';

const AuthButtons = () => {
  const { t } = useTranslation('header');
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  if (isAuthenticated && user) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center space-x-2 text-sm font-medium bg-primary text-white 
            px-4 py-2 rounded-xl hover:bg-secondary transition-all duration-300 
            transform hover:scale-105 shadow-sm hover:shadow-md 
            border-2 border-transparent hover:border-secondary"
        >
          <User className="w-5 h-5" />
          <span>{user.username}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 border border-gray-100">
            <button
              onClick={() => {
                navigate(user.role === 'admin' ? '/admin' : '/profile');
                setIsMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span>{user.role === 'admin' ? t('adminPanel') : t('profile')}</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('logout')}</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center space-x-3">
        <button 
          onClick={() => setIsLoginOpen(true)}
          className="flex items-center space-x-2 text-sm font-medium bg-primary text-white 
            px-4 py-2 rounded-xl hover:bg-secondary transition-all duration-300 
            transform hover:scale-105 shadow-sm hover:shadow-md 
            border-2 border-transparent hover:border-secondary"
        >
          <User className="w-5 h-5" />
          <span>{t('login')}</span>
        </button>
      </div>

      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onShowRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />
      <RegisterModal 
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </>
  );
};

export default AuthButtons;