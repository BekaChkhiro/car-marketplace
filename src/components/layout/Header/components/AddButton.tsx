import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../context/AuthContext';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';

const AddButton = () => {
  const { t } = useTranslation('header');
  const { isAuthenticated } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setIsLoginOpen(true);
    }
  };

  return (
    <>
      <Link 
        to="/profile/add-car" 
        onClick={handleClick}
        className="flex items-center space-x-2 bg-primary text-white px-4 py-2 
          rounded-xl hover:bg-secondary transition-all duration-200 
          transform hover:scale-105 shadow-sm hover:shadow-md"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm font-medium">{t('addCar')}</span>
      </Link>

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

export default AddButton;