import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import socialAuthService from '../../api/services/socialAuthService';

const FacebookCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUserData } = useAuth();
  const { showToast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the code from the URL
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        
        if (!code) {
          throw new Error('Authorization code not found');
        }
        
        // Exchange the code for tokens
        const response = await socialAuthService.handleFacebookCallback(code);
        
        // Update user state
        if (response.user) {
          await refreshUserData();
        }
        
        // Show success message
        showToast('Facebook-ით ავტორიზაცია წარმატებით დასრულდა', 'success');
        
        // Redirect to home or intended destination
        const redirectTo = localStorage.getItem('redirectAfterLogin') || '/';
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectTo);
      } catch (err: any) {
        console.error('Facebook callback error:', err);
        setError(err.message || 'Facebook-ით ავტორიზაცია ვერ მოხერხდა');
        showToast(err.message || 'Facebook-ით ავტორიზაცია ვერ მოხერხდა', 'error');
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate('/auth/login');
        }, 3000);
      } finally {
        setLoading(false);
      }
    };
    
    handleCallback();
  }, [location, navigate, refreshUserData, showToast]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">გთხოვთ დაელოდოთ</h2>
          <p className="text-gray-600">მიმდინარეობს Facebook-ით ავტორიზაცია...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full">
          <div className="bg-red-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2 text-red-600">ავტორიზაცია ვერ მოხერხდა</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-gray-500 text-sm">გადამისამართება მიმდინარეობს...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">გადამისამართება</h2>
        <p className="text-gray-600">გთხოვთ დაელოდოთ...</p>
      </div>
    </div>
  );
};

export default FacebookCallback;
