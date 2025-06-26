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
      if (authResponse.token) {
        await login(email, authResponse.token);
      }
      onSuccess();
    } catch (error: any) {
      showToast(error.message || 'Facebook-ით ავტორიზაცია ვერ მოხერხდა', 'error');
    }
  }, [login, onSuccess, showToast]);

  useEffect(() => {
    // Initialize Facebook SDK
    console.log('Initializing Facebook SDK with App ID:', process.env.REACT_APP_FACEBOOK_APP_ID);
    
    if (!process.env.REACT_APP_FACEBOOK_APP_ID) {
      console.error('REACT_APP_FACEBOOK_APP_ID is not defined in .env file');
      showToast('Facebook App ID is not configured', 'error');
      return;
    }
    
    window.fbAsyncInit = () => {
      console.log('Facebook SDK loaded, initializing...');
      window.FB?.init({
        appId: process.env.REACT_APP_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });
      console.log('Facebook SDK initialized');
    };

    // Load Facebook SDK
    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    script.onload = () => console.log('Facebook SDK script loaded');
    script.onerror = (e) => console.error('Error loading Facebook SDK:', e);
    document.body.appendChild(script);

    return () => {
      try {
        document.body.removeChild(script);
        delete window.fbAsyncInit;
      } catch (error) {
        console.error('Error cleaning up Facebook SDK:', error);
      }
    };
  }, [showToast]);

  const handleClick = () => {
    console.log('Facebook login button clicked');
    
    if (!window.FB) {
      console.error('Facebook SDK not loaded or initialized');
      showToast('Facebook SDK not loaded. Please try again later.', 'error');
      return;
    }
    
    try {
      window.FB.login((response) => {
        console.log('Facebook login response:', response);
        
        if (response.authResponse) {
          console.log('Facebook auth successful, getting user info');
          
          window.FB.api('/me', { fields: 'email' }, (userInfo) => {
            console.log('Facebook user info:', userInfo);
            
            if (!userInfo.email) {
              console.error('Facebook did not return email');
              showToast('Could not get email from Facebook. Please try another login method.', 'error');
              return;
            }
            
            handleFacebookResponse({
              email: userInfo.email,
              accessToken: response.authResponse.accessToken
            });
          });
        } else {
          console.log('User cancelled login or did not fully authorize');
          showToast('Facebook login was cancelled or not authorized', 'info');
        }
      }, { scope: 'email' });
    } catch (error) {
      console.error('Error during Facebook login:', error);
      showToast('Error during Facebook login. Please try again.', 'error');
    }
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