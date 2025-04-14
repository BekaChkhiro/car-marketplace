import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Car } from '../api/types/car.types';
import wishlistService from '../api/services/wishlistService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface WishlistContextType {
  wishlistCars: Car[];
  wishlistCount: number;
  isInWishlist: (carId: number) => Promise<boolean>;
  addToWishlist: (carId: number) => Promise<void>;
  removeFromWishlist: (carId: number) => Promise<void>;
  clearWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistCars, setWishlistCars] = useState<Car[]>([]);
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistCars([]);
      return;
    }
    
    try {
      const cars = await wishlistService.getWishlist();
      setWishlistCars(cars);
    } catch (error: any) {
      console.error('Error fetching wishlist:', error);
      setWishlistCars([]);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = async (carId: number): Promise<boolean> => {
    if (!isAuthenticated) return false;
    try {
      return await wishlistService.isInWishlist(carId);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
      return false;
    }
  };

  const addToWishlist = async (carId: number): Promise<void> => {
    if (!isAuthenticated) {
      showToast('Please log in to add to wishlist', 'error');
      return;
    }
    try {
      await wishlistService.addToWishlist(carId);
      await fetchWishlist();
    } catch (error: any) {
      throw error;
    }
  };

  const removeFromWishlist = async (carId: number): Promise<void> => {
    try {
      await wishlistService.removeFromWishlist(carId);
      await fetchWishlist();
    } catch (error: any) {
      throw error;
    }
  };

  const clearWishlist = async (): Promise<void> => {
    try {
      await wishlistService.clearWishlist();
      setWishlistCars([]);
    } catch (error: any) {
      throw error;
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlistCars,
      wishlistCount: wishlistCars.length,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      clearWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};