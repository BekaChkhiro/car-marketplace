import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import LoadingOverlay from '../components/common/LoadingOverlay';

interface LoadingContextType {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  showLoading: () => {},
  hideLoading: () => {},
});

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCount, setLoadingCount] = useState(0);

  // Reset loading state if stuck for too long
  useEffect(() => {
    if (!isLoading) return;

    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn('Loading state was stuck for too long, resetting...');
        setLoadingCount(0);
        setIsLoading(false);
      }
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timeout);
  }, [isLoading]);

  const showLoading = () => {
    setLoadingCount(prev => {
      const newCount = prev + 1;
      setIsLoading(true);
      return newCount;
    });
  };

  const hideLoading = () => {
    setLoadingCount(prev => {
      const newCount = Math.max(0, prev - 1);
      if (newCount === 0) {
        setIsLoading(false);
      }
      return newCount;
    });
  };

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
      {children}
      <LoadingOverlay isVisible={isLoading} />
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);