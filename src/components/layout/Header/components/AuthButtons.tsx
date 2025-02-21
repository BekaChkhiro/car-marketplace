import { User } from 'lucide-react';
import { useState } from 'react';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';

const AuthButtons = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

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
          <span>შესვლა</span>
        </button>
      </div>

      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {
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