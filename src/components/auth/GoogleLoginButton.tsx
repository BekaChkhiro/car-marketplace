import React from 'react';
import { useToast } from '../../context/ToastContext';
import socialAuthService from '../../api/services/socialAuthService';

// No need for Google SDK declaration

interface GoogleLoginButtonProps {
  onSuccess: () => void;
}

// Simple interface - no response handling needed here

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onSuccess }) => {
  const { showToast } = useToast();

  const handleClick = () => {
    try {
      // Redirect to Google OAuth login page
      const authUrl = socialAuthService.initiateGoogleLogin();
      window.location.href = authUrl;
    } catch (error: any) {
      showToast('Google-ით ავტორიზაცია ვერ მოხერხდა', 'error');
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-[#4285F4] text-[#4285F4] rounded-xl hover:bg-[#4285F4]/5 transition-colors bg-gray-100"
      aria-label="Google-ით შესვლა"
    >
      <img src="/images/google-icon.svg" alt="Google" className="w-5 h-5" />
    </button>
  );
};

export default GoogleLoginButton;