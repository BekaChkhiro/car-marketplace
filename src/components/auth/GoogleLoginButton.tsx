import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import socialAuthService from '../../api/services/socialAuthService';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

interface GoogleLoginButtonProps {
  onSuccess: () => void;
}

interface GoogleResponse {
  credential: string;
  email: string;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    const handleGoogleResponse = async (response: GoogleResponse) => {
      try {
        const { credential } = response;
        const data = await socialAuthService.googleLogin(credential);
        if (!data.token) {
          throw new Error('Invalid response from Google login');
        }
        await login(response.email, data.token);
        onSuccess();
      } catch (error: any) {
        showToast(error.message || 'Google-ით ავტორიზაცია ვერ მოხერხდა', 'error');
      }
    };

    // Initialize Google SDK
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [login, onSuccess, showToast]);

  const handleClick = () => {
    window.google?.accounts.id.prompt();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-[#4285F4] text-[#4285F4] rounded-xl hover:bg-[#4285F4]/5 transition-colors bg-gray-100"
    >
      <img src="/images/google-icon.svg" alt="Google" className="w-5 h-5" />
    </button>
  );
};

export default GoogleLoginButton;