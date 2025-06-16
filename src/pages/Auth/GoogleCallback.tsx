import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import socialAuthService from '../../api/services/socialAuthService';
import { useLoading } from '../../context/LoadingContext';

const GoogleCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { showLoading, hideLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      showLoading();
      try {
        // Get code from URL query params
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');

        if (!code) {
          throw new Error('კოდი არ იქნა მიღებული Google-დან');
        }

        // Process Google callback
        await socialAuthService.handleGoogleCallback(code);
        
        // Show success message and redirect
        showToast('Google-ით ავტორიზაცია წარმატებით დასრულდა', 'success');
        navigate('/');
      } catch (error: any) {
        console.error('Google callback error:', error);
        setError(error.message || 'Google-ით ავტორიზაცია ვერ მოხერხდა');
        showToast(error.message || 'Google-ით ავტორიზაცია ვერ მოხერხდა', 'error');
        navigate('/auth/login');
      } finally {
        hideLoading();
      }
    };

    handleCallback();
  }, [location, navigate, showToast, showLoading, hideLoading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {error ? (
          <>
            <h2 className="text-2xl font-bold text-red-600 mb-4">ავტორიზაციის შეცდომა</h2>
            <p className="text-gray-700">{error}</p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Google-ით ავტორიზაცია</h2>
            <p className="text-gray-700">გთხოვთ დაელოდოთ, მიმდინარეობს ავტორიზაცია...</p>
            <div className="mt-6 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleCallback;
