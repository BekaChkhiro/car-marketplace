import React, { useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import socialAuthService from '../../api/services/socialAuthService';

declare global {
  interface Window {
    FB?: {
      init: (params: any) => void;
      login: (callback: (response: any) => void, params: any) => void;
      api: (path: string, params: any, callback: (response: any) => void) => void;
    };
    fbAsyncInit?: () => void;
  }
}

interface FacebookLoginButtonProps {
  onSuccess: () => void;
}

const FacebookLoginButton: React.FC<FacebookLoginButtonProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const { showToast } = useToast();

  const handleFacebookResponse = useCallback(async (response: { email: string; accessToken: string }) => {
    try {
      const { email, accessToken } = response;
      const authResponse = await socialAuthService.facebookLogin(accessToken);
      // Use the regular login method with the token
      if (authResponse.tokens) {
        await login(email, authResponse.tokens.accessToken);
      } else if (authResponse.token) {
        await login(email, authResponse.token);
      }
      onSuccess();
    } catch (error: any) {
      showToast(error.message || 'Facebook-ით ავტორიზაცია ვერ მოხერხდა', 'error');
    }
  }, [login, onSuccess, showToast]);

  useEffect(() => {
    // Initialize Facebook SDK
    window.fbAsyncInit = () => {
      window.FB?.init({
        appId: process.env.REACT_APP_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });
    };

    // Load Facebook SDK
    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      delete window.fbAsyncInit;
    };
  }, []);

  const handleClick = () => {
    window.FB?.login((response) => {
      if (response.authResponse) {
        window.FB?.api('/me', { fields: 'email' }, (userInfo) => {
          handleFacebookResponse({
            email: userInfo.email,
            accessToken: response.authResponse.accessToken
          });
        });
      }
    }, { scope: 'email' });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-[#1877F2] text-[#1877F2] rounded-xl hover:bg-[#1877F2]/5 transition-colors bg-gray-100"
    >
      <img src="/images/facebook-icon.svg" alt="Facebook" className="w-5 h-5" />
    </button>
  );
};

export default FacebookLoginButton;